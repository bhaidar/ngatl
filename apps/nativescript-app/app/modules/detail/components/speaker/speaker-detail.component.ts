import { Component, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// nativescript
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
// libs
import { Store } from '@ngrx/store';

// app
import { LoggerService } from '@ngatl/api';
import { BaseComponent } from '@ngatl/core';
import { SpeakerState } from '../../../speakers/states';
import { SpeakerActions } from '../../../speakers/actions';
import { NSWebViewComponent } from '@ngatl/nativescript/features/ui/components/ns-webview/ns-webview.component';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-speaker-detail',
  templateUrl: 'speaker-detail.component.html'
})
export class SpeakerDetailComponent extends BaseComponent implements OnInit {
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

    // this._store.select( s => s.conference.speakers )
    //   .takeUntil( this.destroy$ )
    //   .subscribe( ( state: SpeakerState.IState ) => {
    //     this.detail = state.selected;
    //     for ( const key in this.detail ) {
    //       console.log( key, this.detail[key] );
    //     }
    //   } );


    // this._route.params
    //   .takeUntil( this.destroy$ )
    //   .subscribe( params => {
    //     this._id = params['id'];
    //     this._log.info( 'load detail for:', this._id );
    //     this._store.dispatch( new SpeakerActions.SelectAction( this._id ) );
    //   } );
  }

  public openInfo(data, type) {
    let url = data;
    switch (type) {
      case 'twitter':
        url = `https://twitter.com/${url}`;
        break;
    }

    this._modal.showModal(NSWebViewComponent, {
      viewContainerRef: this._vcRef,
      context: {
        url,
        title: data
      }
    });
  }
}
