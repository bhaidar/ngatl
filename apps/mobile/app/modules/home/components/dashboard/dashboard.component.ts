import {
  Component,
  AfterViewInit,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SystemUser } from '@ngatl/api';
import { BaseComponent, UserActions, LogService, ModalActions, WindowService, ProgressService, UserState, IAppState } from '@ngatl/core';

// nativescript
import { BarcodeScanner } from 'nativescript-barcodescanner';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { Page } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { GestureTypes, SwipeGestureEventData } from 'tns-core-modules/ui/gestures';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import * as utils from 'tns-core-modules/utils/utils';
import { View } from 'tns-core-modules/ui/core/view';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation';
import { screen, isIOS, isAndroid } from 'tns-core-modules/platform';
import { ListViewEventData } from 'nativescript-pro-ui/listview';

// app
import { IConferenceAppState } from '../../../ngrx';
import { NSAppService } from '../../../core/services/ns-app.service';
import { BarcodeComponent } from '../../../shared/components/barcode/barcode.component';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-dashboard',
  templateUrl: 'dashboard.component.html',
  styles: [`
  @keyframes badge-bottom-intro {
      0% {
          transform: rotate(0) scale(0.6, 0.6) translate(${(screen.mainScreen.widthDIPs/2) - 275}, -600);
      }
      100% {
          transform: rotate(-8) scale(0.6, 0.6) translate(${(screen.mainScreen.widthDIPs/2) - 275}, -80);
      }
    }
    @keyframes badge-bottom-exit {
      0% {
        transform: rotate(-8) scale(0.6, 0.6) translate(${(screen.mainScreen.widthDIPs/2) - 275}, -80);
        opacity:1;
      }
      100% {
        transform: rotate(0) scale(0.6, 0.6) translate(${(screen.mainScreen.widthDIPs/2) - 275}, -600);
        opacity:0;
      }
    }

  .badge-bottom-intro {
    animation-name: badge-bottom-intro;
    animation-duration: .8;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .badge-bottom-intro.exit {
    animation-name: badge-bottom-exit;
    animation-duration: .5;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  @keyframes badge-top-intro {
      0% {
          transform: rotate(0) scale(0.4, 0.4) translate(${(screen.mainScreen.widthDIPs/2) - 42}, -600);
      }
      100% {
          transform: rotate(18) scale(0.4, 0.4) translate(${(screen.mainScreen.widthDIPs/2) - 42}, -180);
      }
    }
    @keyframes badge-top-exit {
      0% {
        transform: rotate(18) scale(0.4, 0.4) translate(${(screen.mainScreen.widthDIPs/2) - 42}, -180);
        opacity:1;
      }
      100% {
        transform: rotate(0) scale(0.4, 0.4) translate(${(screen.mainScreen.widthDIPs/2) - 42}, -600);
        opacity:0;
      }
    }

  .badge-top-intro {
    animation-name: badge-top-intro;
    animation-duration: .8;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .badge-top-intro.exit {
    animation-name: badge-top-exit;
    animation-duration: .5;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  @keyframes beacon-pulse {
    0% {
      transform: scale(.5, .5) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
      opacity:0;
    }
    25% {
      transform: scale(1.5, 1.5) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
      opacity:.8;
    }
    50% {
      transform: scale(3, 3) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
        opacity:0;
    }
    100% {
      transform: scale(.5, .5) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
        opacity:0;
    }
  }

  @keyframes beacon-pulse-exit {
    0% {
      opacity:0;
    }
    100% {
        opacity:0;
    }
  }
  .beacon-pulse {
    transform: scale(0.5, 0.5) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
    opacity:0;
    animation-name: beacon-pulse;
    animation-duration: 2;
    animation-delay: .8;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .beacon-pulse.exit {
    animation-name: beacon-pulse-exit;
    animation-duration: .5;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
  }
  `]
})
export class DashboardComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy {
  public user: any;
  public showIntro = false;
  public swipeEnable = true;
  public showSwiper = false;
  public showScans = false;
  public badgeExit = false;
  public fontSize = 15;
  public scans: Array<UserState.IRegisteredUser> = [];
  private _barcode: BarcodeScanner;
  private _swipeItemIndex: number;
  private _density: number;
  private _spinnerOn = false;
  private _beaconView: View;
  private _beaconAnime: Animation;
  private _scanResultTimeout: number;
  // private _stopAnime: () => void;
  // private _restartAnime: () => void;
  private _swipeHandler: (args: SwipeGestureEventData) => void;

