import { Component, AfterViewInit, OnInit } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CalendarViewMode, CalendarTransitionMode, CalendarEvent, CalendarEventsViewMode } from 'nativescript-pro-ui/calendar';
import { Color } from 'tns-core-modules/color'

// app
import { LoggerService } from '@ngatl/api';
import { LocaleState, IAppState, BaseComponent } from '@ngatl/core';
import { EventActions } from '../actions';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-event',
  templateUrl: 'event.component.html'
})
export class EventComponent extends BaseComponent implements AfterViewInit, OnInit {
  public eventState$: Observable<any>;
  public locale = 'en-US';
  public viewMode = CalendarViewMode.Month;
  public transitionMode = CalendarTransitionMode.Stack;
  public eventSource = [];
  public eventsViewMode = CalendarEventsViewMode.Inline;

  constructor(
    private store: Store<any>,
    private log: LoggerService
  ) {
    super();
  }

  ngOnInit() {
    this.eventSource = this.getCalendarEvents();
    this.eventState$ = this.store.select( s => s.conference.events );
    this.store.select( ( s: IAppState ) => s.ui.locale )
      .takeUntil( this.destroy$ )
      .subscribe( ( locale: LocaleState.Locale ) => {
        let suffix = 'US';
        switch ( locale ) {
          case 'es':
            suffix = '419';
            break;
          case 'it':
          case 'fr':
            suffix = 'CH';
            break;
        }
        this.locale = `${locale}-${suffix}`;
        console.log('setting locale for calendar:', this.locale)
      })
  }

  public changeView(type: 'day' | 'week') {
    if ( type === 'day' ) {
      this.viewMode = CalendarViewMode.Day;
    } else {
      this.viewMode = CalendarViewMode.Week;
    }
  }

  public onDateSelected(e) {
    console.log('onDateSelected:');
    console.log( e );
    if ( e ) {
      for ( const key in e ) {
        console.log( key, e[key] );
      }
    }
  }

  public getCalendarEvents(): Array<CalendarEvent> {
    let now = new Date();
    let startDate: Date,
      endDate: Date,
      event: CalendarEvent;
    let colors: Array<Color> = [new Color( 200, 188, 26, 214 ), new Color( 220, 255, 109, 130 ), new Color( 255, 55, 45, 255 ), new Color( 199, 17, 227, 10 ), new Color( 255, 255, 54, 3 )];
    let events: Array<CalendarEvent> = [];
    for ( let i = 0; i < 4; i++ ) {
      let day;
      let month = 0;
      switch ( i ) {
        case 0:
          day = 30;
          break;
        case 1:
          day = 31;
          break;
        case 2:
          day = 1;
          month = 1;
          break;
        case 3:
          day = 2;
          month = 1;
          break;
      }
      startDate = new Date( 2018, month, day-1, 1 );
      endDate = new Date( 2018, month, day-1, 3 );
      event = new CalendarEvent( "event " + i, startDate, endDate, false, colors[i * 10 % ( colors.length - 1 )] );
      events.push( event );
      if ( i % 3 == 0 ) {
        event = new CalendarEvent( "second " + i, startDate, endDate, true, colors[i * 5 % ( colors.length - 1 )] );
        events.push( event );
      }
    }
    return events;
  }

  ngAfterViewInit() {}
}
