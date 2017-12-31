import { Component, AfterViewInit, OnInit } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// app
import { LoggerService } from '@ngatl/api';
import { SpeakerActions } from '../actions';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-speaker',
  templateUrl: 'speaker.component.html'
})
export class SpeakerComponent implements AfterViewInit, OnInit {
  public speakerState$: Observable<any>;

  constructor(private store: Store<any>, private log: LoggerService) {}

  ngOnInit() {
    this.speakerState$ = this.store.select(s => s.conference.speakers);
  }

  ngAfterViewInit() {}
}