  constructor(
    private _store: Store<any>,
    private _log: LogService,
    private _ngZone: NgZone,
    private _vcRef: ViewContainerRef,
    private _win: WindowService,
    private _translate: TranslateService,
    private _progressService: ProgressService,
    private _page: Page,
    public appService: NSAppService,
  ) {
    super();
    this._page.backgroundImage = 'res://home-bg';
    this.appService.currentVcRef = this._vcRef;
    this._density = utils.layout.getDisplayDensity();
    // this._stopAnime = this._stopAnimeFn.bind(this);
    // this._restartAnime = this._restartAnimeFn.bind(this);
    this._swipeHandler = this._swipeHandlerFn.bind(this);

    // test
    // this.scans = [
    //   {
    //     ticket_full_name: 'Mike Ryan',
    //     note: 'Ngrx core contributor who has an incredible understanding of TypeScript and Redux methodologies.'
    //   },
    //   {
    //     ticket_full_name: 'Richard Smith',
    //     note: 'A fantastically talented mobile developer who brings a diverse set of skills to any working environment.'
    //   }
    // ];
  }

  public openItem(item) {

  }

  public onItemTap(e) {
    if (e && isAndroid) {
      // android does not respond to tap events on items so use this
      // const persoItem = this.activeItems[e.index];
      // if (persoItem) {
      //   this.viewDetail(persoItem);
      // }
    }
  }

  public itemSwipeProgressStarted(args: ListViewEventData) {
    if (!this._density) {
      this._density = 0;
    }
    const delta = Math.floor(this._density) !== this._density ? 1.1 : .1;
    let right = Math.round(this._density * 100);
    let threshold = Math.round(this._density * 50);
    if (args) {
      if (typeof args.index === 'number' && args.index > -1 && this.scans && this.scans.length) {
        this._swipeItemIndex = args.index;
        const scan = this.scans[args.index];
      } else {
        // no valid item index
        // disable swipe
        right = threshold = 0;
      }
      if (args.data && args.data.swipeLimits) {
        // console.log('itemSwipeProgressStarted args.data.x:', args.data.x);
        const swipeLimits = args.data.swipeLimits;
        swipeLimits.top = 0;
        swipeLimits.bottom = 0;
        swipeLimits.left = 0;//Math.round(this._density * 100);
        // if kids, don't allow swipe right
        swipeLimits.right = right;
        swipeLimits.threshold = threshold;
      }
    }
  }

  public itemSwipeProgressChanged(args: ListViewEventData) {
    if (args && args.data) {
      console.log('itemSwipeProgressChanged args.data.x:', args.data.x);
      console.log('args.index:', args.index);
      if (typeof args.index === 'number' && args.index > -1 && this.scans && this.scans.length) {
        this._swipeItemIndex = args.index;
        const scan = this.scans[args.index];
        if (scan) {
          scan.swiping = args.data.x !== 0;
        }
      } 
    }
  }

  public itemSwipeProgressEnded(args: ListViewEventData) {
    if (args) {
      if (typeof args.index === 'number' && args.index > -1) {
        this._swipeItemIndex = args.index;
      }
      // if (args.data) {
      //   console.log('itemSwipeProgressEnded args.data.x:', args.data.x);
      // }
    }
  }

