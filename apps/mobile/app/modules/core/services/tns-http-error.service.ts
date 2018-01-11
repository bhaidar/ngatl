import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouterExtensions } from 'nativescript-angular/router';
import {
  HttpErrorService,
  LogService,
  WindowService,
  ProgressService,
} from '@ngatl/core';

@Injectable()
export class TnsHttpErrorService extends HttpErrorService {

  constructor(
    private _log: LogService,
    private _router: RouterExtensions,
    private _ngRouter: Router,
    private _win: WindowService,
    private _progressService: ProgressService,
    public translateService: TranslateService,
  ) {
    super(translateService);
  }

  public errorHandler(
    response: HttpErrorResponse,
  ) {
    // in all cases for safety, ensure spinner is turned off on errors
    this._progressService.toggleSpinner();

    if ( typeof response === 'string' ) {
      // likely offline error
      // allow this to go down to downstream catch
      this._log.debug('errorHandler:', response);

    } else if ( response instanceof HttpErrorResponse ) {
      switch ( response.status ) {
        case 502:
        case 503:
          if ( !this.maintenanceActive ) {
            this.maintenanceActive = true;
            this.errorFromRoutePath = this._ngRouter.url;
            // this._win.setTimeout(() => {
            //   this._router.navigate(['/maintenance'], {
            //     // this causes a routeReuse stacktrace, may bring back when nativescript-angular fixes it
            //     // clearHistory: true,
            //     transition : {
            //       name : 'slide',
            //     },
            //   });
            // }, 100);
          }
          // stop all downstream catch
          return false;
        case 500:
        case 501:
        case 504:
        case 505:
          // TODO With the exception of maybe 504, none of these errors should ever occur in Prod.
          // TODO For 504, may want to always show it as a non-blocking toast just to ensure it is properly handled.
          // TODO May want to do 4** errors as toasts too.
          const url = response.url;

          if ( url.includes('api-dev')
          || url.includes('api-beta')
          || url.includes('api-rc')) {

            let bodyMessage;
            if (response && response.message) {
              try {
                bodyMessage = response.message;
              } catch ( e ) {
                bodyMessage = 'Malformed response.';
              }
            }
            console.log( bodyMessage );
          }
          break;
        default:
          break;
      }
    }
    return true;
  }
}
