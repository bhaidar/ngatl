import {
  Component,
  Input,
  NgZone,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { action, ConfirmOptions } from 'tns-core-modules/ui/dialogs';
// nativescript
import { create } from 'nativescript-imagepicker';
import { isIOS, } from 'tns-core-modules/platform';
import { isAndroid } from 'tns-core-modules/platform';
import { ImageFormat } from 'tns-core-modules/ui/enums';
import * as TNSUtils from 'tns-core-modules/utils/utils';
import { File, path, knownFolders } from 'tns-core-modules/file-system';
import * as tnsHttp from 'tns-core-modules/http';
import {
  fromNativeSource,
  fromAsset,
  fromUrl,
  ImageSource,
} from 'tns-core-modules/image-source';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { ImageCropper, Result } from 'nativescript-imagecropper';
// libs
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import {
  ICoreState,
  LogService,
  WindowService,
  ProgressService,
  ModalActions,
  ModalState,
  BaseComponent,
  UserService,
} from '@ngatl/core';
import { safeSplit } from '@ngatl/utils';
// app
import { AWSService } from '@ngatl/nativescript/core/services/aws.service';
import { AppService } from '@ngatl/nativescript/core/services/app.service';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, skip } from 'rxjs/operators';

declare var android;

function isImageAsset(image: ImageAsset | ImageSource | string): image is ImageAsset {
  return typeof (<ImageAsset>image).getImageAsync !== 'undefined';
}
function isImageSource(image: ImageAsset | ImageSource | string): image is ImageSource {
  return typeof (<ImageSource>image).setNativeSource !== 'undefined';
}
function isImageUrl(image: ImageAsset | ImageSource | string): image is string {
  return typeof image === 'string';
}

@Component({
  moduleId: module.id,
  selector: 'ns-picture',
  templateUrl: './picture.component.html',
})
export class PictureComponent extends BaseComponent implements OnInit {

  public activeImage$: BehaviorSubject<ImageAsset | ImageSource | string> = new BehaviorSubject(null);
  public stretch = 'aspectFit';
  public imageUploaded$: Subject<string> = new Subject();
  public defaultImageUrl: string;

  @Input()
  public set selectedImage(value: ImageAsset | ImageSource | string) {
    if (this._activeImage !== value) {
      this._activeImage = value;
      if (value && typeof value === 'string' && value.indexOf('http') > -1) {
        tnsHttp.getImage(value).then(img => {
          this.log.debug('set selectedImage tnsHttp got image:', img);
          this._ngZone.run(() => {
            this.activeImage$.next(img);
          })
        }, err => {});
      } else {
        this.activeImage$.next(value);
      }
    }
  }
  @Input()
  public addOnly: boolean;
  @Output()
  public uploadedImage: EventEmitter<string> = new EventEmitter();
  @Output()
  public deleteImage: EventEmitter<boolean> = new EventEmitter();

  private _activeImage: ImageAsset | ImageSource | string;
  private _placeholder: ImageAsset | ImageSource | string;
  private _imageSub: Subscription;
  private _cameraSub: Subscription;
  private _cropper: ImageCropper;
  private _cropSelected = false;
  private _base64ImgToUpload: string;
  private _uploadFilename: string;
  private _uploadErrorMessage: string;
  private _imageOptions = {
    width: 1500,
    height: 1125,
  };

  private photoAlbumLabel: string;
  private cameraLabel: string;
  private editLabel: string;
  private deleteLabel: string;
  private confirmDeleteMessage: string;
  private okButtonText: string;
  private cancelButtonText: string;
  private _reRenderFired = false;

  constructor(
    public store: Store<ICoreState>,
    public log: LogService,
    public appService: AppService,
    private _progressService: ProgressService,
    private _ngZone: NgZone,
    private _win: WindowService,
    private _cdRef: ChangeDetectorRef,
    private _translateService: TranslateService,
    private _userService: UserService,
    private _awsService: AWSService,
  ) {
    super();
    this._cropper = new ImageCropper();
  }

