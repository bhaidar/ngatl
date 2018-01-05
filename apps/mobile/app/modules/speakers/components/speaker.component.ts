import { Component, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// app
import { LoggerService } from '@ngatl/api';
import { SpeakerActions } from '../actions';
import { NSAppService } from '../../core/services/ns-app.service';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-speaker',
  templateUrl: 'speaker.component.html'
})
export class SpeakerComponent implements AfterViewInit, OnInit {
  public speakerState$: Observable<any>;

  constructor(
    private store: Store<any>,
    private log: LoggerService, 
    private vcRef: ViewContainerRef,
    private appService: NSAppService,
  ) {
    this.appService.currentVcRef = this.vcRef;
  }

  ngOnInit() {
    this.speakerState$ = this.store.select(s => s.conference.speakers);
  }

  public openDetail(speaker: any) {
    this.appService.openWebView({
      vcRef: this.vcRef,
      context: {
        url: `https://twitter.com/${speaker.social.twitter}`,
        title: `@${speaker.social.twitter}`
      }
    })
  }

  ngAfterViewInit() {}
}
