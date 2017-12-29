// angular
import {
  Injectable,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
// app
import { LogService } from '../../core/services/log.service';
import { WindowService } from '../../core/services/window.service';
import { FirebasePlatformToken } from '../../core/tokens';
import {
  isNativeScript,
  isObject,
} from '../../helpers';

export interface IAnalyticsProperties {
  category?: string;
  label?: string;
  action?: string;
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#hitType
  hitType?: 'pageview' | 'screenview' | 'event' | 'transaction' | 'item' | 'social' | 'exception' | 'timing';
  value?: number;
  page?: string;

  [key: string]: any;
}

export interface IAnalytics {
  track(
    action: string,
    properties: IAnalyticsProperties,
  ): void;
}

/**
 * Funnel for all analytics reporting data
 */
@Injectable()
export class AnalyticsService implements IAnalytics {
  private _devMode: boolean = false;

  private _appVersion: string = null;
  private _userId: number = null;

  constructor(
    private _log: LogService,
    private _win: WindowService,
    private _router: Router,
    // at moment, this is used in mobile only via {N} firebase plugin
    @Inject(FirebasePlatformToken) private _firebasePlatform: any,
  ) {
    this.devMode(false);
  }

  public set appVersion(value: string) {
    this._appVersion = value;
  }

  // here as a getter to help http.service retrieve this value without further injections
  public get appVersion() {
    return this._appVersion;
  }

  public set userId(value: number) {
    this._userId = value;
  }

  /**
   * Track actions, events, etc.
   **/
  public track(
    action: string,
    properties: any | IAnalyticsProperties,
  ): void {
    if (!this.devMode()) {
      if (LogService.DEBUG_ANALYTICS) {
        this._log.debug('track:', action, properties);
      }

      if ( this._firebasePlatform.analytics ) {
        // nativescript-firebase-plugin
        const props: any[] = [];
        if ( properties ) {
          if (properties.category) {
              props.push({
                  key: 'category',
                  value: properties.category
              });
          }
          if (properties.label) {
              props.push({
                  key: 'label',
                  value: properties.label
              });
          }
          if (properties.value) {
              props.push({
                  key: 'value',
                  value: properties.value
              });
          }

          // push all properties
          for ( const key in properties ) {
            let value = properties[key];
            if (isNativeScript()) {
              if (typeof value === 'number') {
                // ensure always a string value (native GTM sdk doesnt like numbers)
                value = value.toString();
              } else if (!value) {
                // if falsey, ensure it's a blank string
                value = this._platformBlank();
              }
            }
            props.push({
              key,
              value : value,
            });
          }
        }

        const trackData: { key: string; parameters: Array<{ key: string; value: any }> } = {
          key : action,
          parameters : props,
        };

        this._debug(trackData);
        // console.log(`---------- logEvent key: ${action}`);
        // for (let p of props) {
        //   console.log(`key: ${p.key}, value: ${p.value}`);
        // }
        this._firebasePlatform.analytics.logEvent(trackData).then(() => {
          // ignore
        });
      } else {
        // fallback to google tag manager for web
        const payload: any = {
          hitType : 'event' // default
        };
        // gtm dataLayer setup
        const data: any = {};

        if ( properties ) {
          if ( properties.hitType ) {
            payload.hitType = properties.hitType;
          }
          if ( properties.category ) {
            // GTM hitType=='event', track category as the event
            payload.eventCategory = data.category = properties.category;
          }
          if ( properties.label ) {
            payload.eventLabel = data.label = properties.label;
          }
          if ( properties.action ) {
            payload.eventAction = data.event = properties.action;
          } else if ( action ) {
            payload.eventAction = data.event = action;
          }
          if ( properties.page ) {
            payload.page = data.page = properties.page;
          }
          // if using GA:
          this._win.ga('send', payload);

          this._debug(payload);
        }
      }
    }
  }

  /**
   * Called automatically by default with Angular Routing and GA
   * However, that can be turned off and this could be used manually
   **/
  public pageTrack(path: string) {
    if ( !this.devMode() ) {
      this._log.debug(path);
      // if using GA:
      this._win.ga('send', {
          hitType: 'pageview',
          page: path
      });
    }
  }

  /**
   * Used for web google analytics as it allows content properties to be set
   */
  public setContent(
    key: string,
    value: string,
  ) {
    if ( !this.devMode() ) {
      this._log.debug(key, value);

      // if using GA:
      this._win.ga('set', key, value);
    }
  }

  /**
   * Identify authenticated users
   **/
  public identify(properties: { key: string; value: string }) {
    if ( !this.devMode() ) {
      this._log.debug(properties);

      const data: any = {};

      if ( properties ) {
        if ( this._firebasePlatform.analytics ) {
          this._firebasePlatform.analytics.setUserProperty(properties);
        } else {
          // if using GA:
          this.setContent(properties.key, properties.value);
        }
      }
    }
  }

  /**
   * Control whether analytics are tracked
   * true: dev mode on, therefore do not track anything
   * false: dev mode off, track everything
   **/
  public devMode(enable?: boolean): boolean {
    if ( typeof enable !== 'undefined' ) {
      this._devMode = enable;
    }
    return this._devMode;
  }

  /**
   * Analytics has a 100 char max limit, ensure it is not exceeded
   * stringify data
   * @param data persoItem data
   */
  public limitTrackData(data: any) {
    let dataString = data;
    if ( isObject(data) ) {
      try {
        // since JSON.strigify can be rogue if incoming object is invalid, play it safe with this try/catch
        dataString = JSON.stringify(data);
      } catch ( err ) {
        dataString = data.toString();
      }
    }
    if ( dataString && dataString.length > 100 ) {
      // limit to max of 100 for value
      return dataString.substring(0, 100);
    }
    return dataString;
  }

  private _platformBlank() {
    /**
     * NativeScript mobile analytics sdk does not usually like null
     */
    return isNativeScript() ? '' : null;
  }

  /**
   * debug
   */
  private _debug(data: any) {
    if ( LogService.DEBUG_ANALYTICS ) {
      if ( isNativeScript() ) {
        this._log.debug('Mobile track action:', data.key);
        if ( data.parameters ) {
          for ( const p of data.parameters ) {
            this._log.debug(p.key, p.value);
          }
        }
      } else {
        this._log.debug('Web track ---');
        for ( const key in data ) {
          this._log.debug(key, data[key]);
        }
      }
    }
  }

  private _debugTypes(properties: any) {
    if ( LogService.DEBUG_ANALYTICS && properties ) {
      for ( const key in properties ) {
        this._log.debug(`typeof properties.${key}:`, typeof properties[key]);
      }
    }
  }
}

/**
 * Base class
 * Standardizes tracking actions and categorization
 */
export class Analytics implements IAnalytics {
  public analytics: AnalyticsService;
  // sub-classes should define their category
  public category: string;

  /**
   * Track actions, events, etc.
   **/
  track(
    action: string,
    properties: IAnalyticsProperties = {},
  ): void {
    this.analytics.track(action, Object.assign({}, properties, { category : this.category }));
  }
}
