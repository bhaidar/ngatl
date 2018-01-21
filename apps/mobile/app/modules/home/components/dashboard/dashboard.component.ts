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
import { BaseComponent, UserActions, LogService, ModalActions, WindowService, ProgressService, UserState, IAppState, UIState, UserService, ModalState, isObject } from '@ngatl/core';

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
import { File, path, knownFolders } from 'tns-core-modules/file-system';
import { ListViewEventData, RadListView } from 'nativescript-pro-ui/listview';
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { getResolution } from '../../../../helpers';
import { IConferenceAppState } from '../../../ngrx';
import { AWSService } from '../../../core/services/aws.service';
import { NSAppService } from '../../../core/services/ns-app.service';
// import { NoteEditComponent } from '../../../shared/components/note-edit/note-edit.component';

// const reso = getResolution();
// console.log('getResolution:', reso.width, reso.height, reso.widthPixels, reso.heightPixels);
//screen.mainScreen.widthDIPs

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-dashboard',
  templateUrl: 'dashboard.component.html',
  // styles: [`
  // @keyframes badge-bottom-intro {
  //     0% {
  //         transform: rotate(0) scale(0.6, 0.6) translate(${(screen.mainScreen.widthDIPs/2) - 275}, -600);
  //     }
  //     100% {
  //         transform: rotate(-8) scale(0.6, 0.6) translate(${(screen.mainScreen.widthDIPs/2) - 275}, -80);
  //     }
  //   }
  //   @keyframes badge-bottom-exit {
  //     0% {
  //       transform: rotate(-8) scale(0.6, 0.6) translate(${(screen.mainScreen.widthDIPs/2) - 275}, -80);
  //       opacity:1;
  //     }
  //     100% {
  //       transform: rotate(0) scale(0.6, 0.6) translate(${(screen.mainScreen.widthDIPs/2) - 275}, -600);
  //       opacity:0;
  //     }
  //   }

  // .badge-bottom-intro {
  //   animation-name: badge-bottom-intro;
  //   animation-duration: .8;
  //   animation-fill-mode: forwards;
  //   animation-iteration-count: 1;
  //   animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  // }
  // .badge-bottom-intro.exit {
  //   animation-name: badge-bottom-exit;
  //   animation-duration: .5;
  //   animation-fill-mode: forwards;
  //   animation-iteration-count: 1;
  //   animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  // }

  // @keyframes badge-top-intro {
  //     0% {
  //         transform: rotate(0) scale(0.4, 0.4) translate(${(screen.mainScreen.widthDIPs/2) - 42}, -600);
  //     }
  //     100% {
  //         transform: rotate(18) scale(0.4, 0.4) translate(${(screen.mainScreen.widthDIPs/2) - 42}, -180);
  //     }
  //   }
  //   @keyframes badge-top-exit {
  //     0% {
  //       transform: rotate(18) scale(0.4, 0.4) translate(${(screen.mainScreen.widthDIPs/2) - 42}, -180);
  //       opacity:1;
  //     }
  //     100% {
  //       transform: rotate(0) scale(0.4, 0.4) translate(${(screen.mainScreen.widthDIPs/2) - 42}, -600);
  //       opacity:0;
  //     }
  //   }

  // .badge-top-intro {
  //   animation-name: badge-top-intro;
  //   animation-duration: .8;
  //   animation-fill-mode: forwards;
  //   animation-iteration-count: 1;
  //   animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  // }
  // .badge-top-intro.exit {
  //   animation-name: badge-top-exit;
  //   animation-duration: .5;
  //   animation-fill-mode: forwards;
  //   animation-iteration-count: 1;
  //   animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  // }

  // @keyframes beacon-pulse {
  //   0% {
  //     transform: scale(.5, .5) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
  //     opacity:0;
  //   }
  //   25% {
  //     transform: scale(1.5, 1.5) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
  //     opacity:.8;
  //   }
  //   50% {
  //     transform: scale(3, 3) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
  //       opacity:0;
  //   }
  //   100% {
  //     transform: scale(.5, .5) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
  //       opacity:0;
  //   }
  // }

  // @keyframes beacon-pulse-exit {
  //   0% {
  //     opacity:0;
  //   }
  //   100% {
  //       opacity:0;
  //   }
  // }
  // .beacon-pulse {
  //   transform: scale(0.5, 0.5) translate(${(screen.mainScreen.widthDIPs/2) - 46}, 260);
  //   opacity:0;
  //   animation-name: beacon-pulse;
  //   animation-duration: 2;
  //   animation-delay: .8;
  //   animation-fill-mode: forwards;
  //   animation-iteration-count: infinite;
  //   animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  // }
  // .beacon-pulse.exit {
  //   animation-name: beacon-pulse-exit;
  //   animation-duration: .5;
  //   animation-fill-mode: forwards;
  //   animation-iteration-count: 1;
  // }
  // `]
})
export class DashboardComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy {
  public showIntro = false;
  public swipeEnable = true;
  public showSwiper = false;
  public showNotes = false;
  public badgeExit = false;
  public scans: Array<UserState.IConferenceAttendeeNote> = [];
  private _barcode: BarcodeScanner;
  private _swipeItemIndex: number;
  private _density: number;
  private _spinnerOn = false;
  private _beaconView: View;
  private _beaconAnime: Animation;
  private _scanResultTimeout: number;
  private _modalStoppedBeacon = false;
  private _authStateChecked = false;
  private _badgeViewAvail = false;
  private _ngOnInitFired = false;
  private _ngOnDestroyFired = false;
  private _swipeStarted = false;
  private _dashVcRef: ViewContainerRef;
  // private _stopAnime: () => void;
  private _restartAnime: () => void;

