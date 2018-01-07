import { Component, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
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
import { BaseComponent } from '@ngatl/core';
import { SpeakerActions } from '../actions';
import { SpeakerState } from '../states';
import { LinearGradient } from '../../../helpers';
import { NSAppService } from '../../core/services/ns-app.service';

@Component( {
  moduleId: module.id,
  selector: 'ngatl-ns-speaker',
  templateUrl: 'speaker.component.html'
} )
export class SpeakerComponent extends BaseComponent implements AfterViewInit, OnInit {
  public speakerState$: BehaviorSubject<any> = new BehaviorSubject( [] );
  public search$: Subject<string> = new Subject();
  private _all: Array<any>;
  private _searchSpeakers: (value: string) => void;

  constructor(
    private store: Store<any>,
    private log: LoggerService,
    private vcRef: ViewContainerRef,
    private appService: NSAppService,
  ) {
    super();
    this.appService.currentVcRef = this.vcRef;
    this._searchSpeakers = this._searchSpeakersFn.bind( this );
  }

  ngOnInit() {
    this.store.select( s => s.conference.speakers )
      .takeUntil( this.destroy$ )
      .subscribe( ( speakers: SpeakerState.IState ) => {
        this._all = speakers.list;
        console.log('this._all:', this._all);
        console.log('typeof this._all:', typeof this._all);
        console.log('Array.isArray(this._all):', Array.isArray(this._all));
        this.speakerState$.next( this._all );
      } );

    this.search$
      .debounceTime( 500 )
      .takeUntil( this.destroy$ )
      .subscribe( this._searchSpeakers );
  }

  private _searchSpeakersFn( value: string ) {
    let lowercaseValue = '';
    if ( value ) {
      lowercaseValue = value.toLowerCase();
    }
    console.log('search:', lowercaseValue);
    console.log('this._all:', this._all);
    console.log('this._all.filter:', this._all.filter);
    console.log('this._all.reduce:', this._all.reduce);
    console.log('this._all.map:', this._all.map);
    console.log('this.search$:', this.search$);
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

  public openDetail( speaker: any ) {
    this.appService.openWebView( {
      vcRef: this.vcRef,
      context: {
        url: `https://twitter.com/${speaker.social.twitter}`,
        title: `@${speaker.social.twitter}`
      }
    } )
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

  ngAfterViewInit() { }
}
