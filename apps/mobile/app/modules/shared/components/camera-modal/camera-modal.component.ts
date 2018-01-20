import {
  Component,
  NgZone,
} from '@angular/core';
// libs
import { Store } from '@ngrx/store';
import {
  LogService,
  ModalActions,
  ProgressService,
} from '@ngatl/core';
// nativescript
import { CameraPlus } from 'nativescript-camera-plus';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { Page } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { screen, isIOS } from 'tns-core-modules/platform';
// app
import { NSAppService } from '../../../core/services/ns-app.service';

@Component({
  moduleId : module.id,
  selector : 'app-camera-modal',
  templateUrl : './camera-modal.component.html',
})
export class CameraModalComponent {

  public close: () => void;
  public containerWidth: number;
  public containerHeight: number;
  public showToggleIcon = false;
  public showFlashIcon = false;
  private _cameraPlus: CameraPlus;


  constructor(
    private _store: Store<any>,
    private _ngZone: NgZone,
    private _log: LogService,
    private _progressService: ProgressService,
    private _page: Page,
    public appService: NSAppService,
    public params: ModalDialogParams,
  ) {
    _page.backgroundSpanUnderStatusBar = true;
    _page.backgroundColor = new Color('#000');
    this.close = this._closeFn.bind(this);
    this.containerHeight = screen.mainScreen.heightDIPs - 150; // minus actionbar area at top
    if (isIOS) {
      // only for iOS (these buttons crash Android)
      this.showToggleIcon = true;
      this.showFlashIcon = true;
    }
  }

  public camLoaded(e: any): void {
    this._cameraPlus = <CameraPlus>e.object;
    this._log.debug('camLoaded:', this._cameraPlus);

    if ( this._cameraPlus.getFlashMode() === 'off' ) {
      this._cameraPlus.toggleFlash();
    }
  }

  public photoCapturedEvent(e: any): void {
    let image: ImageAsset = <ImageAsset>e.data;
    this._log.debug('photoCapturedEvent:', image);
    this._closeFn(image);
  }

  public errorHandler(e: any): void {
    this._log.debug('errorEvent:', e);
    if (e) {
      this._log.debug(e.message);
    }
  }

  private _closeFn(value) {
    this._store.dispatch(new ModalActions.CloseAction({
      params : this.params,
      value,
    }));
  }
}