  constructor(
    private _store: Store<IConferenceAppState>,
    private _log: LogService,
    private _ngZone: NgZone,
    private _vcRef: ViewContainerRef,
    private _win: WindowService,
    private _translate: TranslateService,
    private _progressService: ProgressService,
    private _page: Page,
    private _router: RouterExtensions,
    private _userService: UserService,
    private _aws: AWSService,
    public appService: NSAppService,
  ) {
    super();
    this._page.backgroundImage = 'res://homebg';
    this._density = utils.layout.getDisplayDensity();
    // this._stopAnime = this._stopAnimeFn.bind(this);
    this._restartAnime = this._restartAnimeFn.bind(this);
    this._dashVcRef = this._vcRef;

    this._page.on('navigatedFrom', () => {
      this._ngZone.run(() => {
        this.ngOnDestroy();
      });
    });
    this._page.on('navigatingTo', () => {
      this._ngZone.run(() => {
        this.ngOnInit();
      });
    });
  }

  public openItem(item) {
    this._log.debug('openitem:', item);
    this._router.navigate(['/notes', item.id]);
    // , {
    //   animated: true,
    //   transition : {
    //     name : 'slide',
    //   },
    // });
    // this._store.dispatch(new ModalActions.OpenAction({
    //   cmpType: NoteEditComponent,
    //   modalOptions: {
    //     viewContainerRef: this._dashVcRef,
    //     context: {
    //       item
    //     }
    //   }
    // }));
  }

