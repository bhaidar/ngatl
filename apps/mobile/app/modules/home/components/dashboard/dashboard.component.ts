import {
  Component,
  AfterViewInit,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SystemUser } from '@ngatl/api';
import { BaseComponent, UserActions, ModalActions, WindowService, ProgressService } from '@ngatl/core';

// nativescript
import { BarcodeScanner } from "nativescript-barcodescanner";
import { Page } from 'tns-core-modules/ui/page';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { View } from 'tns-core-modules/ui/core/view';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation';
import { screen, isIOS } from 'tns-core-modules/platform';

// app
import { BarcodeComponent } from '../../../shared/components/barcode/barcode.component';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy {
  public user: any;
  private _barcode: BarcodeScanner;
  private _spinnerOn = false;

  constructor(
    private _store: Store<any>,
    private _vcRef: ViewContainerRef,
    private _win: WindowService,
    private _progressService: ProgressService,
    private _page: Page,
  ) {
    super();
    this._page.backgroundImage = 'res://home-bg';
  }

  public setupPage(e) {
    console.log('setupPage:');
    console.log(e.object);
    console.log('screen:');
    console.log(screen.mainScreen.widthDIPs + 'x' + screen.mainScreen.heightDIPs);
    const top = <View>this._page.getViewById('badge-top');
    const bottom = <View>this._page.getViewById('badge-bottom');
    // console.log('image:', top);
    // console.log('image width:', top.effectiveWidth);

    bottom.animate({
      translate: {
        x: (screen.mainScreen.widthDIPs/2) - 275,
        y: -600
      },
      scale: {
        x: .6,
        y: .6,
      },
      rotate:3,
      duration: 1,
      iterations: 1,
    }).then(_ => {
      bottom.animate({
        translate: {
          x: (screen.mainScreen.widthDIPs/2) - 275,
          y: -80
        },
        scale: {
          x: .6,
          y: .6,
        },
        rotate: -8,
        duration: 800,
        iterations: 1,
        curve: AnimationCurve.easeIn// AnimationCurve.spring
      });
    });

    top.animate({
      translate: {
        x: (screen.mainScreen.widthDIPs/2) - 42,
        y: -600
      },
      scale: {
        x: .4,
        y: .4,
      },
      rotate: 0,
      duration: 1,
      iterations: 1,
    }).then(_ => {
      top.animate({
        translate: {
          x: (screen.mainScreen.widthDIPs/2) - 42,
          y: -180
        },
        scale: {
          x: .4,
          y: .4,
        },
        rotate: 18,
        duration: 800,
        iterations: 1,
        curve: AnimationCurve.easeIn,
      });
    });

    this._playBeacon();
  }

  private _playBeacon(delay: number = 1000) {
    if (this._page) {
      const beacon = <View>this._page.getViewById('beacon');
      if (beacon) {
        beacon.animate({
          translate: {
            x: (screen.mainScreen.widthDIPs/2) - 46,
            y: 260
          },
          scale: {
            x: .5,
            y: .5,
          },
          opacity:0,
          duration: 1,
          iterations: 1
        }).then(_ => {
          beacon.animate({
            translate: {
              x: (screen.mainScreen.widthDIPs/2) - 46,
              y: 260
            },
            scale: {
              x: 1.5,
              y: 1.5,
            },
            delay,
            opacity:.8,
            duration: 500,
            iterations: 1,
            curve: AnimationCurve.easeIn
          }).then(_ => {
            beacon.animate({
              translate: {
                x: (screen.mainScreen.widthDIPs/2) - 46,
                y: 260
              },
              scale: {
                x: 3,
                y: 3,
              },
              opacity:0,
              duration: 500,
              iterations: 1,
              curve: AnimationCurve.easeOut
            }).then(_ => {
              this._playBeacon(800);
            }, _ => {

            });
          }, _ => {

          });
        }, _ => {

        });
      }
    }
  }

  public openBarcode() {
    this._barcode = new BarcodeScanner();
    this._openScanner();
  }

  public toggleSpinner() {
    this._spinnerOn = !this._spinnerOn;
    this._progressService.toggleSpinner( this._spinnerOn );
    this._win.setTimeout( _ => {
      this._spinnerOn = false;
      this._progressService.toggleSpinner( false );
    }, 800 );
  }

  public login() {
    this._store.dispatch(new UserActions.LoginAction(this.user));
  }

  public create() {
    // this._store.dispatch(new UserActions.CreateAction(this.user));
    const user = new SystemUser( this.user );
    for ( const key in user ) {
      console.log( key, user[key] );
    }
    this._store.dispatch(new UserActions.CreateFinishAction(user));
  }

  ngOnInit() {
    this.user = {
      firstName: 'Any',
      lastName: 'User',
      username: 'user@ngatl.org',
      email: 'user@ngatl.org',
      password: '12341234'
    };
  }

  ngAfterViewInit() {}

  ngOnDestroy() { }

  private _openScanner(requestPerm: boolean = true) {
    this._barcode.hasCameraPermission().then( ( granted: boolean ) => {
      console.log( 'granted:', granted );
      if ( granted ) {
        this._barcode.available().then( ( avail: boolean ) => {
          if ( avail ) {
            this._barcode.scan( {
              formats: "QR_CODE,PDF_417,EAN_13",   // Pass in of you want to restrict scanning to certain types
              // cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
              cancelLabel: 'Cancel',
              cancelLabelBackgroundColor: "#000", // iOS only, default '#000000' (black)
              message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
              showFlipCameraButton: true,   // default false
              preferFrontCamera: false,     // default false
              showTorchButton: true,        // default false
              beepOnScan: true,             // Play or Suppress beep on scan (default true)
              torchOn: false,               // launch with the flashlight on (default false)
              closeCallback: () => {
                console.log( "Scanner closed" );
                this._barcode = null;
              }, // invoked when the scanner was closed (success or abort)
              resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
              orientation: "portrait",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
              openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
            } ).then( ( result ) => {
              console.log( 'result:', result );
              if ( result ) {
                console.log( "Scan format: " + result.format );
                console.log( "Scan text:   " + result.text );
                for ( const key in result) {
                  console.log( key, result[key] );
                }
              }
            }, ( err ) => {
              console.log( 'error:', err );
            } );
          }
        } );
      } else if (requestPerm) {
        this._barcode.requestCameraPermission().then( () => {
          this._openScanner(false); // prevent loop on
        } );
      } else {
        //this._win.alert( 'Please enable camera permissions in your device settings.' );
      }
    } );
  }
}
