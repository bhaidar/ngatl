// libs
import { Store } from '@ngrx/store';
// nativescript
import { Page } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
// app
import {
  BaseComponent,
  ModalActions,
  IAppState,
} from '@ngatl/core';

export abstract class BaseModalComponent extends BaseComponent {

  constructor(
    public store: Store<IAppState>,
    public page: Page,
    public params: ModalDialogParams,
  ) {
    super();
    page.backgroundSpanUnderStatusBar = true;
    page.backgroundColor = new Color('#000');
  }

  public close() {
    this.store.dispatch(new ModalActions.CloseAction({
      params : this.params,
    }));
  }
}
