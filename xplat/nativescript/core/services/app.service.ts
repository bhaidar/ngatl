// angular
import { Injectable, Inject, NgZone, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

// nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as tnsApp from 'tns-core-modules/application';
import * as tnsUtils from 'tns-core-modules/utils/utils';
import { device, isIOS, isAndroid } from 'tns-core-modules/platform';
import { DeviceOrientation } from 'tns-core-modules/ui/enums';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import * as permissions from 'nativescript-permissions';
import { compose as composeEmail, available as emailAvailable } from 'nativescript-email';
import { dial as phoneDial, sms as phoneSms } from 'nativescript-phone';
import * as TNSFirebase from 'nativescript-plugin-firebase';
import { topmost } from 'tns-core-modules/ui/frame';

// libs
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { take, map, takeUntil } from 'rxjs/operators';
import { LogService, PlatformLanguageToken, UserState, UserService, UserActions, WindowService, ModalActions, ProgressService, IPromptOptions, ICoreState, PlatformFirebaseToken, UIState, ModalState } from '@ngatl/core';
import { DrawerService } from './drawer.service';
import { NSWebViewComponent } from '@ngatl/nativescript/features/ui/components/ns-webview/ns-webview.component';

export interface IOpenWebViewOptions {
  vcRef: ViewContainerRef;
  context?: any;
}

export interface IProcessPushData {
  message?: string;
  type?: 'promo' | 'watch' | 'notice'; // TODO: define?
  url?: '/sponsors' | '/speakers'; // TODO: add others?
}

/**
 * This service can be used for low level app wiring
 * for best practice purposes, this service sets up:
 * - app version
 * - orientation handling including a Subject the app can observe
 * - deviceType to help component bindings
 * - example of global app event wiring for resume/suspend
 */
@Injectable()
export class AppService {
  // fundamentals
  private _appVersion: string;
  private _shownIntro = false;

  // Auth helpers
  private _currentUser: UserState.IRegisteredUser;
  private _currentUser$: BehaviorSubject<UserState.IRegisteredUser> = new BehaviorSubject(null);
  private _initUser = false;
  private _isPasswordLogin: boolean;
  private _registeredPush: boolean;
  private _pushTokenPosted: boolean;
  // specific android handling for devices
  public preventAndroidGlobalHardwareBack = false;
  public androidTapPushNotificationData: any;
  // modal helper (helps allow force closing of modals from anywhere)
  public forceModalClose$: Subject<boolean> = new Subject();
  // push notification types which user tapped when app was in background that need to be acted upon
  public pushDataNeedsHandling$: BehaviorSubject<IProcessPushData> = new BehaviorSubject(null);

  // misc helpers
  private _currentVcRef: ViewContainerRef;

  // orientation helper
  private _orientation: string;
  private _orientation$: Subject<any> = new Subject();
  private _deviceType: 'Phone' | 'Tablet';

  constructor(
    private _store: Store<any>,
    private _ngZone: NgZone,
    private _log: LogService,
    private _win: WindowService,
    private _ngRouter: Router,
    private _router: RouterExtensions,
    private _translate: TranslateService,
    private _drawerService: DrawerService,
    private _progressService: ProgressService,
    private _userService: UserService,
    @Inject(PlatformLanguageToken) private _lang: string,
    @Inject(PlatformFirebaseToken) private _firebase: any,
  ) {
    // initialize core services
    this._initAppVersion();
    this._initLocale();
    this._initOrientation();
    this._initAppEvents();
    this._initUserSubscription();

    this._drawerService.openWeb$
      .subscribe( ( context: { title: string; url: string; } ) => {
        this.openWebView( {
          context: context,
          vcRef: this.currentVcRef,
        } );
      } )
  }

  public get currentUser() {
    return this._currentUser;
  }

  public get currentUser$() {
    return this._currentUser$;
  }

  public set shownIntro( value: boolean ) {
    this._shownIntro = value;
  }

  public get shownIntro() {
    return this._shownIntro;
  }

  public get currentVcRef() {
    return this._currentVcRef;
  }

  public set currentVcRef( value: ViewContainerRef ) {
    this._currentVcRef = value;
  }

  public set isPasswordLogin( value: boolean ) {
    this._isPasswordLogin = value;
  }

  public get isPasswordLogin() {
    return this._isPasswordLogin;
  }

  public get orientation() {
    return this._orientation;
  }

  public set orientation(value) {
    this._log.debug('setting orientation:', value);
    this._orientation = value;
    this._orientation$.next(value);
  }

  public get orientation$() {
    return this._orientation$;
  }

  public get deviceType() {
    return this._deviceType;
  }

  public get appVersion() {
    return this._appVersion;
  }

  public initFirebase() {
    const initOptions: TNSFirebase.InitOptions = {
      onAuthStateChanged: (data: any) => {
        this._log.debug('Firebase onAuthStateChanged:', data.loggedIn);
      },
      analyticsCollectionEnabled: true,
      showNotificationsWhenInForeground: true
    };

    this._firebase.init(initOptions)
        .then(
          instance => {
            this._log.debug('Firebase plugin initialized.');
          },
          error => {
            this._log.debug(`Firebase plugin initialization failed with: ${error}`);
          },
        );
  }

  public resetModal() {
    // reset result
    this._store.dispatch(new ModalActions.ClosedAction({
      open: false,
      latestResult: null,
    }));
  }

  /**
   * Navigate back with an optional delay before firing
   * @param delay number
   */
  public navigateBack( delay?: number, backToPrevious?: boolean ) {
    const navBack = () => {
      if ( backToPrevious ) {
        this._router.backToPreviousPage();
      } else {
        this._router.back();
      }
    };

    if ( delay ) {
      this._win.setTimeout( () => {
        navBack();
      }, delay );
    } else {
      navBack();
    }
  }

  public email( addr: string, confirm?: boolean ) {
    return new Promise( ( resolve, reject ) => {
      if ( confirm ) {
        this._win.confirm(this._translate.instant( 'user.email-confirm-compose' ), () => {
          resolve();
        });
        // const emailLabel = this._translate.instant( 'user.email-confirm-compose' );
        // const options: any = {
        //   cancelButtonText: this._translate.instant( 'dialogs.cancel' ),
        // };
        // const actions = [emailLabel];
        // options.actions = actions;
        // dialogs.action( options ).then( ( result: string ) => {
        //   switch ( result ) {
        //     case emailLabel:
        //       resolve();
        //       break;
        //     default:
        //       reject();
        //       break;
        //   }
        // } );
      } else {
        this._emailNow( addr );
        resolve();
      }
    } );
  }

  private _emailNow( addr: string ) {
    emailAvailable().then( ( avail ) => {
      if ( avail ) {
        composeEmail( {
          to: [addr],
        } ).then( _ => {

        }, ( err ) => {
          this._win.alert( this._translate.instant( 'general.error' ) );
        } );
      }
    } );
  }

  public phone( tel: string, confirm?: boolean ) {
    return new Promise( ( resolve, reject ) => {
      if (confirm) {
        const phoneLabel = this._translate.instant( 'user.phone' );
        const smsLabel = this._translate.instant( 'dialogs.sms' );
        const options: any = {
          cancelButtonText: this._translate.instant( 'dialogs.cancel' ),
        };
        const actions = [phoneLabel, smsLabel];
        options.actions = actions;
        dialogs.action( options ).then( ( result: string ) => {
          switch ( result ) {
            case phoneLabel:
              phoneDial( tel, true );
              break;
            case smsLabel:
              if (confirm) {
                this._win.confirm(this._translate.instant( 'user.sms-confirm-compose' ), () => {
                  resolve();
                });
              } else {
                this._phoneSmsNow(tel);
              }
              break;
          }
        } );
      } else {
        this._phoneSmsNow(tel);
      }
    });
  }

  private _phoneSmsNow(tel: string) {
    phoneSms( [tel], this._translate.instant( 'general.ngatl-text-msg' ) );
  }

  private _initAppVersion() {
    let versionName: string;
    let buildNumber: string;

    if (tnsApp.android) {
      const pi = tnsApp.android.context
        .getPackageManager()
        .getPackageInfo(tnsApp.android.context.getPackageName(), 0);
      versionName = pi.versionName;
      buildNumber = pi.versionCode.toString();
    } else if (tnsApp.ios) {
      versionName = NSBundle.mainBundle.objectForInfoDictionaryKey(
        'CFBundleShortVersionString'
      );
      buildNumber = NSBundle.mainBundle.objectForInfoDictionaryKey(
        'CFBundleVersion'
      );
    }
    this._appVersion = `v${versionName} (${buildNumber})`;
    this._log.debug('App version:', this._appVersion);
  }

  private _initLocale() {
    this._translate.use(this._lang);
  }

  private _initAppEvents() {
    // For the future - may want to use these
    tnsApp.on(tnsApp.resumeEvent, (data: tnsApp.ApplicationEventData) => {
      this._log.debug('tnsApp.resumeEvent');
      this._androidProcessIntent(data, 'resume');
    });
    tnsApp.on(tnsApp.suspendEvent, () => {
      this._log.debug('tnsApp.suspendEvent');
    });
    tnsApp.on(tnsApp.launchEvent, (data: tnsApp.ApplicationEventData) => {
      this._log.debug('tnsApp.launchEvent');
      this._androidProcessIntent(data, 'launch');
    });
    tnsApp.on(tnsApp.exitEvent, () => {
      this._log.debug('tnsApp.exitEvent');
      if (isAndroid) {
        // clear any custom platform specific events on android
        // this is needed due to using launchMode "singleTask"
        // when relaunched after a manual call to 'finish()' it will dupe events on the activity otherwise
        tnsApp.android.off(tnsApp.AndroidApplication.activityBackPressedEvent);
      }
    });
    if ( !isIOS ) {
      // Android specific event handling
      tnsApp.android.on(tnsApp.AndroidApplication.activityBackPressedEvent, this._androidGlobalBackHandler.bind(this));
    }
  }

  private _androidProcessIntent(data: tnsApp.ApplicationEventData, type: 'resume' | 'launch') {
    this._log.debug('_androidProcessIntent for type:', type);
    if (isAndroid) {
      if (data && data.android && data.android.getIntent) {
        const intent = data.android.getIntent();
        this._log.debug('intent value:', intent);

        const bundle: android.os.Bundle = intent.getExtras();
        if (bundle) {
            const keys = bundle.keySet();
            const iterator = keys.iterator();
            const bundleKeys = [];
            let pushPayload: any;
            while (iterator.hasNext()) {
              /**
               * This come in looking like this:
               * google.delivered_priority: high
                  google.sent_time: 1543977302903
                  google.ttl: 2419200
                  productCode: PAS03
                  google.original_priority: high
                  from: 729878306250
                  type: purchase
                  google.message_id: 0:1543977302917691%6c4d1fc86c4d1fc8
               */
              bundleKeys.push(iterator.next());

            }
            if (bundleKeys.includes('google.message_id')) {
              // if we have a google message id then this is a push notification being tapped on
              // prepare payload format
              pushPayload = { data: {}};
              for (const key of bundleKeys) {
                const value = bundle.get(key).toString();
                pushPayload.data[key] = value;

                this._log.debug(`${key}:${value}`);
              }
              // ensure to clear intent extras, otherwise will cause infinite recursive loop on certian activity flow actions (purchase flow opens google play purchase activity which fires suspend event - then exiting that activity will cause app to fire resume which would process these intent extras again causing it to be in infinite purchase loop)
              data.android.getIntent().replaceExtras(new android.os.Bundle());
            }
            if (pushPayload) {
              // process push data
              this._log.debug('pushData:', JSON.stringify(pushPayload));
              this._preparePushData(pushPayload);
            }
        }
      }
    }
  }

  private _resetPushData() {
    this.pushDataNeedsHandling$.next(null); // reset
  }

  // push notifications handling (prepare for processing)
  private _preparePushData(payload: any) {
    if (payload && payload.data) {
      this._ngZone.run(() => {
        if (payload.data.type && (payload.data.url || payload.data.productCode || payload.data.persoItemId)) {
          const data = payload.data;
          const options: IProcessPushData = {
            type: data.type,
          };
          if (data.url) {
            // since the ones above can also contain a `url` always handle this one last
            // because above properties take precedence over url
            options.url = data.url;
          }
          if (payload.body) {
            options.message = payload.body;
          }
          this.pushDataNeedsHandling$.next(options);
        }
      });
    }
  }

  private _androidGlobalBackHandler(args: tnsApp.AndroidActivityBackPressedEventData) {
    if (!this.preventAndroidGlobalHardwareBack) {
      let isModalOpen = false;
      this._store.pipe(
        select(UIState.selectModal),
        take(1)
      ).subscribe((modal: ModalState.IState) => {
        isModalOpen = modal.open;
      });
      const isBaseRoute = this._ngRouter.url === '/home';
      if (!isModalOpen && isBaseRoute) {
        // 1. if on the starting page
        // args.cancel = true;
        // APP MUST EXIT
        (<any>tnsApp.android.foregroundActivity).finish();
      } else {
        const currentPage = topmost().currentPage;

        if (isModalOpen) {
          // prevent closing modals via hardware button
          args.cancel = true;
          this._ngZone.run(() => {
            // force the modal closed
            this.forceModalClose$.next(true);
          });
          
        } 
        // always reset window state since a hardware back can close dialogs which would circumvent the WindowService state handling (isDialogOpen/isConfirmOpen) reset
        this._win.reset();
      }
    }
  }

  /**
   * Open a webview modal passing along url and optionally a title as the context
   * @param options IOpenWebViewOptions
   */
  public openWebView( options: IOpenWebViewOptions ) {
    this._progressService.toggleSpinner(true, { message: 'Loading...'});
    this._store.dispatch(new ModalActions.OpenAction({
      cmpType: NSWebViewComponent,
      modalOptions: {
        viewContainerRef: options.vcRef || this.currentVcRef,
        context: options.context
      }
    }));
    if (!isIOS) {
      // android load callback does not fire so ensure spinner just hides
      this._win.setTimeout(_ => {
        this._progressService.toggleSpinner();
      }, 500);
    }
  }

  /**
   * Show or hide progress indicator
   * @param enable boolean
   */
  public toggleSpinner( enable?: boolean, details?: { message?: string; progress?: number } ) {
    // wrapped inside NgZone since {N} 3rd party integrations may leave the zone
    this._ngZone.run( () => {
      this._progressService.toggleSpinner( enable, details );
    } );
  }

  /**
   * consistent permission handling
   */
  public handlePermission(
    androidPermissions: Array<any>,
    explanation?: string,
  ): Promise<boolean> {
    this._log.debug( 'handlePermission' );
    return new Promise( (
      resolve,
      reject,
    ) => {
      if ( isAndroid ) {
        const deviceSdk = parseInt( device.sdkVersion, 10 );
        if ( deviceSdk >= 23 ) {
          permissions.requestPermission( androidPermissions, explanation )
            .then( () => {
              this._log.debug( 'Permissions granted!' );
              this._ngZone.run( () => {
                resolve( true );
              } );
            }, () => {
              reject();
            } )
            .catch( () => {
              this._log.debug( 'Uh oh, no permissions - plan B time!' );
              reject();
            } );
        } else {
          this._ngZone.run( () => {
            // lower SDK versions will grant permission from AndroidManifest file
            resolve( true );
          } );
        }
      } else {
        const status = PHPhotoLibrary.authorizationStatus();
        // this.log.debug('PHPhotoLibrary.authorizationStatus:', status);
        // this.log.debug('PHAuthorizationStatus.Authorized:', PHAuthorizationStatus.Authorized);
        // this.log.debug('PHAuthorizationStatus.Denied:', PHAuthorizationStatus.Denied);
        // this.log.debug('PHAuthorizationStatus.NotDetermined:', PHAuthorizationStatus.NotDetermined);
        // this.log.debug('PHAuthorizationStatus.Restricted:', PHAuthorizationStatus.Restricted);
        if ( status === PHAuthorizationStatus.Authorized ) {
          this._log.debug( 'Permissions granted!' );
          this._ngZone.run( () => {
            resolve( true );
          } );
        } else if ( status === PHAuthorizationStatus.Denied ) {
          reject();
        } else if ( status === PHAuthorizationStatus.NotDetermined ) {
          // request
          PHPhotoLibrary.requestAuthorization( ( status ) => {
            if ( status === PHAuthorizationStatus.Authorized ) {
              this._ngZone.run( () => {
                resolve( true );
              } );
            } else {
              reject();
            }
          } );
        } else if ( status === PHAuthorizationStatus.Restricted ) {
          // usually won't happen
          reject();
        }
      }
    } );
  }

  private _initUserSubscription() {
    this._store.select( ( s: ICoreState ) => s.user )
      .subscribe( ( user: UserState.IState ) => {
        this._log.debug( 'current user:', user.current );
        this._currentUser = user.current;
        this._currentUser$.next(this._currentUser);

        if (!this._currentUser) {
          // just for long live app sessions that user never closes the app
          // reset
          this._initUser = false;
          this._pushTokenPosted = false;

        } else if (!this._initUser) {
          this._initUser = true;
          // wire up things once for global app behavior when user is authenticated
          
        } else if (!this._pushTokenPosted) {
          this._registerPushDeviceToken();
        }

      } );

    this._userService.promptUserClaim$
      .subscribe( ( user: UserState.IClaimStatus ) => {
        this._win.setTimeout( _ => {
          const options: dialogs.ConfirmOptions = {
            title: this._translate.instant( 'dialogs.confirm' ),
            message: `${this._translate.instant( 'user.badge-claim' )} '${user.attendee.name}'?`,
            okButtonText: this._translate.instant( 'dialogs.yes-login' ),
            cancelButtonText: this._translate.instant( 'dialogs.no' ),
          };
          this._win.confirm( options, () => {
            this._log.debug( 'fancyalert confirm:', user );
            // fancy alert confirm
            this._confirmClaim( user );
          } ).then( _ => {

          }, _ => {
            // reject/cancel
            // this._win.setTimeout(_ => {
            //   this._win.alert(this._translate.instant(''));
            // }, 300);
          } );
        }, 500 );
      } );

    this._userService.promptSponsorPin$
      .subscribe( ( user: UserState.IClaimStatus ) => {
        this._win.setTimeout( _ => {
          const options: IPromptOptions = {
            action: (text: string) => {
              if (text) {
                this._log.debug( 'fancyalert prompt confirm:', text );
                this._log.debug( 'user.attendee.pin:', user.attendee.pin );
                // fancy alert confirm
                const pin = parseInt(text, 10);
                if (user.attendee.pin === pin) {
                  this._confirmSponsor(user);
                } else {
                  this._win.setTimeout(_ => {
                    this._win.alert(this._translate.instant('user.wrong-sponsor-pin'));
                  }, 300);
                }
              }
            },
            placeholder: this._translate.instant( 'dialogs.pin-number' ),
            initialValue: '',
            msg: `${this._translate.instant( 'user.confirm-sponsor-pin' )}`,
            okButtonText: this._translate.instant( 'dialogs.confirm' ),
            cancelButtonText: this._translate.instant( 'dialogs.no' ),
          };
          this._win.prompt( options ).then( _ => {
            // action handled in options
          }, _ => {

          } );
        }, 500 );
      } );

      // handle any push notifications if tabnavigation is already ready
    this.pushDataNeedsHandling$.subscribe(value => {
      if (value) {
        // if (this.tabNavigationReady$.getValue()) {
          this._processPushData(value);
          this._resetPushData();
        // }
      }
    });
  }

  public promptForPush() {
    if (!this._registeredPush) {
      this._registeredPush = true;
      this._ngZone.run(() => {

        TNSFirebase.addOnMessageReceivedCallback((payload: any) => {
          // NOTE: This behaves very differently between iOS/Android
          // mainly because likely android we configure to use launchMode: "singleTask"
          if (payload) {
            this._log.debug('push notification', payload);
            this._log.debug('push notification', JSON.stringify(payload));
            if (isIOS) {
              // NOTE: iOS will fire this only when user TAPS on the notification message
              // this is achieved only when initializing firebase.init with:
              // showNotificationsWhenInForeground: true
              // if that is not set, this will fire immediately when message comes in disregarding a user tap on it
              // this is because iOS will not show the message by default on screen when app is in foreground therefore will just fire this right away
              try {
                this._preparePushData(payload);
              } catch (err) {
                // ignore
              }
            } else {
              // NOTE: Android launchMode is set to singleTask which means this method will fire immediately when the message arrives when app is in the foreground
              // * Will NOT fire when app is in background even if user tapped on the notification
              // * Will fire when app is in foreground immediately without waiting for a user tap or anything
              // This is bad because it could initiate a flow and interrupt the user currently using the app
              // the data is handled instead inside Intents via app events (see initAppEvents and _androidProcessIntent)
              this.androidTapPushNotificationData = payload;
              if (payload.title || payload.body) {
                // show toast message of the push data since android doesn't show anything on top of app when it's in the foreground
                // this.showToast(null, null, true, {
                //   title: payload.title || '',
                //   body: payload.body || '',
                //   color: '#007a42',
                //   level: 'info'
                // });
              }
            }
          }
        });

        TNSFirebase.addOnPushTokenReceivedCallback((token: any) => {
          // platforms return proprietary objects here
          // use following method to retrieve string value to post
          this._registerPushDeviceToken();
        });

        // also register here since the callback above may not fire
        this._registerPushDeviceToken();
      });
    }
  }

  private _processPushData(data: IProcessPushData) {
    this._win.setTimeout(() => {
      this._ngZone.run(() => {
          if (['watch', 'promo'].includes(data.type)) {
            // route user to location
  
          } else {
            // switch (data.type) {
            //   case 'watch':
                
            //     break;
            //   case 'purchase':
                
            //     break;
            // }
          }
      });
    }, 10);
  }

  private _registerPushDeviceToken() {
    if (!this._pushTokenPosted) {
      TNSFirebase.getCurrentPushToken().then((token: string) => {
        if (token) {
          // check again sync getCurrentPushToken is asynchronous and we should avoid 2 api calls to device.create
          if (!this._pushTokenPosted) {
            this._log.debug('Register FCM Token', token);
            this._pushTokenPosted = true;
            // This will repost the push token EVERY time the user re-launches the app if they were logged in (even if the token had already been registered on the backend)
            // TODO: BRAM - NEED TO REGISTER FCM TOKEN WITH YOU HERE
            // this._store.dispatch(new DeviceActions.CreateAction({
            //   os :  'fcm',
            //   uid : token
            // }));
          }
        }
      });
    }
  }

  private _confirmClaim( user: UserState.IClaimStatus ) {
    this._ngZone.run( () => {
      this._store.dispatch( new UserActions.ClaimUserAction( user ) );
    } );
  }

  private _confirmSponsor( user: UserState.IClaimStatus ) {
    this._ngZone.run( () => {
      const updateUser = Object.assign({}, this.currentUser);
      updateUser.sponsor = this._userService.tmpBadgeId;
      this._store.dispatch( new UserActions.UpdateAction( updateUser ) );
      this._win.setTimeout(_ => {
        this._win.alert(this._translate.instant('user.sponsor-confirmed') + ' ' + user.attendee.name);
      }, 600);
    } );
  }

  private _initOrientation() {
    this._deviceType = device.deviceType;
    this._log.debug('deviceType:', this._deviceType);
    this._log.debug('initializing orientation handling.');

    // set initial orientation
    let orientation = getOrientation();
    this.orientation = orientation ? orientation : DeviceOrientation.portrait;
    this._log.debug('current orientation:', this.orientation);

    // handle orientation changes
    tnsApp.on(tnsApp.orientationChangedEvent, e => {
      // sometimes e.newValue will be undefined, ignore those
      if (e.newValue && this.orientation !== e.newValue) {
        orientation = getOrientation();
        if (orientation) {
          this._log.debug(`Old: ${this.orientation}; New: ${orientation}`);
          this._ngZone.run(() => {
            this.orientation = orientation;
          });
        }
      }
    });
  }
}

const getOrientation = function() {
  if (isIOS) {
    const deviceOrientation = tnsUtils.ios.getter(
      UIDevice,
      UIDevice.currentDevice
    ).orientation;
    if (
      deviceOrientation === UIDeviceOrientation.LandscapeLeft ||
      deviceOrientation === UIDeviceOrientation.LandscapeRight
    ) {
      return DeviceOrientation.landscape;
    } else if (
      deviceOrientation === UIDeviceOrientation.Portrait ||
      deviceOrientation == UIDeviceOrientation.PortraitUpsideDown
    ) {
      return DeviceOrientation.portrait;
    } else {
      return '';
    }
  } else {
    const orientation = getContext()
      .getResources()
      .getConfiguration().orientation;
    switch (orientation) {
      case 1 /* ORIENTATION_PORTRAIT (0x00000001) */:
        return DeviceOrientation.portrait;
      case 2 /* ORIENTATION_LANDSCAPE (0x00000002) */:
        return DeviceOrientation.landscape;
      default:
        /* ORIENTATION_UNDEFINED (0x00000000) */
        return DeviceOrientation.portrait;
    }
  }
};

const getContext = function() {
  const ctx = java.lang.Class.forName('android.app.AppGlobals')
    .getMethod('getInitialApplication', null)
    .invoke(null, null);
  if (ctx) {
    return ctx;
  }

  return java.lang.Class.forName('android.app.ActivityThread')
    .getMethod('currentApplication', null)
    .invoke(null, null);
};
