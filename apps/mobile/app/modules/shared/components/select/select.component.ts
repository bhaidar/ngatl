import { Component, Input } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { RouterExtensions } from 'nativescript-angular/router';
import { Color } from 'tns-core-modules/color';
import { isIOS } from 'tns-core-modules/platform';
import { Page } from 'tns-core-modules/ui/page';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';
import {
  BaseComponent,
  IAppState,
  ModalActions,
  WindowService,
  LogService,
} from '@ngatl/core';

// app
import { BaseModalComponent } from '../../abstract/base-modal-component';

export interface ISelectItem {
  name: string,
  selected?: boolean;
  value?: any;
}

@Component( {
  moduleId: module.id,
  selector: 'ns-select-modal',
  templateUrl: './select.component.html'
} )
export class SelectModalComponent extends BaseModalComponent {

  @Input() public title: string;
  @Input() public items: Array<ISelectItem>;
  public items$: BehaviorSubject<Array<ISelectItem>> = new BehaviorSubject([]);
  private _contextName: string;
  private _fullList: Array<ISelectItem> = [];

  constructor(
    private _translateService: TranslateService,
    private _router: RouterExtensions,
    private _log: LogService,
    private _win: WindowService,
    public store: Store<IAppState>,
    public page: Page,
    public params: ModalDialogParams, // bound to modal-title-bar
  ) {
    super( store, page, params );
  }

  ngOnInit() {
    const context = this.params.context;
    this.title = context.title;
    this._contextName = context.name;
    this._fullList = context.items;
    this.items$.next([...this._fullList]);
  }

  public select( value: ISelectItem ) {
    this.store.dispatch(new ModalActions.CloseAction({
      params : this.params,
      value: {
        name: this._contextName,
        selection: value,
      }
    }));
  }

  public clear( e ) {
    this.items$.next( this._fullList );
  }

  public disableRowColor(e) {
    if ( isIOS && e ) {
      let cell = e.ios;
      if ( cell ) {
        cell.selectionStyle = UITableViewCellSelectionStyle.None;
        if ( cell.backgroundView ) {
          cell.backgroundView.backgroundColor = new Color(0, 255, 0, 0).ios;
        }
      }
    }
  }
}
