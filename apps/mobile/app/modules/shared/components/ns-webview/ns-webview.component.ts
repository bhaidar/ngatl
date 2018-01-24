import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { ProgressIndicatorActions } from '@ngatl/core';
import { isIOS } from 'tns-core-modules/platform';
import { WebView } from 'tns-core-modules/ui/web-view';
import { Page } from 'tns-core-modules/ui/page';

// nativescript
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

// app
import { BaseModalComponent } from '../../abstract/base-modal-component';

@Component({
  selector: 'ns-webview',
  moduleId: module.id,
  templateUrl: './ns-webview.component.html'
})
export class NSWebViewComponent extends BaseModalComponent {
  public url;
  public title;

  constructor(public store: Store<any>, public page: Page, public params: ModalDialogParams) {
    super(store, page, params);
    if (this.params && this.params.context) {
      this.url = this.params.context.url;
      if (this.params.context.title) {
        this.title = this.params.context.title;
      }
    }
  }

  public loadFinished(e) {
    this.store.dispatch(new ProgressIndicatorActions.HideAction());

    if (!this.title && e && e.url) {
      this.title = e.url;
    }
  }

  public webViewLoaded(view: WebView) {
    if (this.url) {
      view.src = this.url;
  
      if ( !isIOS && view.nativeView ) {
        (<android.webkit.WebView>view.nativeView).getSettings().setDomStorageEnabled(true);
      }
    }
  }
}