  public remove(e) {
    if (this._swipeItemIndex > -1 && this.scans && this.scans.length) {
      const scan = this.scans[this._swipeItemIndex];
      if (scan) {
        const promptOptions: dialogs.ConfirmOptions = {
          message: `${this._translate.instant(`dialogs.delete-scan`)} '${scan.ticket_full_name}'?`,
          okButtonText: this._translate.instant('dialogs.yes-delete'),
          cancelButtonText: this._translate.instant('dialogs.cancel'),
        };

        this._win.confirm(<any>promptOptions, () => {
          this._ngZone.run(() => {
            this._store.dispatch(new UserActions.RemoveScannedUserAction(scan));
          });
        }).then(
          result => {
            if (result) {
              this._ngZone.run(() => {
                this._store.dispatch(new UserActions.RemoveScannedUserAction(scan));
              });
            }
          });
      }
    } else {
      this._win.alert(this._translate.instant('general.error'));
    }
  }

  public disableRowColor(e) {
    if ( isIOS && e ) {
      const cell = e.ios;
      if ( cell ) {
        cell.selectionStyle = UITableViewCellSelectionStyle.None;
        if ( cell.backgroundView ) {
          cell.backgroundView.backgroundColor = new Color(0, 255, 0, 0).ios;
        }
      }
    }
  }

  public startBadge(e) {
    this._log.debug('startBadge:');
    this._log.debug(screen.mainScreen.widthDIPs + 'x' + screen.mainScreen.heightDIPs);
    // this._initBeacon();
    // this._showBadge();
    // this._win.setTimeout(() => {
    //   this._startBeacon();
    // }, 900);
  }

  private _initBeacon() {
    return new Promise((resolve) => {
      this._beaconView = <View>this._page.getViewById('beacon');
      if (this._beaconView) {
        this._beaconAnime = this._beaconView.createAnimation({
          translate: {
            x: (screen.mainScreen.widthDIPs/2) - 46,
            y: 260
          },
          scale: {
            x: .5,
            y: .5,
          },
          opacity:0,
          duration: 1,
          iterations: 1
        });
        this._beaconAnime.play().then(_ => {
          resolve();
        }, _ => {

        });
      }
    });
  }

  // private _showBadge() {
  //   const top = <View>this._page.getViewById('badge-top');
  //   const bottom = <View>this._page.getViewById('badge-bottom');
  //   if (bottom && top) {
  
  //     bottom.animate({
  //       translate: {
  //         x: (screen.mainScreen.widthDIPs/2) - 275,
  //         y: -600
  //       },
  //       scale: {
  //         x: .6,
  //         y: .6,
  //       },
  //       rotate:3,
  //       duration: 1,
  //       iterations: 1,
  //     }).then(_ => {
  //       bottom.animate({
  //         translate: {
  //           x: (screen.mainScreen.widthDIPs/2) - 275,
  //           y: -80
  //         },
  //         scale: {
  //           x: .6,
  //           y: .6,
  //         },
  //         rotate: -8,
  //         duration: 800,
  //         iterations: 1,
  //         curve: AnimationCurve.easeIn// AnimationCurve.spring
  //       });
  //     }, _ => {

  //     });
  
  //     top.animate({
  //       translate: {
  //         x: (screen.mainScreen.widthDIPs/2) - 42,
  //         y: -600
  //       },
  //       scale: {
  //         x: .4,
  //         y: .4,
  //       },
  //       rotate: 0,
  //       duration: 1,
  //       iterations: 1,
  //     }).then(_ => {
  //       top.animate({
  //         translate: {
  //           x: (screen.mainScreen.widthDIPs/2) - 42,
  //           y: -180
  //         },
  //         scale: {
  //           x: .4,
  //           y: .4,
  //         },
  //         rotate: 18,
  //         duration: 800,
  //         iterations: 1,
  //         curve: AnimationCurve.easeIn,
  //       }).then(_ => {
  //         this._startBeacon();
  //       }, _ => {

  //       });
  //     }, _ => {

  //     });
  //   }
  // }

