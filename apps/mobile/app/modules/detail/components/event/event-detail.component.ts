import { Component, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// nativescript
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
// libs
import { Store } from '@ngrx/store';

// app
import { LoggerService } from '@ngatl/api';
import { BaseComponent } from '@ngatl/core';
import { EventState } from '../../../events/states';
import { EventActions } from '../../../events/actions';
import { NSWebViewComponent } from '../../../shared/components/ns-webview/ns-webview.component';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-event-detail',
  templateUrl: 'event-detail.component.html'
})
export class EventDetailComponent extends BaseComponent implements OnInit {
  public detail: any;
  private _id: any;

  constructor(
    private _store: Store<any>,
    private _log: LoggerService,
    private _route: ActivatedRoute,
    private _vcRef: ViewContainerRef,
    private _modal: ModalDialogService
  ) {
    super();
  }

  ngOnInit() {
    this._store.select( s => s.conference.events )
      .takeUntil( this.destroy$ )
      .subscribe( ( state: EventState.IState ) => {
        for ( let key in this.detail ) {
          this.detail = state.selected;
          console.log( key, this.detail[key] );
        }
      } );

    this._route.params
      .takeUntil( this.destroy$ )
      .subscribe( params => {
        this._id = params['id'];
        this._log.info( 'load detail for:', this._id );
        this._store.dispatch( new EventActions.SelectAction( this._id ) );
      } );
  }
}
