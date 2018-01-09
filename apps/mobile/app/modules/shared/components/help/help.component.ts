import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Page } from 'tns-core-modules/ui/page';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { BaseModalComponent } from '../../abstract/base-modal-component';

@Component( {
  moduleId: module.id,
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent extends BaseModalComponent {
  public title: string;

  constructor(
    public store: Store<any>,
    public page: Page,
    public params: ModalDialogParams,
    public translate: TranslateService,
  ) {
    super(store, page, params);
    this.title = this.translate.instant('general.help');
  }
}