  // private _startBeacon() {
  //   app.on(app.suspendEvent, this._stopAnime);
  //   app.on(app.resumeEvent, this._restartAnime);
  //   this._playBeacon();
  // }

  // private _restartAnimeFn() {
  //   this._log.debug('_restartAnimeFn!');
  //   this._log.debug(this._beaconAnime);
  //   if (this._beaconAnime) {
  //     this._log.debug(this._beaconAnime.isPlaying);
  //     if (this._beaconAnime.isPlaying !== true) {
  //       this._initBeacon().then(_ => {
  //         this._startBeacon();
  //       });
  //     }
  //   }
  // }

  // private _stopAnimeFn() {
  //   this._log.debug('_stopAnimeFn!');
  //   this._log.debug(this._beaconAnime);
  // }

  // private _stopBeacon() {
  //   if (this._beaconAnime) {
  //     // this._log.debug(this._beaconAnime.isPlaying);
  //     if (this._beaconAnime.isPlaying === true) {
  //       this._beaconAnime.cancel();
  //     }
  //   }
  // }

  // private _playBeacon(delay: number = 1000) {
  //   if (this._page) {
  //     if (this._beaconView) {
  //       this._beaconAnime = this._beaconView.createAnimation({
  //         translate: {
  //           x: (screen.mainScreen.widthDIPs/2) - 46,
  //           y: 260
  //         },
  //         scale: {
  //           x: .5,
  //           y: .5,
  //         },
  //         opacity:0,
  //         duration: 1,
  //         iterations: 1
  //       });
  //       this._beaconAnime.play().then(_ => {
  //         this._beaconAnime = this._beaconView.createAnimation({
  //           translate: {
  //             x: (screen.mainScreen.widthDIPs/2) - 46,
  //             y: 260
  //           },
  //           scale: {
  //             x: 1.5,
  //             y: 1.5,
  //           },
  //           delay,
  //           opacity:.8,
  //           duration: 500,
  //           iterations: 1,
  //           curve: AnimationCurve.easeIn
  //         });
  //         this._beaconAnime.play().then(_ => {
  //           this._beaconAnime = this._beaconView.createAnimation({
  //             translate: {
  //               x: (screen.mainScreen.widthDIPs/2) - 46,
  //               y: 260
  //             },
  //             scale: {
  //               x: 3,
  //               y: 3,
  //             },
  //             opacity:0,
  //             duration: 500,
  //             iterations: 1,
  //             curve: AnimationCurve.easeOut
  //           });
  //           this._beaconAnime.play().then(_ => {
  //             this._playBeacon(800);
  //           }, _ => {

  //           });
  //         }, _ => {

  //         });
  //       }, _ => {

  //       });
  //       // beacon.animate().then(_ => {
  //       //   beacon.animate().then(_ => {
  //       //     beacon.animate().then(_ => {
  //       //       this._playBeacon(800);
  //       //     }, _ => {

  //       //     });
  //       //   }, _ => {

  //       //   });
  //       // }, _ => {

  //       // });
  //     }
  //   }
  // }

  private _retractBadge() {
    this.badgeExit = true;
    this._win.setTimeout(_ => {
      this.showScans = true;
    }, 800);
    // const top = <View>this._page.getViewById('badge-top');
    // const bottom = <View>this._page.getViewById('badge-bottom');
    // if (bottom && top) {
  
    //   bottom.animate({
    //     translate: {
    //       x: (screen.mainScreen.widthDIPs/2) - 275,
    //       y: -600
    //     },
    //     scale: {
    //       x: .6,
    //       y: .6,
    //     },
    //     opacity:0,
    //     rotate:0,
    //     duration: 600,
    //     iterations: 1,
    //   }).then(_ => {
    //     this._ngZone.run(() => {
    //       this.showScans = true;
    //     });
    //   }, _ => {

    //   });
  
    //   top.animate({
    //     translate: {
    //       x: (screen.mainScreen.widthDIPs/2) - 42,
    //       y: -600
    //     },
    //     scale: {
    //       x: .4,
    //       y: .4,
    //     },
    //     rotate: 0,
    //     duration: 600,
    //     iterations: 1,
    //   }).then(_ => {

    //   }, _ => {

    //   });
    // }
  }

