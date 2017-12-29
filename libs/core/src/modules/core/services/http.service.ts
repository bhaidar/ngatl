import { Injectable, } from '@angular/core';
import {
  ConnectionBackend,
  RequestOptionsArgs,
  Request,
  Response,
  RequestOptions,
  Http,
  Headers,
} from '@angular/http';
// libs
import { Observable } from 'rxjs/Observable';
// app
import {
  isNativeScript,
  isObject,
  isIOS,
  isAndroid,
  safeSplit
} from '../../helpers';
import { AppActions } from '../../ngrx';
import { LocaleService } from './locale.service';
import { LogService } from './log.service';
import { HttpErrorService } from './http-error.service';
import { NetworkCommonService } from './network.service';

@Injectable()
export class HttpService extends Http {
  protected basePath = 'https://localhost';
  public defaultHeaders: Headers = new Headers();
  private _platform: string;

  constructor(
    backend: ConnectionBackend,
    defOpts: RequestOptions,
    private _localeService: LocaleService,
    private _httpErrorService: HttpErrorService,
    private _networkService: NetworkCommonService,
  ) {
    super(backend, defOpts);
    this.basePath = NetworkCommonService.API_URL;
  }

  // @see https://github.com/angular/angular/issues/10612 // TODO Is this still relevant?
  request(
    request: string | Request,
    options?: RequestOptionsArgs,
  ): Observable<Response> {
    if ( typeof request === 'string' ) {
      return this.get(request, options); // Recursion: transform url from String to Request
    }

    const req: Request = <Request>request;

    const reqBody = req.getBody();
    if ( reqBody ) {
      req.headers.append('Content-Type', 'application/json');
    }
    req.headers.append( 'Accept', 'application/json' );

    // platform
    if ( !this._platform ) {
      if ( isNativeScript() ) {
        if ( isIOS() ) {
          this._platform = 'ios_app';
        } else if ( isAndroid() ) {
          this._platform = 'android_app';
        }
      } else if ( typeof window !== 'undefined' ) {
        const agent = window.navigator.userAgent;
        const isMobile = agent.match( /mobile/i );
        if ( isMobile ) {
          this._platform = 'web_app_mobile';
        } else {
          this._platform = 'web_app_desktop';
        }
      }
    }
    if ( this._platform ) {
      req.headers.append('X-Client-Platform', this._platform);
    }
    if ( this._localeService.analytics.appVersion ) {
      req.headers.append('X-Client-Version', this._localeService.analytics.appVersion);
    }

    // use inMemoryLocale to avoid repetitive roundtrips to persistence
    req.headers.append('Accept-Language', this._localeService.inMemoryLocale);

    // auth token
    if ( this._networkService.authToken ) {
      req.headers.append('Authorization', `Bearer ${this._networkService.authToken}`);
    }

    // TODO limit when the backend caching works properly
    // if (this._networkService.useHttpCacheControlHeaders|| req.method === RequestMethod.Post) {
    //   this._networkService.useHttpCacheControlHeaders = false; // always immediately reset after use
    req.headers.append('Cache-control', 'no-cache');
    req.headers.append('Cache-control', 'no-store');
    req.headers.append('Expires', '0');
    req.headers.append('Pragma', 'no-cache');
    // }

    if ( !req.url.startsWith('http') && !req.url.startsWith('/') && this.basePath ) {
      req.url = this.basePath + req.url;
    }

    if ( LogService.DEBUG_HTTP.enable ) {
      if ( LogService.DEBUG_HTTP.jsonFilePath && req.url.indexOf(this.basePath) > -1 ) {
        // if using json files and it's a valid api call, use json file instead
        let endingUrl = req.url.replace(this.basePath, '');
        if ( endingUrl.indexOf('?') > -1 ) {
          // ignore url params
          endingUrl = safeSplit(endingUrl, '?')[0];
        }
        req.url = `${isNativeScript() ? '~' : 'http://localhost:4200'}${LogService.DEBUG_HTTP
          .jsonFilePath}${endingUrl}.json`;
      }
      console.log(`http request --- ${req.url}`);
      if ( LogService.DEBUG_HTTP.includeRequestHeaders ) {
        console.log('headers:', req.headers.toJSON());
      }
      if ( reqBody && LogService.DEBUG_HTTP.includeRequestBody ) {
        console.log('body:', reqBody);
        if ( isObject(reqBody) ) {
          for ( const key in reqBody ) {
            console.log(`   ${key}:`, reqBody[key]);
          }
        }
      }
    }

    return super
      .request(req, options)
      .takeUntil(this._networkService.offlineHttpCancel$(req.url))
      .do((response: Response) => {
        // only want valid Response types in here
        if ( response instanceof Response ) {
          // got a response, cleanup network error handling
          this._networkService.cleanup(response.url);
          // configurable debug output
          if ( LogService.DEBUG_HTTP.enable ) {
            if ( LogService.DEBUG_HTTP.includeResponse ) {
              console.log(`http response --- ${response.url}`);
              console.log('status:', response.status);
              // guarded since sometimes the response is not json'able
              // depends on backend result (might be a raw string sometimes)
              const result = response.json ? response.json() : response.toString();
              // mobile only prints [Object] to console, therefore stringify result to log
              // web prints objects
              console.log('result:', isNativeScript() ? JSON.stringify(result) : result);
              console.log(`http response end ---`);
            }
          }
        }
      })
      .catch((response: Response) => {
        // cleanup network error handling if response gets thrown
        let url = null;
        let status = 0;
        if ( response instanceof Response ) {
          url = response.url;
          status = response.status;
        }
        // a null url and status 0 is likely offline, just reset them all
        const isOffline = !url && status === 0;
        this._networkService.cleanup(url, isOffline);
        // use platform specific error handling
        if ( this._httpErrorService.errorHandler(response) ) {
          console.log(
            'http error: HttpService errorHandler returned true, re-throwing response to allow downstream catch to handle. response:',
            response,
          );
          return Observable.throw(response);
        } else {
          console.log(
            'http error: HttpService return Observable.of(new AppActions.NoopAction()), response:',
            response,
          );
          // prevent 'you provided 'undefined' where a stream was expected' error.
          return Observable.of(new AppActions.NoopAction());
        }
      });
  }

  public getBasePath(): string {
    return this.basePath;
  }
}
