import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpParams,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
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
import { LogService } from './log.service';
import { HttpErrorService } from './http-error.service';
import { NetworkCommonService } from './network.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private _platform: string;

  constructor(
    private _network: NetworkCommonService,
    private _httpErrorService: HttpErrorService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
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

    const options: any = {};
    const headers: any = {};
    headers['X-Client-Platform'] = this._platform;
    if (this._network.authToken) {
      console.log('using authToken:', this._network.authToken);
      if (this._network.authToken === 'admin-token') {
        headers['Authorization'] = this._network.authToken;
        const params = new HttpParams();
        params.set('access_token', this._network.authToken);
        options.setParams = params;
      } else {
        headers['Authorization'] = `Bearer ${this._network.authToken}`;
      }
    }
    options.setHeaders = headers;
    request = request.clone(options);

    if ( LogService.DEBUG_HTTP.enable ) {
      console.log(`http request --- ${request.url}`);
      if ( LogService.DEBUG_HTTP.includeRequestHeaders ) {
        console.log('headers:', request.headers.keys);
      }
      if ( request.body && LogService.DEBUG_HTTP.includeRequestBody ) {
        console.log('body:', request.body);
        if ( isObject(request.body) ) {
          for ( const key in request.body ) {
            console.log(`   ${key}:`, request.body[key]);
          }
        }
      }
    }
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // configurable debug output
        if ( LogService.DEBUG_HTTP.enable ) {
          if ( LogService.DEBUG_HTTP.includeResponse ) {
            console.log(`http response --- ${event.url}`);
            console.log('status:', event.status);
            // guarded since sometimes the response is not json'able
            // depends on backend result (might be a raw string sometimes)
            const result = event.body;
            // mobile only prints [Object] to console, therefore stringify result to log
            // web prints objects
            console.log('result:', isNativeScript() ? JSON.stringify(result) : result);
            console.log(`http response end ---`);
          }
        }
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if ( this._httpErrorService.errorHandler(err) ) {
          
          console.log(
            'http error: ApiInterceptor errorHandler returned true, re-throwing response to allow downstream catch to handle. response:',
            err,
          );
          if ( LogService.DEBUG_HTTP.enable ) {
            // log out error detail
            for (const key in err) {
              console.log(key, err[key]);
            }
          }
          return Observable.throw(err);
        } else {
          console.log(
            'http error: ApiInterceptor return Observable.of(new AppActions.NoopAction()), response:',
            err,
          );
          // prevent 'you provided 'undefined' where a stream was expected' error.
          return Observable.of(new AppActions.NoopAction());
        }
      }
    });
  }
}