  public ngOnInit() {
    this._placeholder = this.addOnly ? 'res://uploadphoto' : 'res://uploadpic';
    if (this.addOnly) {
      this.selectedImage = this._placeholder;
    } else if (!this._activeImage) {
      this.selectedImage = this._placeholder;
    }
    this.log.debug('this._activeImage:', this._activeImage);
    this._uploadErrorMessage = this._translateService.instant('error.upload-photo-lbl');
    this.photoAlbumLabel = this._translateService.instant('general.photo-album-tle');
    this.cameraLabel = this._translateService.instant('dialogs.camera');
    this.editLabel = this._translateService.instant('general.edit');
    this.deleteLabel = this._translateService.instant('item.delete-lbl');
    this.confirmDeleteMessage = this._translateService.instant('dialogs.confirm-photo-delete');
    this.okButtonText = this._translateService.instant('dialogs.yes');
    this.cancelButtonText = this._translateService.instant('dialogs.cancel');
  }

  private _resetLocals() {
    this._base64ImgToUpload = undefined;
    this._uploadFilename = undefined;
  }

  public choose() {
    const options: any = {
      cancelButtonText: this.cancelButtonText,
    };
    const actions = [this.photoAlbumLabel];
    let isCameraAvailable = false;
    if (isIOS) {
      isCameraAvailable = UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.Camera);
    } else {

      isCameraAvailable = TNSUtils.ad.getApplicationContext().getPackageManager().hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA);
    }
    if (isCameraAvailable) {
      actions.push(this.cameraLabel);
    }
    if (this._activeImage && this._activeImage !== this._placeholder) {
      actions.push(this.editLabel);
      actions.push(this.deleteLabel);
      options.actions = actions;
      action(options).then((result: string) => {
        this.log.debug(result);
        this._chooseAction(result);
      });
    } else {
      options.actions = actions;
      action(options).then((result: string) => {
        this.log.debug(result);
        this._chooseAction(result);
      });
    }
  }

  private _chooseAction(result) {
    const permissionDesc = 'We need these permissions to take and choose pictures.';
    switch (result) {
      case this.photoAlbumLabel:
        this.appService.handlePermission(isAndroid ? [
          android.Manifest.permission.CAMERA,
          android.Manifest.permission.READ_EXTERNAL_STORAGE,
          android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
        ] : [], permissionDesc).then((granted: boolean) => {
          if (granted) {
            this._chooseImage();
          }
        }, () => {
          this.log.debug('user canceled image picker.');
          this._win.setTimeout(_ => {
            this._win.alert(`You have previously rejected Photo Album permissions on this device. Please go to the device 'Settings > Security' to adjust.`);
          }, 400);
        });
        break;

      case this.cameraLabel:
        this.appService.handlePermission(isAndroid ? [
          android.Manifest.permission.CAMERA,
          android.Manifest.permission.READ_EXTERNAL_STORAGE,
          android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
        ] : [], permissionDesc).then((granted: boolean) => {
          if (granted) {
            // avoid double dialog present issues
            this._win.setTimeout(_ => {
              this._takePicture();
            }, 400);
          }
        }, () => {
          this.log.debug('no permissions.');
          this._win.setTimeout(_ => {
            this._win.alert(`You have previously rejected camera permissions on this device. Please go to the device 'Settings > Security' to adjust.`);
          }, 400);
        });
        break;

      case this.editLabel:
        if (isImageUrl(this._activeImage)) {
          this._progressService.toggleSpinner(true);
          this._urlToImageSource(true);
        } else if (isImageAsset(this._activeImage)) {
          this._progressService.toggleSpinner(true);
          this._imageAssetToImageSource(true);
        } else if (isImageSource(this._activeImage)) {
          this._showCropper(this._activeImage, 'jpeg');
        } else {
          this._showUploadError(3);
        }
        break;

      case this.deleteLabel:
        const confirmOptions: ConfirmOptions = {
          message : this.confirmDeleteMessage,
          okButtonText : this.okButtonText,
          cancelButtonText : this.cancelButtonText,
        };
        this._win.confirm(<any>confirmOptions, (r: boolean) => {
          this._ngZone.run(() => {
            this._cropSelected = false;
            this.selectedImage = this._placeholder;
            this.deleteImage.next(true);
          });   
        });
        break;
    }
  }

  private _takePicture() {
    const options = {
      width: this._imageOptions.width,
      height: this._imageOptions.height,
      keepAspectRatio: true,
      saveToGallery: true,
    };
    this._resetCamera(true)
      .then(_ => {
        // this.log.debug('setting up _cameraSub');
        this._cameraSub = this.store
          .pipe(
            select((s: ICoreState) => s.ui.modal),
          takeUntil(this.destroy$),
          skip(1) // only react
          ).subscribe((modal: ModalState.IState) => {
            if (modal.latestResult) {
              const imageAsset = modal.latestResult;

              this._resetCamera(true)
                .then(_ => {
                  if (isIOS) {
                    fromAsset(imageAsset).then((imageSource: ImageSource) => {
                        (<any>imageSource).nativeImage = imageSource.ios;
                        this._showCropper(imageSource, 'jpeg');

                    }, (err) => {
                      this.log.debug('error with fromAsset(imageAsset):', err);
                    });
                  } else {
                    const bitmapOptions = new android.graphics.BitmapFactory
                    .Options();
                    bitmapOptions.inJustDecodeBounds = true;
                    this.log.debug('imageAsset.android:', imageAsset.android);
                    // const uri = android.net.Uri.fromFile(new java.io.File(imageAsset.android));
                    let bitmap = android.graphics.BitmapFactory.decodeFile(imageAsset.android, bitmapOptions);
                    this.log.debug('bitmap inJustDecodeBounds/true:', bitmap);
                    bitmapOptions.inSampleSize = this._calculateInSampleSize(bitmapOptions, 300, 300);

                    // decode with inSampleSize set now
                    bitmapOptions.inJustDecodeBounds = false;

                    bitmap = android.graphics.BitmapFactory.decodeFile(imageAsset.android, bitmapOptions);
                    this.log.debug('bitmap:', bitmap);
                    const imageSource = fromNativeSource(bitmap);
                    this.log.debug('imageSource:', imageSource);
                    // console.log('took a picture from camera and used fromNativeSource to get an imageSource, .android Bitmap
                    // here:', imageSource.android);
                    this._showCropper(imageSource, 'jpeg');
                  }
                });

            }
          });

        // this.log.debug('opening CameraModalComponent');
        this.store.dispatch(new ModalActions.OpenAction({
          cmpType: CameraModalComponent,
          modalOptions: {
            fullscreen: true, // ensures camera is fullscreen on tablets
            viewContainerRef: this.appService.currentVcRef,
            context: options,
          },
        }));
      });
  }

  private _resetCamera(resetModalState?: boolean) {
    return new Promise((resolve) => {
      if (this._cameraSub) {
        this._cameraSub.unsubscribe();
        this._cameraSub = undefined;
      }
      if (resetModalState) {
        // reset result
        this.store.dispatch(new ModalActions.ClosedAction({
          open: false,
          latestResult: null,
        }));
        // give state a moment to clear before resolving
        this._win.setTimeout(
          _ => {
            resolve();
          }, 400);
      } else {
        resolve();
      }
    });
  }

  private _calculateInSampleSize(options, reqWidth: number, reqHeight: number) {
    // Raw height and width of image
    const height = options.outHeight;
    const width = options.outWidth;
    let inSampleSize = 1;

    if (height > reqHeight || width > reqWidth) {

      const halfHeight = height / 2;
      const halfWidth = width / 2;

      // Calculate the largest inSampleSize value that is a power of 2 and keeps both
      // height and width larger than the requested height and width.
      while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
        inSampleSize *= 2;
      }
    }

    return inSampleSize;
  }

  private _chooseImage() {
    return new Promise((
      resolve,
      reject,
    ) => {
      const context = create(<any>{
        mode: 'single',
        newestFirst: true,
        android: {
          read_external_storage: 'To access your images.',
        },
      });
      context.present().then((selections: any) => {
        if (selections && selections.length) {
          const asset = selections[0];
          let requestingImage = false; // used to help avoid potential Apple bug with double callback on request for image size (does not effect Android)

          // console.log('asset:', asset);
          // for (const key in asset) {
          //   console.log(key, asset[key]);
          // }

          // most often going to be a png
          let format: any = 'png';

          if (asset) {
            if (asset.fileUri) {
              try {
                // try to determine format from file
                const fileUrl = asset.fileUri.toLowerCase();
                const fileParts = safeSplit(fileUrl, '.');
                if (fileParts.length) {
                  const fileExt = fileParts[fileParts.length - 1];
                  if (fileExt.indexOf('jpg') > -1 ||
                    fileExt.indexOf('png') > -1 ||
                    fileExt.indexOf('jpeg') > 1) {
                    // use it
                    format = fileExt;
                  }
                }
              } catch (err) {

              }
            }
            // get imagesource from the picked asset
            try {
              requestingImage = true;
              asset.getImage({
                maxWidth: 1000,
                maxHeight: 1000,
              }).then((imageSource: ImageSource) => {
                if (requestingImage) {
                  // help prevent potential of double resolve firing:
                  // https://stackoverflow.com/questions/31037859/phimagemanager-requestimageforasset-returns-nil-sometimes-for-icloud-photos
                  requestingImage = false;
                  if (imageSource) {
                    // for use with image cropper (iOS needs nativeImage)
                    (<any>imageSource).nativeImage = imageSource.ios;
                    // android works off the source itself
                    this._showCropper(imageSource, format);
                  } else {
                    this._showUploadError(10);
                  }
                }
              }, () => {
                this._showUploadError(4);
              });
            } catch (err) {
              this._showUploadError(11);
            }

          } else {
            this._showUploadError(5);
          }

        }
      }, (err) => {
        this.log.debug(err);
        // Don't display error, likely a cancel
      });
    });
  }

  private _showUploadError(code?: number) {
    this.appService.toggleSpinner();
    return new Promise((resolve) => {
      this._win.setTimeout(() => {
        (<any>this._win.alert(this._uploadErrorMessage + (code ? ` (${code})` : ''))).then(() => {
          this._ngZone.run(() => {
            resolve();
          });
        });
      }, 400);
    });
  }
  private _showCropper(
    imageSource: ImageSource,
    format: string,
    timeoutDelay: number = 600,
  ) {
    this.log.debug('_showCropper width/height:', imageSource.width + 'x' + imageSource.height);
    this.log.debug('imageSource native image:', isIOS ? imageSource.ios : imageSource.android);
    const isPortrait = imageSource.height > imageSource.width;
    const longest = this._imageOptions.width;
    const shortest = this._imageOptions.height;
    const maxWidth = isPortrait ? shortest : longest;
    const maxHeight = isPortrait ? longest : shortest;
    // const asset = new ImageAsset(isIOS ? imageSource.ios : imageSource.android);
    // if (asset && (asset.android || asset.nativeImage /*iOS*/ )) {
      this._win.setTimeout(() => {
        try {
          this._cropper.show(imageSource, <any>{
            // <any>asset, {
            // maxWidth: longest,
            // maxHeight: longest, // cropping to square 
            // origWidth: imageSource.width,
            // origHeight: imageSource.height,
            width: maxWidth,// longest,
            height: maxHeight, //longest,
            lockAspect: true,
          }).then((result: Result) => {
            if (result && result.image) {
              this.log.debug('cropper result:');
              this.log.debug(result.image);
              const imgSrc = result.image;
              this._cropSelected = true; // prevents binding flash

              // if (!this.addOnly) {
              //   this.selectedImage = imgSrc;
              // }

              let properFormat: any = 'jpeg';
              switch (format) {
                case 'jpg':
                case 'jpeg':
                  properFormat = ImageFormat.jpeg;
                  break;
                case 'png':
                  properFormat = ImageFormat.png;
                  break;
                default:
                  properFormat = ImageFormat.jpeg;
                  break;
              }

              this._uploadPhoto(imgSrc, properFormat);
            } else {
              // user just canceled the cropper
              // this._showUploadError(7);
            }
          }, err => {
            this.log.debug('crop error:', err);
            try {
              this.log.debug(JSON.stringify(err));
            } catch (err) {
              // json error
            }
            this._showUploadError(8);
          });
        } catch (err) {
          this._showUploadError(12);
        }
      }, timeoutDelay);
    // } else {
    //   this._showUploadError(6);
    // }
  }

  private _urlToImageSource(editing?: boolean) {
    if (isImageUrl(this._activeImage)) {
      fromUrl(this._activeImage).then((imageSource: ImageSource) => {
        this._progressService.toggleSpinner();
        this.selectedImage = imageSource;
        if (editing) {
          this._showCropper(imageSource, 'jpeg');
        }
      }, () => {
        this._progressService.toggleSpinner();
        if (editing) {
          this._win.alert(`Oopsies! We're sorry, an error occurred trying to load and edit this image.`);
        }
      });
    }
  }

  private _imageAssetToImageSource(editing?: boolean) {
    if (isImageAsset(this._activeImage)) {
      fromAsset(this._activeImage).then((imageSource: ImageSource) => {
        this._progressService.toggleSpinner();
        this.selectedImage = imageSource;
        if (editing) {
          this._showCropper(imageSource, 'jpeg');
        }
      }, () => {
        this._progressService.toggleSpinner();
        if (editing) {
          this._win.alert(`Oopsies! We're sorry, an error occurred trying to load and edit this image.`);
        }
      });
    }
  }

  private _uploadPhoto(
    imageAsset: ImageSource,
    properFormat: string,
  ) {
    // JUST A NOTE THAT THIS DOES NOT WORK UNFORTUNATELY: imgSrc.toBase64String(properFormat);
    this.appService.toggleSpinner(true);
    const fileName = `${this._userService.currentUserId || ''}-${Date.now()}-image.jpg`;
    this.log.debug('fileName:', fileName);
    const filepath = path.join(knownFolders.documents().path, fileName);
    this.log.debug('filepath:', filepath);
    // const saved = imageAsset.saveToFile(filepath, "jpg");

    // let base64Image;
    if (isIOS) {
      // NativeScript ImageSource has:
      // imgSrc.toBase64String(properFormat)
      // but it won't encode the string in the right format
      // that the backend wants.
      // use native apis since this provides
      // accurately encoded string.
      const imageData = UIImageJPEGRepresentation(imageAsset.ios, .6);
      imageData.writeToFileAtomically(filepath, true);
      // base64Image = imageData.base64EncodedStringWithOptions(NSDataBase64EncodingOptions.Encoding64CharacterLineLength);
    } else {
      const bm = imageAsset.android;
      let baos = new java.io.ByteArrayOutputStream();
      bm.compress(android.graphics.Bitmap.CompressFormat.JPEG, 60, baos);
      const byteArrayImage = baos.toByteArray();
      const javafile = new java.io.File(filepath);
      const fos = new java.io.FileOutputStream(javafile);
      fos.write(byteArrayImage);
      fos.close();

      // base64Image = android.util.Base64.encodeToString(byteArrayImage, android.util.Base64.DEFAULT);
      // baos = undefined;
    }
    // base64Image = `data:image/jpg;base64,${base64Image}`;


    this.log.debug('image saved to:', filepath);
    const file = File.fromPath(filepath);
    this.log.debug('about to upload file:', file.name);

      this._awsService.upload(file).then((result) => {
        this.log.debug('uploaded:', result);
        this._ngZone.run(() => {
          if (!this.addOnly) {
            this.selectedImage = result;
          }
          this._progressService.toggleSpinner(false);
          this.uploadedImage.next(result);
        });
      }, err => {
        this._showUploadError(9);
      });

    
    // if (this._base64ImgToUpload) {
    //   this._base64ImgToUpload = `data:image/jpg;base64,${this._base64ImgToUpload}`;
    //   // this.log.debug('base64Img:');
    //   // this.log.debug(base64Img);
    //   this._uploadFilename = `attendee-pic-${Date.now()}.${properFormat}`;
    //   // this.log.debug('name:', this._uploadFilename);
    //   this.appService.toggleSpinner(true);

    //   this._ngZone.run(() => {
    //     // upload the image
    //     this.log.debug('TODO - upload image action Bram!');

    //     // this.store.dispatch(new FormActions.UploadImageAction({
    //     //   name: this._uploadFilename,
    //     //   image: this._base64ImgToUpload,
    //     // }));
    //   });
    // } else {

    //   this._showUploadError(9);
    // }
  }

  private _isHttps(url: string) {
    return url ? /^https/i.test(url) : false;
  }

  private _getSampleSize(
    uri,
    options?: { maxWidth: number, maxHeight: number },
  ): number {
    let scale = 1;
    if (isAndroid) {
      const boundsOptions = new android.graphics.BitmapFactory.Options();
      boundsOptions.inJustDecodeBounds = true;
      android.graphics.BitmapFactory.decodeFile(uri, boundsOptions);

      // Find the correct scale value. It should be the power of 2.
      let outWidth = boundsOptions.outWidth;
      let outHeight = boundsOptions.outHeight;

      if (options) {

        const targetSize = options.maxWidth < options.maxHeight ? options.maxWidth : options.maxHeight;
        while (!(this._matchesSize(targetSize, outWidth) ||
          this._matchesSize(targetSize, outHeight))) {
          outWidth /= 2;
          outHeight /= 2;
          scale *= 2;
        }
      }
    }

    return scale;
  }


  private _matchesSize(
    targetSize: number,
    actualSize: number,
  ): boolean {
    return targetSize && actualSize / 2 < targetSize;
  }
}
