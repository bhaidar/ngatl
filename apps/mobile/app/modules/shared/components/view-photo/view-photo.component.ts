import { Component, NgZone } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ProgressIndicatorActions, UserState, WindowService, UserActions, ProgressService } from '@ngatl/core';
import { isIOS } from 'tns-core-modules/platform';
import { WebView } from 'tns-core-modules/ui/web-view';
import { Page } from 'tns-core-modules/ui/page';
import * as tnsHttp from 'tns-core-modules/http';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { shareImage } from 'nativescript-social-share';

// app
import { NSAppService } from '../../../core/services/ns-app.service';
import { BaseModalComponent } from '../../abstract/base-modal-component';

@Component({
  selector: 'ns-view-photo',
  moduleId: module.id,
  templateUrl: './view-photo.component.html'
})
export class ViewPhotoComponent extends BaseModalComponent {
  public url;
  public title;
  public item: UserState.IConferenceAttendeeNote;

  constructor(
    public store: Store<any>, 
    public page: Page, 
    public params: ModalDialogParams,
    private _translate: TranslateService,
    private _appService: NSAppService,
    private _win: WindowService,
    private _progressService: ProgressService,
    private _ngZone: NgZone,
  ) {
    super(store, page, params);
    this.title = this._translate.instant('general.photo');
    if (this.params && this.params.context) {
      this.url = this.params.context.url;
      this.item = this.params.context.item;
    }
  }

  public share() {
    this._progressService.toggleSpinner(true);
    tnsHttp.getImage(this.url).then((imageSource) => {
      this._ngZone.run(() => {
        this._progressService.toggleSpinner();
      });
      shareImage(imageSource, `From ngAtl 2018`);
    }, (err) => {
      this._ngZone.run(() => {
        this._progressService.toggleSpinner();
      });
      this._win.alert(this._translate.instant('general.error'));
    });
  }

  public confirmDelete() {
    this._win.confirm(this._translate.instant('dialogs.confirm-photo-delete'), () => {
      const index = this.item.photos.findIndex(url => url === this.url);
      if (index > -1) {
        this.item.photos.splice(index, 1);
        this._ngZone.run(() => {
          this._progressService.toggleSpinner(true);
          this.store.dispatch(new UserActions.UpdateNoteAction(this.item));
          this._win.setTimeout(_ => {
            this.close();
          }, 600);
        })
      }
    });
  }

  public close() {
    this.params.closeCallback();
  }
}
