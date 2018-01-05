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

// libs
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { LoggerService } from '@ngatl/api';
import { WindowService, ProgressIndicatorActions, LogService, ProgressService, IAppState, UserState } from '@ngatl/core';

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
    private _logger: LoggerService,
    private _modal: ModalDialogService,
    private _progressService: ProgressService,
    private _drawerService: DrawerService,
  ) {
    // TNSFontIconService - injected to construct it once for entire app
    this._logger.log('NSAppService constructed!');

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
      viewContainerRef: options.vcRef,
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
        console.log( 'current user:', user.current );
        if ( user.current ) {
          console.log( 'name:', user.current.firstName );
        }
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
      console.log(`TNSApplication.resumeEvent`);
    });
    TNSApplication.on(TNSApplication.suspendEvent, () => {
      console.log(`TNSApplication.suspendEvent`);
    });
  }

  private _initOrientationHandler() {
    console.log('initializing orientation handling.');
    this._deviceType = device.deviceType;

    // set initial orientation
    this.orientation = getOrientation();

    // handle orientation changes
    TNSApplication.on(TNSApplication.orientationChangedEvent, e => {
      console.log(`Old: ${this.orientation}; New: ${e.newValue}`);
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
