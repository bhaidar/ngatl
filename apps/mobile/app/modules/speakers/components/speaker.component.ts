import { Component, AfterViewInit, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { EventData } from 'tns-core-modules/data/observable';
import { isIOS, platformNames, device } from 'tns-core-modules/platform';
import { SearchBar } from 'tns-core-modules/ui/search-bar';
import { Color } from 'tns-core-modules/color';
import { View } from 'tns-core-modules/ui/core/view';

// app
import { LoggerService } from '@ngatl/api';
import { BaseComponent, ProgressService, WindowService } from '@ngatl/core';
import { SpeakerActions } from '../actions';
import { SpeakerState } from '../states';
import { LinearGradient } from '../../../helpers';
import { NSAppService } from '../../core/services/ns-app.service';
import { TouchGestureEventData, PanGestureEventData, TouchAction } from 'ui/gestures';
import { layout } from 'utils/utils';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout/stack-layout';
import { Label } from 'tns-core-modules/ui/label';
import { ListView } from 'tns-core-modules/ui/list-view/list-view';

@Component( {
  moduleId: module.id,
  selector: 'ngatl-ns-speaker',
  templateUrl: 'speaker.component.html'
} )
export class SpeakerComponent extends BaseComponent implements AfterViewInit, OnInit {
  public renderView = false;
  public speakerState$: BehaviorSubject<any> = new BehaviorSubject( [] );
  public search$: Subject<string> = new Subject();
  private _all: Array<any>;
  private _searchSpeakers: ( value: string ) => void;

  @ViewChild( 'speakerList' ) _speakerList: ElementRef;
  private get speakerList() {
    return this._speakerList.nativeElement as ListView;
  }

  quickScroll$ = new Subject<number>();
  constructor(
    private store: Store<any>,
    private log: LoggerService,
    private vcRef: ViewContainerRef,
    private appService: NSAppService,
    private _progressService: ProgressService,
    private _win: WindowService,
    private _translate: TranslateService,
  ) {
    super();
    this.appService.currentVcRef = this.vcRef;
    this._searchSpeakers = this._searchSpeakersFn.bind( this );
  }

  ngOnInit() {
    this.store.select( s => s.conference.speakers )
      .takeUntil( this.destroy$ )
      .subscribe( ( speakers: SpeakerState.IState ) => {
        this._all = [...speakers.list];
        this.speakerState$.next( this._all );
      } );

    this.search$
      .debounceTime( 500 )
      .takeUntil( this.destroy$ )
      .subscribe( this._searchSpeakers );

    this.renderView = true;
  }

  public onPullRefreshInitiated(e) {
    const listview = e.object;
    if (listview) {
      // this._progressService.toggleSpinner(true);
      this.store.dispatch(new SpeakerActions.FetchAction(true));
      this._win.setTimeout(_ => {
        listview.notifyPullToRefreshFinished();
        // this._progressService.toggleSpinner(false);
      }, 1500);
    }
  }

  private _searchSpeakersFn( value: string ) {
    let lowercaseValue = '';
    if ( value ) {
      lowercaseValue = value.toLowerCase();
    }
    const results = this._all.filter( ( s: any ) => {
      return s.name.toLowerCase().indexOf( lowercaseValue ) > -1;
    } );
    this.speakerState$.next( results );
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
        if ( search && search.ios ) {
          search.ios.backgroundImage = UIImage.alloc().init();
        }
        break;
    }
  }

  public openDetail( speaker: SpeakerState.ISpeaker ) {
    if (speaker.social && speaker.social.twitter) {
      const twitterLink = speaker.social.twitter;
      const twitterHandle = twitterLink.indexOf('http') > -1 ? twitterLink.split('/').slice(-1) : twitterLink;
      this.appService.openWebView( {
        vcRef: this.vcRef,
        context: {
          url: twitterLink,
          title: `@${twitterHandle}`
        }
      } );
    } else {
      this._win.alert(this._translate.instant('general.twitter-unknown'));
    }
  }

  public clear( e ) {
    this.speakerState$.next( this._all );
  }

  public doNotShowAndroidKeyboard( args: EventData ) {
    if ( !isIOS ) {
      let searchBar = <SearchBar>args.object;
      if ( searchBar.android ) {
        searchBar.android.clearFocus();
      }
    }
  }
  alphabet = 'abcdejkmnprstw'.split( '' );
  previousCharacterToJumpTo: string;
  slide( $event: TouchGestureEventData ) {
    const yCoordinate = $event.getY();
    const stackWrapper = $event.view as StackLayout;
    const firstLabel = stackWrapper.getChildAt( 1 ) as Label;
    const letterHeight = layout.toDeviceIndependentPixels( firstLabel.getMeasuredHeight() );
    const indexRaw = yCoordinate / letterHeight;
    if ( indexRaw >= 0 && indexRaw <= this.alphabet.length ) {
      const indexToGoTo = Math.floor( indexRaw );
      const char = this.alphabet[indexToGoTo];

      if ( this.previousCharacterToJumpTo != char ) {
        this.jumpToSpeakerThatStartsWith( char )
        this.previousCharacterToJumpTo = char;
      }

    }

  }
  jumpToSpeakerThatStartsWith( char ) {
    if ( !char ) {
      return;
    }

    if ( char == 'a' ) {
      this.speakerList.scrollToIndex( 0 );
      this.quickScroll$.next( 1 );
      return;
    }
    const firstArtistThatStartsWith = this._all.find( speaker => speaker.name.toLowerCase()
      .trim()
      .startsWith( char ) );
    const itemToScrollToIndex = this._all.indexOf( firstArtistThatStartsWith );
    if ( firstArtistThatStartsWith && itemToScrollToIndex ) {
      this.speakerList.scrollToIndex( itemToScrollToIndex );
      this.quickScroll$.next( 0 );
    }

  }

  ngAfterViewInit() { }
}