  public onItemTap(e) {
    this._log.debug('onItemTap');
    if (e && isAndroid && e.index > -1) {
      // android does not respond to tap events on items so use this
      const item = this.scans[e.index];
      if (item) {
        this.openItem(item);
      }
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
      // console.log('itemSwipeProgressChanged args.data.x:', args.data.x);
      // console.log('args.index:', args.index);
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
          message: `${this._translate.instant(`dialogs.delete-scan`)} '${scan.peer.name}'?`,
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

  public onPullRefreshInitiated(e) {
    const listview = e.object;
    if (listview) {
      // this._progressService.toggleSpinner(true);
      this.refreshUser();
      this._win.setTimeout(_ => {
        listview.notifyPullToRefreshFinished();
        // this._progressService.toggleSpinner(false);
      }, 1500);
    }
  }

  public refreshUser() {
    if (this._userService.currentUserId) {   
      this._store.dispatch(new UserActions.RefreshUserAction(this._userService.currentUserId));
    }
  }

  public listviewLoaded(e) {
    if (isIOS && e) {
      const listview = e.object;
      if (listview && listview.ios && listview.ios.pullToRefreshView) {
        listview.ios.pullToRefreshView.backgroundColor = new Color('#151F2F').ios;
        // for (const key in listview.ios.pullToRefreshView) {
        //   console.log(key);
        // }
      }
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

  public startBadge() {
    this._log.debug('startBadge:');
    this._log.debug(screen.mainScreen.widthDIPs + 'x' + screen.mainScreen.heightDIPs);
    this._initBeacon().then(_ => {
      this._log.debug('beacon initialized');
      this._userService.userInitialized$
        .takeUntil(this.destroy$)
        .subscribe((init) => {
          this._log.debug('userInitialized$:', init);
          if (init) {
            this._log.debug('this._authStateChecked:', this._authStateChecked);
            // only initiate badge sequence if auth state has been checked
            if (this._authStateChecked && this.scans.length === 0) {
              this._showBadge();
              // this._win.setTimeout(() => {
              //   this._startBeacon();
              // }, 900);
            }
          }
        });
    });
  }

  private _initBeacon() {
    return new Promise((resolve, reject) => {
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
          resolve();
        });
      }
    });
  }

  private _showBadge() {
    const top = <View>this._page.getViewById('badge-top');
    const bottom = <View>this._page.getViewById('badge-bottom');
    this._log.debug('showbadge top:', top);
    this._log.debug('showbadge bottom:', bottom);
    if (bottom && top) {
  
      bottom.animate({
        translate: {
          x: (screen.mainScreen.widthDIPs/2) - 275,
          y: -600
        },
        scale: {
          x: .6,
          y: .6,
        },
        opacity:.6,
        rotate:3,
        duration: 1,
        iterations: 1,
      }).then(_ => {
        bottom.animate({
          translate: {
            x: (screen.mainScreen.widthDIPs/2) - 275,
            y: -80
          },
          scale: {
            x: .6,
            y: .6,
          },
          opacity: 1,
          rotate: -8,
          duration: 800,
          iterations: 1,
          curve: AnimationCurve.easeIn// AnimationCurve.spring
        }).then(_ => {}, _ => {})
      }, _ => {

      });
  
      top.animate({
        translate: {
          x: (screen.mainScreen.widthDIPs/2) - 42,
          y: -600
        },
        scale: {
          x: .4,
          y: .4,
        },
        opacity:.6,
        rotate: 0,
        duration: 1,
        iterations: 1,
      }).then(_ => {
        top.animate({
          translate: {
            x: (screen.mainScreen.widthDIPs/2) - 42,
            y: -180
          },
          scale: {
            x: .4,
            y: .4,
          },
          opacity: 1,
          rotate: 18,
          duration: 800,
          iterations: 1,
          curve: AnimationCurve.easeIn,
        }).then(_ => {
          this._startBeacon();
        }, _ => {

        });
      }, _ => {

      });
    }
  }

  private _startBeacon() {
    // app.on(app.suspendEvent, this._stopAnime);
    if (isIOS) {
      app.on(app.resumeEvent, this._restartAnime);
    }
    this._playBeacon();
  }

  private _restartAnimeFn() {
    // this._log.debug('_restartAnimeFn!');
    // this._log.debug(this._beaconAnime);
    if (this._beaconAnime) {
      // this._log.debug(this._beaconAnime.isPlaying);
      if (this._beaconAnime.isPlaying !== true) {
        this._initBeacon().then(_ => {
          this._playBeacon();
        });
      }
    }
  }

  // private _stopAnimeFn() {
  //   this._log.debug('_stopAnimeFn!');
  //   this._log.debug(this._beaconAnime);
  // }

  private _stopBeacon() {
    if (this._beaconAnime) {
      // this._log.debug(this._beaconAnime.isPlaying);
      if (this._beaconAnime.isPlaying === true) {
        this._beaconAnime.cancel();
      }
    }
  }

  private _playBeacon(delay: number = 1000) {
    if (this._page) {
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
          this._beaconAnime = this._beaconView.createAnimation({
            translate: {
              x: (screen.mainScreen.widthDIPs/2) - 46,
              y: 260
            },
            scale: {
              x: 1.5,
              y: 1.5,
            },
            delay,
            opacity:.8,
            duration: 500,
            iterations: 1,
            curve: AnimationCurve.cubicBezier(0.25, 0.1, 0.25, 1)
          });
          this._beaconAnime.play().then(_ => {
            this._beaconAnime = this._beaconView.createAnimation({
              translate: {
                x: (screen.mainScreen.widthDIPs/2) - 46,
                y: 260
              },
              scale: {
                x: 3,
                y: 3,
              },
              opacity:0,
              duration: 500,
              iterations: 1,
              curve: AnimationCurve.cubicBezier(0.25, 0.1, 0.25, 1)
            });
            this._beaconAnime.play().then(_ => {
              this._playBeacon(800);
            }, _ => {

            });
          }, _ => {

          });
        }, _ => {

        });
      }
    }
  }

  private _retractBadge() {
    this.badgeExit = true;
    // this._win.setTimeout(_ => {
    //   this.showNotes = true;
    // }, 800);

    this._hideBeacon(1);

    const top = <View>this._page.getViewById('badge-top');
    const bottom = <View>this._page.getViewById('badge-bottom');
    if (bottom && top) {

      top.animate({
        translate: {
          x: (screen.mainScreen.widthDIPs/2) - 42,
          y: -600
        },
        scale: {
          x: .4,
          y: .4,
        },
        rotate: 0,
        duration: 600,
        iterations: 1,
      }).then(_ => {

      }, _ => {

      });
  
      bottom.animate({
        translate: {
          x: (screen.mainScreen.widthDIPs/2) - 275,
          y: -600
        },
        scale: {
          x: .6,
          y: .6,
        },
        opacity:0,
        rotate:0,
        duration: 620,
        iterations: 1,
      }).then(_ => {
        this._ngZone.run(() => {
          this.showNotes = true;
        });
      }, _ => {

      });
    }
  }

  private _hideBeacon(duration: number = 100) {
    if (this._beaconView) {
      this._stopBeacon();
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
        duration,
        iterations: 1
      });
      this._beaconAnime.play().then(_ => {

      });
    }
  }

  public openBarcode() {
    // for testing amazon uploads
    // const filepath = path.join(knownFolders.currentApp().path, 'assets', 'nng.png');
    // this._aws.upload(filepath);
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
    if (!this._ngOnInitFired) {
      this._ngOnInitFired = true;
      this._ngOnDestroyFired = false;
      this._log.debug('dashboard ngOnInit!');
      this.appService.currentVcRef = this._dashVcRef;

      this._store.select((s: IAppState) => s.user)
        .takeUntil(this.destroy$)
        .subscribe((s: UserState.IState) => {
          // this._log.debug('DashboardComponent s.user fired! s.current:', s.current);
          if (s.current) {
            this.scans = [...(s.current.notes || [])];

            if (!this.badgeExit && this.scans.length) {
              // console.log('scans available, this.appService.shownIntro:', this.appService.shownIntro);
              // console.log('this._badgeViewAvail:', this._badgeViewAvail);
              if (this.appService.shownIntro && this._badgeViewAvail) {
                // first scan! retract the intro badge out of view
                this._retractBadge();
              } else {
                // just show the notes since view hasn't even initialized yet 
                this.badgeExit = this.showNotes = true;
              }
            } else if (this.badgeExit && this.scans.length === 0) {
              this._showBadgeAgain();
            }
          } else if (this.badgeExit) {
            // user logged out or just no user
            this.scans = [];
            this._showBadgeAgain();
          } 
          this._authStateChecked = true;
        });
      this._store.select((s: IAppState) => s.ui)
        .takeUntil(this.destroy$)
        .subscribe((s: UIState.IState) => {
          if (s.modal.open) {
            this._modalStoppedBeacon = true;
            // always stop beacon
            this._hideBeacon(0);
          } else if (this._modalStoppedBeacon && !this.showNotes) {
            this._modalStoppedBeacon = false;
            // restart beacon
            this._playBeacon();
          }

          if (s.modal.latestResult && isObject(s.modal.latestResult)) {
            if (s.modal.latestResult.email || s.modal.latestResult.phone) {
              this._win.setTimeout(_ => {
                // open compose window
                if (s.modal.latestResult.email) {
                  this.appService.email(s.modal.latestResult.email);
                } else if (s.modal.latestResult.phone) {
                  this.appService.phone(s.modal.latestResult.phone);
                }
                // reset
                this.appService.resetModal();
              }, 500);
            }
          }
        });
    }
  }

  private _showBadgeAgain() {
    // replace badge drop
    this.badgeExit = this.showNotes = false;
    // show badge again
    this._initBeacon().then(_ => {
      this._showBadge();
    });
  }

  ngAfterViewInit() {
    console.log('dashboard ngAfterViewInit!');
    this._badgeViewAvail = true;

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

  public getListView() {
    return <RadListView>this._page.getViewById('scans-listview');
  }

  public tappedTop(e) {
    // TODO: scroll notes list back to top
    const listview = this.getListView();
    if (listview) {
      listview.scrollToIndex(0, true);
    }
  }

  private _setupSwipe() {
    if (!this.appService.shownIntro) {
      // console.log('ngAfterViewInit...');
      this._win.setTimeout(_ => {
        this.showSwiper = true;
      }, 4005);
    }
  }

  public swipeHandler(args: SwipeGestureEventData) {
    console.log('mainScreen swipe:', args.direction);
    if (args.direction && !this._swipeStarted) {
      this._swipeStarted = true;
      this.enter();
    }
  }

  ngOnDestroy() { 
    if (!this._ngOnDestroyFired) {
      this._ngOnDestroyFired = true;
      this._ngOnInitFired = false;
      this._authStateChecked = false;
      this._stopBeacon();
      console.log('dashboard ngOnDestroy!');
      super.ngOnDestroy();
      // app.off(app.suspendEvent, this._stopAnime);
      if (isIOS) {
        app.off(app.resumeEvent, this._restartAnime);
      }
    }
  }

  private _openScanner(requestPerm: boolean = true) {
    this._launchScanner();
    // this._barcode.hasCameraPermission().then( ( granted: boolean ) => {
    //   this._log.debug( 'granted:', granted );
    //   if ( granted ) {
    //     this._barcode.available().then( ( avail: boolean ) => {
    //       this._log.debug( 'avail:', avail ); 
    //       if ( avail ) {
    //         this._launchScanner();
    //       }
    //     } );
    //   } else if (requestPerm) {
    //     this._barcode.requestCameraPermission().then( () => {
    //       this._launchScanner();
    //     } );
    //   } else {
    //     //this._win.alert( 'Please enable camera permissions in your device settings.' );
    //   }
    // } );
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
