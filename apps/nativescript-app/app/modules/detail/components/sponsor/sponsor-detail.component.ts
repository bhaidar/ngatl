import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// libs
import { Store } from '@ngrx/store';

// app
import { LoggerService } from '@ngatl/api';
import { BaseComponent } from '@ngatl/core';
import { SponsorState } from '../../../sponsors/states';
import { SponsorActions } from '../../../sponsors/actions';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-sponsor-detail',
  templateUrl: 'sponsor-detail.component.html'
})
export class SponsorDetailComponent extends BaseComponent implements OnInit {
  public detail: any;
  private _id: any;

  constructor(private _store: Store<any>, private _log: LoggerService, private _route: ActivatedRoute) {
    super();
  }

  ngOnInit() {

    // this._store.select( s => s.conference.sponsors )
    //   .takeUntil( this.destroy$ )
    //   .subscribe( ( state: SponsorState.IState ) => {
    //     this._log.info( state, state.selected );
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
    //     this._store.dispatch( new SponsorActions.SelectAction( this._id ) );
    //   } );
  }
}
