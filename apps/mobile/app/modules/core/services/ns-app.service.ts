/**
 * NativeScript app services
 */
import { Inject, Injectable, ViewContainerRef, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as TNSApplication from 'tns-core-modules/application';
import * as TNSUtils from 'tns-core-modules/utils/utils';
import { DeviceOrientation } from 'tns-core-modules/ui/enums';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { isIOS, device, isAndroid } from 'tns-core-modules/platform';
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import * as permissions from 'nativescript-permissions';
import { compose as composeEmail, available as emailAvailable } from 'nativescript-email';
import { dial as phoneDial, sms as phoneSms } from 'nativescript-phone';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { WindowService, ProgressIndicatorActions, LogService, ProgressService, IAppState, UserState, UserService, UserActions, IPromptOptions, ModalActions } from '@ngatl/core';

// app
import { DrawerService } from './drawer.service';
import { NSWebViewComponent } from '../../shared/components/ns-webview/ns-webview.component';

export interface IOpenWebViewOptions {
  vcRef: ViewContainerRef;
  context?: any;
}

// helpful debugging utilities
export interface IDebugKeys {
  httpLogs: string;
}

export const DebugKeys: IDebugKeys = {
  httpLogs: 'pnp.httpLogs',
};
export let isHttpLogginEnabled = false;

export function toggleHttpLogs(
  enable,
  jsonFilePath?: string,
) {
  console.log( 'toggling http logs:', enable ? 'ON' : 'OFF' );
  isHttpLogginEnabled = enable;
  LogService.DEBUG_HTTP.enable = enable;
  LogService.DEBUG_HTTP.includeRequestBody = enable;
  LogService.DEBUG_HTTP.includeResponse = enable;
  if ( jsonFilePath ) {
    LogService.DEBUG_HTTP.jsonFilePath = jsonFilePath;
  }
};

@Injectable()
export class NSAppService {
  private _appVersion: string;
  private _shownIntro = false;

  // Auth helpers
  private _currentUser: UserState.IRegisteredUser;
  private _currentUser$: BehaviorSubject<UserState.IRegisteredUser> = new BehaviorSubject(null);
  private _isPasswordLogin: boolean;
  private _unauthorizedRouteAttempt: string;
  private _authGuardSub: Subscription;
  private _routerEventSub: Subscription;

  // orientation helper
  private _orientation: string;
  private _orientation$: Subject<any> = new Subject();
  private _deviceType: 'Phone' | 'Tablet';

  // misc helpers
  private _currentVcRef: ViewContainerRef;

  constructor(
    private _store: Store<any>,
    private _fonticon: TNSFontIconService, // DO NOT REMOVE
    private _router: RouterExtensions,
    private _ngRouter: Router,
    private _ngZone: NgZone,
    private _win: WindowService,
    private _log: LogService,
    private _translate: TranslateService,
    private _modal: ModalDialogService,
    private _progressService: ProgressService,
    private _drawerService: DrawerService,
    private _userService: UserService,
  ) {
    // TNSFontIconService - injected to construct it once for entire app
    this._log.debug( 'NSAppService constructed!' );

    // initialize core services
    this._initAppVersion();
    this._initAppEvents();
    this._initOrientationHandler();
    this._initUser();

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

  public set orientation( value ) {
    this._orientation = value;
    this.orientation$.next( value );
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

  /**
   * Open a webview modal passing along url and optionally a title as the context
   * @param options IOpenWebViewOptions
   */
  public openWebView( options: IOpenWebViewOptions ) {
    this._store.dispatch(
      new ProgressIndicatorActions.ShowAction( {
        page: {
          enabled: true,
          message: 'Loading...'
        }
      } )
    );
    this._modal.showModal( NSWebViewComponent, {
      viewContainerRef: options.vcRef || this.currentVcRef,
      context: options.context
    } );
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

  private _initUser() {
    this._store.select( ( s: IAppState ) => s.user )
      .subscribe( ( user: UserState.IState ) => {
        this._log.debug( 'current user:', user.current );
        this._currentUser = user.current;
        this._currentUser$.next(this._currentUser);
      } );

    this._userService.promptUserClaim$
      .subscribe( ( user: UserState.IClaimStatus ) => {
        this._win.setTimeout( _ => {
          let options: dialogs.ConfirmOptions = {
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
            if ( !isIOS ) {
              this._confirmClaim( user );
            }
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
          let options: IPromptOptions = {
            action: () => {
              this._log.debug( 'fancyalert confirm:', user );
              // fancy alert confirm
              this._confirmClaim( user );
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
  }

  private _confirmClaim( user: UserState.IClaimStatus ) {
    this._ngZone.run( () => {
      this._store.dispatch( new UserActions.ClaimUserAction( user ) );
    } );
  }

  private _initAppVersion() {
    let versionName: string;
    let buildNumber: string;
    if ( TNSApplication.android ) {
      const pi = TNSApplication.android.context
        .getPackageManager()
        .getPackageInfo( TNSApplication.android.context.getPackageName(), 0 );
      versionName = pi.versionName;
      buildNumber = pi.versionCode.toString();
    } else if ( TNSApplication.ios ) {
      versionName = NSBundle.mainBundle.objectForInfoDictionaryKey( 'CFBundleShortVersionString' );
      buildNumber = NSBundle.mainBundle.objectForInfoDictionaryKey( 'CFBundleVersion' );
    }
    this._appVersion = `v${versionName} (${buildNumber})`;
  }

  private _initAppEvents() {
    // For the future - may want to use these
    TNSApplication.on( TNSApplication.resumeEvent, () => {
      this._log.debug( `TNSApplication.resumeEvent` );
    } );
    TNSApplication.on( TNSApplication.suspendEvent, () => {
      this._log.debug( `TNSApplication.suspendEvent` );
    } );
  }

  private _initOrientationHandler() {
    this._log.debug( 'initializing orientation handling.' );
    this._deviceType = device.deviceType;

    // set initial orientation
    this.orientation = getOrientation();

    // handle orientation changes
    // TNSApplication.on( TNSApplication.orientationChangedEvent, e => {
    //   this._log.debug( `Old: ${this.orientation}; New: ${e.newValue}` );
    //   this._ngZone.run( () => {
    //     this.orientation = getOrientation();
    //     // this.cdRef.detectChanges();
    //   } );
    // } );
  }
}

const getOrientation = function () {
  if ( isIOS ) {
    const deviceOrientation = TNSUtils.ios.getter( UIDevice, UIDevice.currentDevice ).orientation;
    return deviceOrientation === UIDeviceOrientation.LandscapeLeft ||
      deviceOrientation === UIDeviceOrientation.LandscapeRight
      ? DeviceOrientation.landscape
      : DeviceOrientation.portrait;
  } else {
    var orientation = getContext()
      .getResources()
      .getConfiguration().orientation;
    switch ( orientation ) {
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

const getContext = function () {
  var ctx = java.lang.Class.forName( 'android.app.AppGlobals' )
    .getMethod( 'getInitialApplication', null )
    .invoke( null, null );
  if ( ctx ) {
    return ctx;
  }

  return java.lang.Class.forName( 'android.app.ActivityThread' )
    .getMethod( 'currentApplication', null )
    .invoke( null, null );
};
