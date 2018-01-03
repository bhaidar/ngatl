import { Component, AfterViewInit, OnInit, NgZone } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CalendarViewMode, CalendarTransitionMode, CalendarEvent, CalendarEventsViewMode } from 'nativescript-pro-ui/calendar';
import { Color } from 'tns-core-modules/color';
import { isIOS, platformNames, device } from 'tns-core-modules/platform';
import { EventData } from "tns-core-modules/data/observable";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { View } from "tns-core-modules/ui/core/view";
import { ListView, ItemEventData } from "tns-core-modules/ui/list-view";
import { SegmentedBarItem, SegmentedBar } from 'tns-core-modules/ui/segmented-bar';
import * as utils from "tns-core-modules/utils/utils";
import { CheckBox } from 'nativescript-checkbox';

// app
import { LoggerService } from '@ngatl/api';
import { LocaleState, IAppState, BaseComponent, LogService } from '@ngatl/core';
import { LinearGradient } from '../../../helpers';
import { EventActions } from '../actions';
import { ConferenceViewModel } from './conference.model';

@Component( {
  moduleId: module.id,
  selector: 'ngatl-ns-event',
  templateUrl: 'event.component.html'
} )
export class EventComponent extends BaseComponent implements AfterViewInit, OnInit {
  public conferenceModel: ConferenceViewModel;
  public days: Array<SegmentedBarItem> = [];
  public selectedDay = 0;
  public search$: Subject<string> = new Subject();

  public eventState$: Observable<any>;
  public locale = 'en-US';
  public viewMode = CalendarViewMode.Month;
  public transitionMode = CalendarTransitionMode.Stack;
  public eventSource = [];
  public eventsViewMode = CalendarEventsViewMode.Inline;
  public checkboxValue = false;
  private _checkbox: CheckBox;

  constructor(
    private store: Store<any>,
    private log: LogService,
    private ngZone: NgZone,
  ) {
    super();
    this.conferenceModel = new ConferenceViewModel();
    const day1 = new SegmentedBarItem();
    day1.title = 'Jan 30';
    this.days.push( day1 );
    const day2 = new SegmentedBarItem();
    day2.title = 'Jan 31';
    this.days.push( day2 );
    const day3 = new SegmentedBarItem();
    day3.title = 'Feb 1';
    this.days.push( day3 );
    const day4 = new SegmentedBarItem();
    day4.title = 'Feb 2';
    this.days.push( day4 );

    const today = new Date();
    const month = today.getMonth();
    console.log( 'month:', month );
    if ( month === 0 || month === 1 ) {
      switch ( today.getDate() ) {
        case 30:
          this.selectedDay = 0;
          break;
        case 31:
          this.selectedDay = 1;
          break;
        case 1:
          this.selectedDay = 2;
          break;
        case 2:
          this.selectedDay = 3;
          break;
      }
    } else {
      this.selectedDay = 0;
    }
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
        console.log( 'setting locale for calendar:', this.locale )
      } );

    this.search$
      .debounceTime( 500 )
      .takeUntil( this.destroy$ )
      .subscribe( ( value: string ) => {
        let lowercaseValue = '';
        if ( value ) {
          lowercaseValue = value.toLowerCase();
        }
        this.conferenceModel.search = lowercaseValue;
      } );
  }

  public onDayChange( args ) {
    let segmetedBar = <SegmentedBar>args.object;

    this.log.debug( "Item:", segmetedBar.selectedIndex );
    switch ( segmetedBar.selectedIndex ) {
      case 0:
        this.conferenceModel.selectedDay = 30;
        break;
      case 1:
        this.conferenceModel.selectedDay = 31;
        break;
      case 2:
        this.conferenceModel.selectedDay = 1;
        break;
      case 3:
        this.conferenceModel.selectedDay = 2;
        break;
    }
  }

  public checkedChange( event ) {
    if ( this._checkbox ) {

      this.ngZone.run( () => {
        this.conferenceModel.favoritesOnly = this._checkbox.checked;
        console.log('this.checkboxValue:', this.checkboxValue);
      } );
    }
  }

  public toggleFavoritesOnly() {
    this.conferenceModel.favoritesOnly = !this.conferenceModel.favoritesOnly;
    this.checkboxValue = this.conferenceModel.favoritesOnly;
  }

  public clear( e ) {
    this.conferenceModel.search = '';
  }

  public changeView( type: 'day' | 'week' ) {
    if ( type === 'day' ) {
      this.viewMode = CalendarViewMode.Day;
    } else {
      this.viewMode = CalendarViewMode.Week;
    }
  }

  public checkboxLoaded( e ) {
    // this.log.debug('-- checkboxLoaded!', e.object);
    this._checkbox = e.object;
  }

  public onDateSelected( e ) {
    console.log( 'onDateSelected:' );
    console.log( e );
    if ( e ) {
      for ( const key in e ) {
        console.log( key, e[key] );
      }
    }
  }

  public changeCellBackground( args: ItemEventData ) {
    if ( args.ios ) {
      var cell = <UITableViewCell>args.ios;
      cell.backgroundColor = utils.ios.getter( UIColor, UIColor.clearColor );
    }
  }

  public doNotShowAndroidKeyboard( args: EventData ) {
    if ( !isIOS ) {
      let searchBar = <SearchBar>args.object;
      if ( searchBar.android ) {
        searchBar.android.clearFocus();
      }
    }
  }

  public onBackgroundLoaded( args: EventData ) {
    let background = <View>args.object;
    let colors = new Array<Color>( new Color( "#333e77" ), new Color( "#1b286c" ) );
    let orientation = LinearGradient.Orientation.Top_Bottom;

    switch ( device.os ) {
      case platformNames.android:
        LinearGradient.drawBackground( background, colors, orientation );
        break;
      case platformNames.ios:
        // The iOS view has to be sized in order to apply a background
        setTimeout( () => {
          LinearGradient.drawBackground( background, colors, orientation );
        } );
        let search = background.getViewById( "search" );
        search.ios.backgroundImage = UIImage.alloc().init();
        break;
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
      startDate = new Date( 2018, month, day - 1, 1 );
      endDate = new Date( 2018, month, day - 1, 3 );
      event = new CalendarEvent( "event " + i, startDate, endDate, false, colors[i * 10 % ( colors.length - 1 )] );
      events.push( event );
      if ( i % 3 == 0 ) {
        event = new CalendarEvent( "second " + i, startDate, endDate, true, colors[i * 5 % ( colors.length - 1 )] );
        events.push( event );
      }
    }
    return events;
  }

  ngAfterViewInit() { }
}
