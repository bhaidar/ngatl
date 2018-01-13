import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ProgressIndicatorActions, UserActions, UserState, ProgressService, WindowService } from '@ngatl/core';
import { isIOS } from 'tns-core-modules/platform';
import { WebView } from 'tns-core-modules/ui/web-view';
import { Page } from 'tns-core-modules/ui/page';

// nativescript
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

// app
import { RecordService } from '../../../core/services/record.service';
import { BaseModalComponent } from '../../abstract/base-modal-component';

@Component({
  selector: 'ns-note-edit',
  moduleId: module.id,
  templateUrl: './note-edit.component.html'
})
export class NoteEditComponent extends BaseModalComponent {
  public item: UserState.IConferenceAttendeeNote;
  public customClose: () => void;
  private _origItem: UserState.IConferenceAttendeeNote;
  private _dirty = false;

  constructor(
    public store: Store<any>, 
    public page: Page, 
    public params: ModalDialogParams, 
    public progress: ProgressService, 
    public win: WindowService,
    public recordService: RecordService,
    private _translate: TranslateService,
  ) {
    super(store, page, params);
    this.customClose = this._customCloseFn.bind(this);
    if (this.params && this.params.context) {
      this.item = <UserState.IConferenceAttendeeNote>Object.assign({}, this.params.context.item);
      this._origItem = <UserState.IConferenceAttendeeNote>Object.assign({}, this.item);
    }
  }

  public togglePlay() {
    if (!this.recordService.isRecording) {
      if (this.recordService.isPlaying) {
        this.recordService.stopPlaying();
      } else if (this.recordService.filepath) {
        this.recordService.playRecordedFile();
      } else {
        this.win.alert(this._translate.instant('audio.no-file'));
      }
    }
  }

  public toggleRecord() {
    if (this.recordService.isPlaying) {
      this.recordService.stopPlaying();
    }
    if (this.recordService.isRecording) {
      this.recordService.stopRecord();
    } else {
      this.recordService.startRecord();
    }
  }

  public save() {
    this.progress.toggleSpinner(true);
    this.store.dispatch(new UserActions.UpdateNoteAction(this.item));
    this.win.setTimeout(_ => {
      this._dirty = false;
      this.progress.toggleSpinner(false);
      this._customCloseFn();
    }, 1000);
  }

  public _customCloseFn() {
    if (this.item.note !== this._origItem.note || this.item.audioUrl !== this._origItem.audioUrl) {
      this._dirty = true;
    }
    if (this._dirty) {
      this.win.confirm(this._translate.instant('user.unsaved'), () => {
        super.close();
      });
    } else {
      super.close();
    }
  }
}
