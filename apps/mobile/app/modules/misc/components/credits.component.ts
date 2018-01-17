import { Component, ViewContainerRef, OnInit } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import * as utils from 'tns-core-modules/utils/utils';
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { screen } from 'platform';

// app
import { LoggerService } from '@ngatl/api';
import { NSAppService } from '../../core/services/ns-app.service';
import { View } from 'tns-core-modules/ui/core/view/view';

@Component( {
  moduleId: module.id,
  selector: 'ngatl-ns-credits',
  templateUrl: 'credits.component.html'
} )
export class CreditsComponent implements OnInit {
  imgLeftOffset: number;
  prevOffset = -10;
  public renderView = false;

  constructor(
    private store: Store<any>,
    private log: LoggerService,
    private vcRef: ViewContainerRef,
    private appService: NSAppService,
  ) {
    this.appService.currentVcRef = this.vcRef;
  }

  ngOnInit() {
    this.renderView = true;
  }

  public viewGH() {
    utils.openUrl( 'http://nstudio.io' );
  }

  public viewPage() {
    utils.openUrl( 'https://docs.nativescript.org/angular/tutorial/ng-chapter-0' );
  }

  public viewCredit( target: number ) {
    switch ( target ) {
      case 1:
        utils.openUrl( 'http://ionicons.com/' );
        break;
      case 2:
        utils.openUrl( 'https://github.com/zackarychapple' );
        break;
      case 3:
        utils.openUrl( 'https://github.com/nitishdayal' );
        break;
      case 4:
        utils.openUrl( 'https://github.com/NathanWalker' );
        break;
      case 5:
        utils.openUrl( 'https://github.com/theoriginaljosh');
        break;
      case 6:
        utils.openUrl( 'https://github.com/sis0k0');
        break;
    }
  }

  public viewPlugin( target: number ) {
    switch ( target ) {
      case 1:
        utils.openUrl( 'https://github.com/NathanWalker/nativescript-spotify' );
        break;
      case 2:
        utils.openUrl( 'https://github.com/NathanWalker/nativescript-ezaudio' );
        break;
      case 3:
        utils.openUrl( 'https://github.com/NathanWalker/nativescript-fancyalert' );
        break;
      case 4:
        utils.openUrl( 'https://github.com/bradmartin/nativescript-gif' );
        break;
      case 5:
        utils.openUrl( 'https://github.com/pocketsmith/nativescript-loading-indicator' );
        break;
      case 6:
        utils.openUrl( 'https://github.com/NathanWalker/nativescript-ng2-fonticon' );
        break;
      case 7:
        utils.openUrl( 'https://github.com/EddyVerbruggen/nativescript-plugin-firebase' );
        break;
      case 8:
        utils.openUrl( 'https://github.com/TheOriginalJosh/nativescript-slides' );
        break;
      case 9:
        utils.openUrl( 'https://github.com/triniwiz/nativescript-splashscreen' );
        break;
      case 10:
        utils.openUrl( 'https://www.nativescript.org/ui-for-nativescript' );
        break;
      case 11:
        utils.openUrl( 'https://github.com/NathanaelA/nativescript-themes' );
        break;
      case 12:
        utils.openUrl( 'https://github.com/NathanaelA/nativescript-master-technology' );
        break;
      case 13:
        utils.openUrl( 'https://github.com/bradmartin/nativescript-audio' );
        break;
      case 14:
        utils.openUrl( 'https://github.com/NathanaelA/nativescript-permissions' );
        break;
      case 15:
        utils.openUrl( 'https://github.com/NathanWalker/nativescript-coachmarks' );
        break;
      case 16:
        utils.openUrl( 'https://github.com/toddanglin/nativescript-dev-sass' );
        break;
      case 17:
        utils.openUrl( 'https://github.com/tjvantoll/nativescript-social-share' );
        break;
      case 18:
        utils.openUrl( 'https://github.com/TheOriginalJosh/nativescript-swiss-army-knife' );
        break;
      case 19:
        utils.openUrl( 'https://github.com/EddyVerbruggen/nativescript-email' );
        break;
    }
  }

  ngAfterViewInit() {
    this.imgLeftOffset = ( screen.mainScreen.widthDIPs / 2 ) - ( 170 / 2 );
  }

  onScroll( event: ScrollEventData, scrollView: ScrollView, topView: View ) {
    const topViewHeight = 200;
    if ( this.prevOffset <= scrollView.verticalOffset ) {
      if ( topView.height >= 0 ) {
        topView.height = this.getTopViewHeight( topViewHeight, scrollView.verticalOffset );
      }
    } else {
      if ( topView.height <= topViewHeight ) {
        topView.height = this.getTopViewHeight( topViewHeight, scrollView.verticalOffset );
      }
    }
    this.prevOffset = scrollView.verticalOffset;
  }

  getTopViewHeight( topHeight: number, offset: number ): number {
    let newHeight;
    if ( ( topHeight - offset ) >= 0 ) {
      newHeight = topHeight - offset;
    } else {
      newHeight = 0;
    }
    return newHeight;
  }
}
