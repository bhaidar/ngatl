import { Component, AfterViewInit, OnInit, NgZone, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// import { CalendarViewMode, CalendarTransitionMode, CalendarEvent, CalendarEventsViewMode } from 'nativescript-pro-ui/calendar';
import { Color } from 'tns-core-modules/color';
import { View } from 'tns-core-modules/ui/core/view';
import { isIOS, platformNames, device } from 'tns-core-modules/platform';
import { EventData } from 'tns-core-modules/data/observable';
import { SearchBar } from 'tns-core-modules/ui/search-bar';
import { Page } from 'tns-core-modules/ui/page';
import { ListView, ItemEventData } from 'tns-core-modules/ui/list-view';
import { SegmentedBarItem, SegmentedBar } from 'tns-core-modules/ui/segmented-bar';
import * as utils from "tns-core-modules/utils/utils";
import { CheckBox } from 'nativescript-checkbox';

// app
import { LoggerService } from '@ngatl/api';
import { LocaleState, IAppState, BaseComponent, LogService, WindowService, ProgressService } from '@ngatl/core';
import { LinearGradient } from '../../../helpers';
import { NSAppService } from '../../core/services/ns-app.service';
import { EventActions } from '../actions';
import { EventState } from '../states';
import { ConferenceViewModel, Session } from './conference.model';

@Component( {
  moduleId: module.id,
  selector: 'ngatl-ns-event',
  templateUrl: 'event.component.html'
} )
export class EventComponent extends BaseComponent implements AfterViewInit, OnInit {
  public conferenceModel: ConferenceViewModel;
  public days: Array<SegmentedBarItem> = [];
  public renderView = false;
  public selectedDay = 0;
  public search$: Subject<string> = new Subject();

  public locale = 'en-US';
  // public viewMode = CalendarViewMode.Month;
  // public transitionMode = CalendarTransitionMode.Stack;
  // public eventsViewMode = CalendarEventsViewMode.Inline;
  public checkboxValue = false;
  private _checkbox: CheckBox;
  private _listview: ListView;

  constructor(
    private store: Store<any>,
    private log: LogService,
    private ngZone: NgZone,
    private vcRef: ViewContainerRef,
    private appService: NSAppService,
    private win: WindowService,
    private progressService: ProgressService,
    private page: Page,
  ) {
    super();
    this.appService.currentVcRef = this.vcRef;
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
    this.store.select( s => s.conference.events )
      .takeUntil(this.destroy$) 
      .subscribe((s: EventState.IState) => {
        this.conferenceModel.schedule = s.list;
      });

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

    this.renderView = true;
  }

  public onPullRefreshInitiated(e) {
    const listview = e.object;
    if (listview) {
      this.progressService.toggleSpinner(true);
      this.store.dispatch(new EventActions.FetchAction(true));
      this.win.setTimeout(_ => {
        listview.notifyPullToRefreshFinished();
        this.progressService.toggleSpinner(false);
      }, 1500);
    }
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

  public getListView() {
    if (!this._listview) {
      this._listview = this.page.getViewById('sessions-list');
    }
    return this._listview || { refresh: () => void {}};
  }

  public toggleFavoritesOnly() {
    this.conferenceModel.favoritesOnly = !this.conferenceModel.favoritesOnly;
    this.checkboxValue = this.conferenceModel.favoritesOnly;
  }

  public clear( e ) {
    this.conferenceModel.search = '';
  }

  public changeView( type: 'day' | 'week' ) {
    // if ( type === 'day' ) {
    //   this.viewMode = CalendarViewMode.Day;
    // } else {
    //   this.viewMode = CalendarViewMode.Week;
    // }
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

  public toggleItemFav(item: Session) {
    item.toggleFavourite();
    this.win.setTimeout(_ => {
      this.getListView().refresh();
    }, 500);
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
    let colors = new Array<Color>( new Color( "#1d2b41" ), new Color( "#151F2F" ) );
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
        let search = background.getViewById( 'search' );
        if (search && search.ios) {
          search.ios.backgroundImage = UIImage.alloc().init();
        }
        break;
    }
  }

  ngAfterViewInit() { }
}
