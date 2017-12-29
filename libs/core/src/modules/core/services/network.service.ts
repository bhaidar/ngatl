import { Injectable } from '@angular/core';
// libs
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { HttpErrorService } from './http-error.service';
import { LogService } from './log.service';

/**
 * This provides common network handling
 * Each platform web/mobile can inject this and use to help facilitate network handling
 */
@Injectable()
export class NetworkCommonService {
  public static API_URL: string = 'https://api-rc.ngatl.com/';
  public static BASE_URL: string = 'api/4.0/';
  private _offline$: Subject<boolean> = new Subject();
  private _isOffline = false;
  private _offlineHttpSub: { [url: string]: Subscription } = {};
  private _showOfflineNotice$: Subject<boolean> = new Subject();
  private _retryConnection$: Subject<boolean> = new Subject();
  // helper for http requests which need to help insternal browser http caching
  private _useHttpCacheControlHeaders = false;
  // helper for network calls that need an auth token
  private _authToken: string;

  constructor(
    private _errorService: HttpErrorService,
    private _log: LogService,
  ) {}

  public get offline$() {
    return this._offline$;
  }

  public set offline(value: boolean) {
    this._isOffline = value;
    this._offline$.next(value);
  }

  public get isOffline() {
    return this._isOffline;
  }

  /**
   * Platforms can observe this to implement their own reaction flows for when
   * the error of an api call is related to user losing connection and going offline
   */
  public get showOfflineNotice$() {
    return this._showOfflineNotice$;
  }

  public set showOfflineNotice(value: boolean) {
    this.offline = true; // ensure flag is set here
    this._showOfflineNotice$.next(value);
  }

  /**
   * Platforms can observe this for when users attempt to retry the connection
   * Each platform should implement it's own specific connection retry logic
   */
  public get retryConnection$() {
    return this._retryConnection$;
  }

  /**
   * Components can use this to trigger platform specific network connections retries
   */
  public retry() {
    this._retryConnection$.next(true);
  }

  /**
   * http cache control headers
   */
  public set useHttpCacheControlHeaders(value: boolean) {
    this._useHttpCacheControlHeaders = value;
  }

  public get useHttpCacheControlHeaders() {
    return this._useHttpCacheControlHeaders;
  }

  /**
   * helper for network requests which need a token
   */
  public set authToken(value: string) {
    this._authToken = value;
  }

  public get authToken() {
    return this._authToken;
  }

  /**
   * Http request
   * @param response the http response
   */
  public offlineHttpCancel$(url: string): Observable<boolean> {
    return Observable.create(
      observer => {
        if ( this._isOffline ) {
          this._log.debug(`offlineHttpCancel$ this._isOffline:`, this._isOffline);
          // go ahead and cancel, client is already offline, not able to make request anyway
          observer.error(this._errorService.localizedErrors.offline);
        } else {
          // this tracks individual offline handlers per request by it's url
          // prevent double request tracking if one had already been queued up
          this._clearSub(url);
          this._offlineHttpSub[url] = this.offline$.subscribe((isOffline: boolean) => {
            // if a request is made and client goes offline during the request
            if ( isOffline ) {
              this._log.debug(`this.offline$.subscribe fired, manually tearing down http request, isOffline:`, isOffline);
              this._clearSub(url);
              // cancel in-flight request
              observer.error(this._errorService.localizedErrors.offline);
            }
          });
        }
      });
  }

  public cleanup(
    url: string,
    resetAll?: boolean,
  ) {
    if ( this._offlineHttpSub ) {
      if ( resetAll ) {
        for ( const key in this._offlineHttpSub ) {
          this._clearSub(key);
        }
      } else {
        this._clearSub(url);
      }
    }
  }

  private _clearSub(url: string) {
    if ( this._offlineHttpSub && this._offlineHttpSub[url] ) {
      this._offlineHttpSub[url].unsubscribe();
      delete this._offlineHttpSub[url]; // remove entry
    }
  }
}
