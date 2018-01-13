import { Component, NgZone } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ProgressIndicatorActions, UserActions, UserState, ProgressService, WindowService } from '@ngatl/core';
import { isIOS } from 'tns-core-modules/platform';
import { WebView } from 'tns-core-modules/ui/web-view';
import { Page } from 'tns-core-modules/ui/page';

// nativescript
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { CheckBox } from 'nativescript-checkbox';

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
  public ios: boolean;
  public customClose: () => void;
  private _origItem: UserState.IConferenceAttendeeNote;
  private _dirty = false;
  private _checkbox: CheckBox;

  constructor(
    public store: Store<any>, 
    public page: Page, 
    public params: ModalDialogParams, 
    public progress: ProgressService, 
    public win: WindowService,
    public recordService: RecordService,
    private _ngZone: NgZone,
    private _translate: TranslateService,
  ) {
    super(store, page, params);
    this.ios = isIOS;
    this.customClose = this._customCloseFn.bind(this);
    if (this.params && this.params.context) {
      this.item = <UserState.IConferenceAttendeeNote>Object.assign({}, this.params.context.item);
      this._origItem = <UserState.IConferenceAttendeeNote>Object.assign({}, this.item);
    }
  }

  ngOnInit() {
    this.recordService.transcription$
      .takeUntil(this.destroy$)
      .subscribe((text) => {
        this.item.note = text;
      });
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
    this.recordService.saveRecording().then((url: string) => {
      this.item.audioUrl = url;
      this._updateItemAndExit();
    }, (err) => {
      this.progress.toggleSpinner(false);
      this.win.alert(this._translate.instant('general.error'));
    })
  }

  public toggleAutoTranscribe() {
    this.recordService.autoTranscribe = !this.recordService.autoTranscribe;
  }

  public checkboxLoaded( e ) {
    this._checkbox = e.object;
  }

  public checkedChange( event ) {
    if ( this._checkbox ) {

      this._ngZone.run( () => {
        this.recordService.autoTranscribe = this._checkbox.checked;
      } );
    }
  }

  private _updateItemAndExit() {
    this.store.dispatch(new UserActions.UpdateNoteAction(this.item));
    this.win.setTimeout(_ => {
      this._dirty = false;
      // just make orig match edited item to make the clean save
      this._origItem = this.item;
      this.progress.toggleSpinner(false);
      this._customCloseFn();
    }, 1500); // reasonable amount of time to update (quick/dirty setup)
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