  public openBarcode() {
    this._barcode = new BarcodeScanner();
    this._openScanner();
  }

  public toggleSpinner() {
    this._spinnerOn = !this._spinnerOn;
    this._progressService.toggleSpinner( this._spinnerOn );
    this._win.setTimeout( _ => {
      this._spinnerOn = false;
      this._progressService.toggleSpinner( false );
    }, 800 );
  }

  public login() {
    this._store.dispatch(new UserActions.LoginAction(this.user));
  }

  public create() {
    // this._store.dispatch(new UserActions.CreateAction(this.user));
    const user = new SystemUser( this.user );
    for ( const key in user ) {
      this._log.debug( key, user[key] );
    }
    this._store.dispatch(new UserActions.CreateFinishAction(user));
  }

  public enter() {
    ['intro-background', 'intro-logo-n', 'intro-logo-ng', 'intro-logo-atl', 'intro-text-one', 'intro-text-two', 'intro-version', 'intro-swipe'].forEach(id => { //'intro-logo-bg', 
      const p = this._page.getViewById(id);
      if (p) {
        p.className = id + '-enter';
      }
    });

    this._win.setTimeout(_ => {
      this._ngZone.run(() => {
        this.appService.shownIntro = this.showIntro = true;
      });
    }, 1500);
  }

  // public showIntroTest() {
  //   this.appService.shownIntro = this.showIntro = false;
  //   ['intro-background', 'intro-logo-n', 'intro-logo-ng', 'intro-logo-atl', 'intro-text-one', 'intro-text-two', 'intro-version', 'intro-swipe'].forEach(id => { //'intro-logo-bg', 
  //     const p = this._page.getViewById(id);
  //     if (p) {
  //       p.className = id + '-intro';
  //     }
  //   });
  //   this._setupSwipe();
  // }

  ngOnInit() {
    this.user = {
      firstName: 'Any',
      lastName: 'User',
      username: 'user@ngatl.org',
      email: 'user@ngatl.org',
      password: '12341234'
    };
    this._store.select((s: IAppState) => s.user)
      .takeUntil(this.destroy$)
      .subscribe((s: UserState.IState) => {
        if (s.scanned) {
          this.scans = [...s.scanned];

          if (!this.badgeExit && this.scans.length) {
            // first scan! retract the intro badge out of view
            this._retractBadge();
          } else if (this.badgeExit && this.scans.length === 0) {
            // replace badge drop
            this.badgeExit = this.showScans = false;
          }
        }
      });
    if (!this.appService.shownIntro) {
      this.showSwiper = true;
    }
  }

  ngAfterViewInit() {
    this._setupSwipe();
  }

  // private _cnt = 0;
  public retractTest() {
    // if (this._cnt === 0) {
    //   this._win.alert('Test this!');
    //   this._cnt++;
    // } else if (this._cnt ===1) {
    //   let options: dialogs.ConfirmOptions = {
    //     title: this._translate.instant('dialogs.confirm'),
    //     message: `${this._translate.instant('user.badge-claim')} 'Jack White'?`,
    //     okButtonText: this._translate.instant('dialogs.yes-login'),
    //     cancelButtonText: this._translate.instant('dialogs.no'),
    //   };
    //   this._win.confirm(options, () => {
    //     this._log.debug('confirmed from dashboard.component.');
    //   });
    //   this._cnt = 0;
    // }
    // this._stopBeacon();
    this._retractBadge();
  }

  private _setupSwipe() {
    if (!this.appService.shownIntro) {
      // console.log('ngAfterViewInit...');

      this._win.setTimeout(_ => {

        const mainScreen = <View>this._page.getViewById('intro-elements'); 
        if (mainScreen) {
          mainScreen.on(GestureTypes.swipe, this._swipeHandler);
        }
      }, 5000);
    }
  }

