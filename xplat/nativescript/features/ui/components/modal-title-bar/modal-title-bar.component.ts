import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ModalActions } from '@ngatl/core';

// nativescript
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

// app
import { moreIcon } from '@ngatl/nativescript/utils';

@Component({
  selector: 'ngatl-ns-modal-title-bar',
  moduleId: module.id,
  templateUrl: './modal-title-bar.component.html'
})
export class ModalTitleBarComponent implements OnInit {
  @Input() params: ModalDialogParams;
  @Input() title: string;
  @Input() closeText: string;
  @Input() showMoreButton: boolean;
  @Input() moreIcon: string;
  @Output() moreAction: EventEmitter<any> = new EventEmitter();
  @Input() customClose: () => void;

  constructor(
    private _store: Store<any>,
    private _translate: TranslateService,
  ) {}

  ngOnInit() {
    if (!this.closeText) {
      this.closeText = this._translate.instant('dialogs.close'); // default
    }

    if (!this.moreIcon) {
      this.moreIcon = moreIcon();
    }
  }

  public more(e) {
    this.moreAction.next();
  }

  public close() {
    if ( this.customClose ) {
      this.customClose();
    } else {
      this._store.dispatch(new ModalActions.CloseAction({
        params : this.params,
      }));
    }
  }
}
