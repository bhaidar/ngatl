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
import { isIOS, device } from 'tns-core-modules/platform';
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
import * as dialogs from 'tns-core-modules/ui/dialogs';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { WindowService, ProgressIndicatorActions, LogService, ProgressService, IAppState, UserState, UserService, UserActions } from '@ngatl/core';

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
  httpLogs : 'pnp.httpLogs',
};
export let isHttpLogginEnabled = false;

export function toggleHttpLogs(
  enable,
  jsonFilePath?: string,
) {
  console.log('toggling http logs:', enable ? 'ON' : 'OFF');
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
    this._log.debug('NSAppService constructed!');

    // initialize core services
    this._initAppVersion();
    this._initAppEvents();
    this._initOrientationHandler();
    this._initUser();

    this._drawerService.openWeb$
      .subscribe((context: {title: string; url: string;}) => {
        this.openWebView({
          context: context,
          vcRef: this.currentVcRef,
        });
      })
  }

  public set shownIntro(value: boolean) {
    this._shownIntro = value;
  }

  public get shownIntro() {
    return this._shownIntro;
  }

  public get currentVcRef() {
    return this._currentVcRef;
  }

  public set currentVcRef(value: ViewContainerRef) {
    this._currentVcRef = value;
  }

  public set isPasswordLogin(value: boolean) {
    this._isPasswordLogin = value;
  }

  public get isPasswordLogin() {
    return this._isPasswordLogin;
  }

  public get orientation() {
    return this._orientation;
  }

  public set orientation(value) {
    this._orientation = value;
    this.orientation$.next(value);
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

  /**
   * Navigate back with an optional delay before firing
   * @param delay number
   */
  public navigateBack(delay?: number, backToPrevious?: boolean) {
    const navBack = () => {
      if (backToPrevious) {
        this._router.backToPreviousPage();
      } else {
        this._router.back();
      }
    };

    if (delay) {
      this._win.setTimeout(() => {
        navBack();
      }, delay);
    } else {
      navBack();
    }
  }

  /**
   * Open a webview modal passing along url and optionally a title as the context
   * @param options IOpenWebViewOptions
   */
  public openWebView(options: IOpenWebViewOptions) {
    this._store.dispatch(
      new ProgressIndicatorActions.ShowAction({
        page: {
          enabled: true,
          message: 'Loading...'
        }
      })
    );
    this._modal.showModal(NSWebViewComponent, {
      viewContainerRef: options.vcRef || this.currentVcRef,
      context: options.context
    });
  }

  /**
   * Show or hide progress indicator
   * @param enable boolean
   */
  public toggleSpinner(enable?: boolean, details?: { message?: string; progress?: number }) {
    // wrapped inside NgZone since {N} 3rd party integrations may leave the zone
    this._ngZone.run(() => {
      this._progressService.toggleSpinner(enable, details);
    });
  }

  private _initUser() {
    this._store.select( ( s: IAppState ) => s.user )
      .subscribe( (user: UserState.IState) => {
        this._log.debug( 'current user:', user.current );
        if ( user.current ) {
          this._log.debug( 'name:', user.current.ticket_first_name );
        }

        if (user.all) {
          this._log.debug('all user count:', user.all.length);
          // this._log.debug('first user...');
          // const firstUser = user.all[0];
          // for (const key in firstUser) {
          //   this._log.debug(key, firstUser[key]);
          // }
        }

        if (user.scanned) {
          this._log.debug('scanned user count:', user.scanned.length);
        }
      });

      this._userService.promptUserClaim$
        .subscribe((user: UserState.IRegisteredUser) => {
          this._win.setTimeout(_ => {
            let options: dialogs.ConfirmOptions = {
              message: `${this._translate.instant('user.badge-claim')} ${user.ticket_full_name}?`,
              okButtonText: this._translate.instant('dialogs.yes-login'),
              cancelButtonText: this._translate.instant('dialogs.no'),
            };
            this._win.confirm(options).then(_ => {
              this._ngZone.run(() => {
                this._store.dispatch(new UserActions.LoginSuccessAction(user));
              });
            }, _ => {
              this._ngZone.run(() => {
                this._store.dispatch(new UserActions.AddUserAction(user));
              });
            });
          }, 500);
        });
  }

  private _initAppVersion() {
    let versionName: string;
    let buildNumber: string;
    if (TNSApplication.android) {
      const pi = TNSApplication.android.context
        .getPackageManager()
        .getPackageInfo(TNSApplication.android.context.getPackageName(), 0);
      versionName = pi.versionName;
      buildNumber = pi.versionCode.toString();
    } else if (TNSApplication.ios) {
      versionName = NSBundle.mainBundle.objectForInfoDictionaryKey('CFBundleShortVersionString');
      buildNumber = NSBundle.mainBundle.objectForInfoDictionaryKey('CFBundleVersion');
    }
    this._appVersion = `v${versionName} (${buildNumber})`;
  }

  private _initAppEvents() {
    // For the future - may want to use these
    TNSApplication.on(TNSApplication.resumeEvent, () => {
      this._log.debug(`TNSApplication.resumeEvent`);
    });
    TNSApplication.on(TNSApplication.suspendEvent, () => {
      this._log.debug(`TNSApplication.suspendEvent`);
    });
  }

  private _initOrientationHandler() {
    this._log.debug('initializing orientation handling.');
    this._deviceType = device.deviceType;

    // set initial orientation
    this.orientation = getOrientation();

    // handle orientation changes
    TNSApplication.on(TNSApplication.orientationChangedEvent, e => {
      this._log.debug(`Old: ${this.orientation}; New: ${e.newValue}`);
      this._ngZone.run(() => {
        this.orientation = getOrientation();
        // this.cdRef.detectChanges();
      });
    });
  }
}

const getOrientation = function() {
  if (isIOS) {
    const deviceOrientation = TNSUtils.ios.getter(UIDevice, UIDevice.currentDevice).orientation;
    return deviceOrientation === UIDeviceOrientation.LandscapeLeft ||
      deviceOrientation === UIDeviceOrientation.LandscapeRight
      ? DeviceOrientation.landscape
      : DeviceOrientation.portrait;
  } else {
    var orientation = getContext()
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
  var ctx = java.lang.Class.forName('android.app.AppGlobals')
    .getMethod('getInitialApplication', null)
    .invoke(null, null);
  if (ctx) {
    return ctx;
  }

  return java.lang.Class.forName('android.app.ActivityThread')
    .getMethod('currentApplication', null)
    .invoke(null, null);
};
