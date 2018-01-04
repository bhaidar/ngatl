import { Component, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// app
import { LogService } from '@ngatl/core';
import { SponsorActions } from '../actions';
import { NSAppService } from '../../core/services/ns-app.service';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-sponsor',
  templateUrl: 'sponsor.component.html'
})
export class SponsorComponent implements AfterViewInit, OnInit {
  public sponsorState$: Observable<any>;

  constructor(
    private store: Store<any>, 
    private log: LogService,
    private vcRef: ViewContainerRef,
    private appService: NSAppService,
  ) {}

  public viewSite(sponsor: any) {
    this.appService.openWebView({
      vcRef: this.vcRef,
      context: {
        url: sponsor.url,
        title: sponsor.name
      }
    })
  }

  ngOnInit() {
    this.sponsorState$ = this.store.select(s => s.conference.sponsors);
  }

  ngAfterViewInit() {}
}
