import { Component, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// app
import { LogService, ProgressService, WindowService } from '@ngatl/core';
import { SponsorActions } from '../actions';
import { AppService } from '@ngatl/nativescript';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-sponsor',
  templateUrl: 'sponsor.component.html'
})
export class SponsorComponent implements AfterViewInit, OnInit {
  public sponsorState$: Observable<any>;
  public renderView = false;

  constructor(
    private store: Store<any>, 
    private log: LogService,
    private vcRef: ViewContainerRef,
    private appService: AppService,
    private _progressService: ProgressService,
    private _win: WindowService,
  ) {
    this.appService.currentVcRef = this.vcRef;
  }

  public viewSite(sponsor: any) {
    if (sponsor['link-to-site']) {
      this.appService.openWebView({
        vcRef: this.vcRef,
        context: {
          url: sponsor['link-to-site'],
          title: sponsor.name
        }
      });
    }
  }

  public onPullRefreshInitiated(e) {
    const listview = e.object;
    if (listview) {
      // this._progressService.toggleSpinner(true);
      this.store.dispatch(new SponsorActions.FetchAction(true));
      this._win.setTimeout(_ => {
        listview.notifyPullToRefreshFinished();
        // this._progressService.toggleSpinner(false);
      }, 1500);
    }
  }

  ngOnInit() {
    this.sponsorState$ = this.store.select(s => s.conference.sponsors);
    this.renderView = true;
  }

  ngAfterViewInit() {}
}
