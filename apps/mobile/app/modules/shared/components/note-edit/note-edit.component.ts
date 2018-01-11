import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { ProgressIndicatorActions, UserActions, ProgressService, WindowService } from '@ngatl/core';
import { isIOS } from 'tns-core-modules/platform';
import { WebView } from 'tns-core-modules/ui/web-view';
import { Page } from 'tns-core-modules/ui/page';

// nativescript
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

// app
import { BaseModalComponent } from '../../abstract/base-modal-component';

@Component({
  selector: 'ns-note-edit',
  moduleId: module.id,
  templateUrl: './note-edit.component.html'
})
export class NoteEditComponent extends BaseModalComponent {
  public item;

  constructor(public store: Store<any>, public page: Page, public params: ModalDialogParams, public progress: ProgressService, public win: WindowService) {
    super(store, page, params);
    if (this.params && this.params.context) {
      this.item = Object.assign({}, this.params.context.item);
    }
  }

  public save() {
    this.progress.toggleSpinner(true);
    this.store.dispatch(new UserActions.UpdateNoteAction(this.item));
    this.win.setTimeout(_ => {
      this.progress.toggleSpinner(false);
      this.close();
    }, 1000);
  }

  public close() {
    this.params.closeCallback();
  }
}
