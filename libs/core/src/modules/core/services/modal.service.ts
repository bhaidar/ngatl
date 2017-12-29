// angular
import { Injectable } from '@angular/core';
import {
  Router,
  NavigationStart,
} from '@angular/router';
// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// app
import { LogService } from './log.service';
// module
import { ModalActions } from '../actions/modal.action';
import { ModalState } from '../states/modal.state';
import { isObject } from '../../helpers';
import { IAppState } from '../../ngrx/index';

// open return value type
export interface IOpenReturn {
  cmpType: any;
  trackTitle?: string;
}

// used for special workaround for web ng-bootstrap in close method
declare var $;

@Injectable()
export class ModalPlatformService {
  public open(
    componentType: any,
    options?: any,
  ) {}
}

@Injectable()
export class ModalService {
  public modalForceAction: boolean;

  private _modalRef: any;
  private _routed: boolean;
  // convenient for easy access to when a modal closes along with it's result
  private _closed$: Subject<any> = new Subject();

  // these apply for the web
  private _defaultOptions: any = {
    backdrop : 'static',
    keyboard : true,
  };

  constructor(
    private _store: Store<IAppState>,
    private _platformModalService: ModalPlatformService,
    private _router: Router,
    private _log: LogService,
  ) {
    _router.events
           .filter(
             e => e instanceof NavigationStart)
           .throttleTime(600)
           .subscribe(
             e => {
               // ignore first app launch
               if ( this._routed ) {
                 if ( e instanceof NavigationStart ) {
                   this._store.dispatch(new ModalActions.CloseAction());
                 }
               } else {
                 this._routed = true;
               }
             });
  }

  public get closed$() {
    return this._closed$;
  }

  public open(options: ModalState.IOptions): IOpenReturn {
    const details: IOpenReturn = {
      cmpType : options.cmpType,
    };

    if ( !options.modalOptions ) {
      options.modalOptions = this._defaultOptions;
    }

    // open modal using platform specific modal service
    this._modalRef =
      typeof options.cmpType !== 'string'
        ? this._platformModalService.open(options.cmpType, options.modalOptions)
        : null;

    if ( options.props ) {
      // web can copy props onto passed in modal instances
      for ( const key in options.props ) {
        if ( key === 'trackTitle' ) {
          details.trackTitle = options.props[key];
        } else if ( this._modalRef && this._modalRef.componentInstance ) {
          this._modalRef.componentInstance[key] = options.props[key];
        }
      }
    }
    if ( this._modalRef ) {
      if ( this._modalRef.result ) {
        // likely ng-bootstrap (web)
        if ( typeof $ !== 'undefined' ) {
          const modalWindows = $('ngb-modal-window');
          if ( modalWindows && modalWindows.length ) {
            Observable.fromEvent(modalWindows, 'scroll')
              .takeUntil(this._closed$)
              .throttleTime(500)
              .subscribe(x => {
                 const a = document.activeElement;
                 if (a instanceof HTMLElement) {
                   a.blur();
                   a.focus();
                 }
              });
          }
        }

        this._modalRef.result.then(
          (result: any) => {
            this._closeWithResult(result);
            this._log.debug('Modal closed with:', result);
          }, (reason: any) => {
            this._closeWithResult();
            this._log.debug('Modal closed reason:', reason);
          },
        );
      } else if ( this._modalRef.then ) {
        // like {N} (mobile)
        this._modalRef.then(
          result => {
            this._closeWithResult(result);
            this._log.debug('Native modal closed with:', result);
          });
      }
    }
    return details;
  }

  public close(latestResult?: any | { params: any; value?: any }) {
    if ( this._modalRef ) {
      if ( this._modalRef.close ) {
        const backdropSelector = 'ngb-modal-backdrop';
        let modalBackdrops;
        let totalModals = 0;
        if ( typeof $ !== 'undefined' ) {
          modalBackdrops = $(backdropSelector);
          // on web since multiple modals can be opened on top of each other
          // there's a case when closing them will not remove the underlying modals
          if ( modalBackdrops ) {
            totalModals = modalBackdrops.length;
          }
        }

        // web ng-bootstrap
        this._modalRef.close(latestResult);

        if ( typeof $ !== 'undefined' ) {
          // ensure they are removed from DOM
          // this is probably a bug in ng-bootstrap but doing this will not hurt here for safety
          modalBackdrops = $(backdropSelector); // get latest
          if ( modalBackdrops.length === totalModals ) {
            // the _modalRef.close class above did not close any
            // manually remove multiple stacked modals in a row
            const modalWindows = $('ngb-modal-window');
            // these should be ultimately 0 after closed - if not remove top one (most recent one)
            if ( modalBackdrops && modalBackdrops.length ) {
              modalBackdrops[modalBackdrops.length - 1].remove();
            }
            if ( modalWindows && modalWindows.length ) {
              modalWindows[modalWindows.length - 1].remove();
            }
          }
        }
        return latestResult;
      } else if ( this._modalRef.then ) {
        // {N} ModalDialogService
        if ( isObject(latestResult) && latestResult.params ) {
          // {N} modal
          if ( latestResult.params.closeCallback ) {
            latestResult.params.closeCallback(latestResult.value);
          }
          return latestResult.value;
        }
      }
    }
    return null;
  }

  public get modalRef(): any {
    return this._modalRef;
  }

  private _closeWithResult(result?: any) {
    if (this._closed$) {
      if (typeof result !== 'undefined') {
        this._closed$.next(result);
      } else {
        // just emit true when canceling or for any other reason
        this._closed$.next(true);
      }
      if (this._closed$.observers && this._closed$.observers.length) {
        // ensure cleanup
        this._closed$.unsubscribe();
      }
    }
  }
}