  private _swipeHandlerFn(args: SwipeGestureEventData) {
    console.log('mainScreen swipe:', args.direction);
    if (args.direction) {
      this.enter();
      // also turn swipe off to prevent further swipes
      const mainScreen = <View>this._page.getViewById('intro-elements'); 
        if (mainScreen) {
          mainScreen.off(GestureTypes.swipe, this._swipeHandler);
        }
    }
  }

  ngOnDestroy() { 
    super.ngOnDestroy();
    // app.off(app.suspendEvent, this._stopAnime);
    // app.off(app.resumeEvent, this._restartAnime);
  }

  private _openScanner(requestPerm: boolean = true) {
    this._barcode.hasCameraPermission().then( ( granted: boolean ) => {
      this._log.debug( 'granted:', granted );
      if ( granted ) {
        this._barcode.available().then( ( avail: boolean ) => {
          this._log.debug( 'avail:', avail ); 
          if ( avail ) {
            this._launchScanner();
          }
        } );
      } else if (requestPerm) {
        this._barcode.requestCameraPermission().then( () => {
          this._launchScanner();
        } );
      } else {
        //this._win.alert( 'Please enable camera permissions in your device settings.' );
      }
    } );
  }

  private _launchScanner() {
    this._barcode.scan( {
      formats: 'QR_CODE,PDF_417,EAN_13',   // Pass in of you want to restrict scanning to certain types
      // cancelLabel: 'EXIT. Also, try the volume buttons!', // iOS only, default 'Close'
      cancelLabel: 'Cancel',
      cancelLabelBackgroundColor: '#000', // iOS only, default '#000000' (black)
      message: 'Use the volume buttons for extra light', // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
      showFlipCameraButton: true,   // default false
      preferFrontCamera: false,     // default false
      showTorchButton: true,        // default false
      beepOnScan: true,             // Play or Suppress beep on scan (default true)
      torchOn: false,               // launch with the flashlight on (default false)
      closeCallback: () => {
        this._log.debug( 'Scanner closed' );
        this._barcode = null;
      }, // invoked when the scanner was closed (success or abort)
      resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
      orientation: 'portrait',     // Android only, optionally lock the orientation to either 'portrait' or 'landscape'
      openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
    } ).then( ( result ) => {
      // this._log.debug( 'result:', result );
      if ( result ) {
        // this._log.debug( 'Scan format: ' + result.format );
        this._log.debug( 'Scan text:   ' + result.text );
        // for ( const key in result) {
        //   this._log.debug( key, result[key] );
        // }
        // this result handler fires more than once - prevent dupe firing
        // this._log.debug( 'typeof this._scanResultTimeout', typeof this._scanResultTimeout );
        if (typeof this._scanResultTimeout === 'undefined') {
          this._scanResultTimeout = this._win.setTimeout(_ => {
            this._resetScanTimeout();
          }, 1500);
          this._ngZone.run(() => {
            this._log.debug('this._ngZone.run result.text:', result.text);
            if (result.text) {
              const badgeGuid = result.text.split('/').slice(-1)[0];
              this._log.debug('badgeGuid:', badgeGuid);
              this._store.dispatch(new UserActions.FindUserAction({ badgeGuid }));
              // this._log.debug('this._store.dispatch(new UserActions.FindUserAction with:', badgeGuid);
            }
          });
        }
      }
    }, ( err ) => {
      this._log.debug( 'error:', err );
      // this._restartAnimeFn();
    } );
  }

  // public testAlert() {
  //   this._win.alert('testing this out yo, any good with multiple lines?');
  // }

  private _resetScanTimeout() {
    if (typeof this._scanResultTimeout !== 'undefined') {
      this._win.clearTimeout(this._scanResultTimeout);
      this._scanResultTimeout = undefined;
    }
  }
}
