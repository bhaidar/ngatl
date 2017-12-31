import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// libs
import { Store } from '@ngrx/store';

// app
import { LoggerService } from '@ngatl/api';
import { BaseComponent } from '@ngatl/core';
import { SearchState } from '../../../search/states';
import { SearchActions } from '../../../search/actions';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-search-detail',
  templateUrl: 'search-detail.component.html'
})
export class SearchDetailComponent extends BaseComponent implements OnInit {
  public detail: any;
  private _id: any;

  constructor(private _store: Store<any>, private _log: LoggerService, private _route: ActivatedRoute) {
    super();
  }

  public showOptions() {
    this._log.info('show options!');
  }

  ngOnInit() {
    this._store.select( s => s.conference.search )
      .takeUntil( this.destroy$ )
      .subscribe( ( state: SearchState.IState ) => {
        this.detail = state.selected;
      } );


    this._route.params
      .takeUntil( this.destroy$ )
      .subscribe( params => {
        this._id = params['id'];
        this._log.info( 'load detail for:', this._id );
        this._store.dispatch( new SearchActions.SelectAction( this._id ) );
      } );
  }
}
