import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

// app
import { LoggerService } from '@ngatl/api';
import { SponsorState } from '../../../sponsors/states';
import { SponsorActions } from '../../../sponsors/actions';

@Component({
  moduleId: module.id,
  selector: 'sponsor-detail',
  templateUrl: 'sponsor-detail.component.html'
})
export class SponsorDetailComponent implements AfterViewInit, OnInit {
  public detail: any;
  private _id: any;
  private _subs: Array<Subscription>;

  constructor(private _store: Store<any>, private _log: LoggerService, private _route: ActivatedRoute) {
    this._subs = [];
  }

  ngOnInit() {
    this._subs.push(
      this._store.select(s => s.conference.sponsors).subscribe((state: SponsorState.IState) => {
        this._log.info(state, state.selected);
        this.detail = state.selected;
        for (let key in this.detail) {
          console.log(key, this.detail[key]);
        }
      })
    );
    this._subs.push(
      this._route.params.subscribe(params => {
        this._id = params['id'];
        this._log.info('load detail for:', this._id);
        this._store.dispatch(new SponsorActions.SelectAction(this._id));
      })
    );
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    for (let sub of this._subs) {
      sub.unsubscribe();
    }
  }
}
