// angular
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
// libs
import { Store } from '@ngrx/store';
import { isObject } from '@ngatl/utils';
import { Subject, fromEvent, BehaviorSubject } from 'rxjs';
import { filter, takeUntil, throttleTime } from 'rxjs/operators';
import { ICoreState } from '../state/core.state';
// module
import { ModalActions } from '../state/modal.action';
import { ModalState } from '../state/modal.state';
// app
import { LogService } from './log.service';
import { WindowService } from './window.service';

// open return value type
export interface IOpenReturn {
  cmpType: any;
  trackTitle?: string;
}

// used for special workaround for web ng-bootstrap in close method
declare var $;

@Injectable()
export class ModalPlatformService {
  public open(componentType: any, options?: any) {}
}

@Injectable()
export class ModalService {
  public modalForceAction: boolean;

  private _modalRef: any;
  private _routed: boolean;
  // convenient for easy access to when a modal closes along with it's result
  private _closed$: BehaviorSubject<any> = new BehaviorSubject(false);

  // these apply for the web
  private _defaultOptions: any = {
    backdrop: 'static',
    keyboard: true
  };

  constructor(
    private _store: Store<ICoreState>,
    private _platformModalService: ModalPlatformService,
    private _router: Router,
    private _log: LogService,
    private _win: WindowService,
    @Inject(DOCUMENT) private _document
  ) {}

  public get closed$() {
    return this._closed$;
  }

  public open(options: ModalState.IOptions): IOpenReturn {
    const details: IOpenReturn = {
      cmpType: options.cmpType
    };

    if (!options.modalOptions) {
      options.modalOptions = this._defaultOptions;
    }

    // open modal using platform specific modal service
    this._modalRef =
      typeof options.cmpType !== 'string'
        ? this._platformModalService.open(options.cmpType, options.modalOptions)
        : null;

    if (options.props) {
      // web can copy props onto passed in modal instances
      for (const key in options.props) {
        if (key === 'trackTitle') {
          details.trackTitle = options.props[key];
        } else if (this._modalRef && this._modalRef.componentInstance) {
          this._modalRef.componentInstance[key] = options.props[key];
        }
      }
    }
    if (this._modalRef) {
      if (this._modalRef.result) {
        // likely ng-bootstrap (web)
        if (typeof $ !== 'undefined') {
          const modalWindows = $('ngb-modal-window');
          if (modalWindows && modalWindows.length) {
            fromEvent(modalWindows, 'scroll')
              .pipe(
                takeUntil(
                  this._closed$.pipe(
                    filter(value => typeof value === 'undefined' || value)
                  )
                ),
                throttleTime(500)
              )
              .subscribe(x => {
                const a = this._document.activeElement;
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
          },
          (reason: any) => {
            this._closeWithResult();
            this._log.debug('Modal closed reason:', reason);
          }
        );
      } else if (this._modalRef.then) {
        // like {N} (mobile)
        this._modalRef.then(
          result => {
            this._closeWithResult(result);
            this._log.debug('Native modal closed with:', result);
          },
          err => {
            this._log.debug('Native modal error:', err);
          }
        );
      }
    }
    return details;
  }

  public close(latestResult?: any | { params: any; value?: any }) {
    if (this._modalRef) {
      if (this._modalRef.close) {
        const backdropSelector = 'ngb-modal-backdrop';
        let modalBackdrops;
        let totalModals = 0;
        if (typeof $ !== 'undefined') {
          modalBackdrops = $(backdropSelector);
          // on web since multiple modals can be opened on top of each other
          // there's a case when closing them will not remove the underlying modals
          if (modalBackdrops) {
            totalModals = modalBackdrops.length;
          }
        }

        // web ng-bootstrap
        try {
          this._modalRef.close(latestResult);
        } catch (err) {
          // ignore, in future we may manually remove from dom
        }

        if (typeof $ !== 'undefined') {
          // ensure they are removed from DOM
          // this is probably a bug in ng-bootstrap but doing this will not hurt here for safety
          modalBackdrops = $(backdropSelector); // get latest
          if (modalBackdrops.length === totalModals) {
            // the _modalRef.close class above did not close any
            // manually remove multiple stacked modals in a row
            const modalWindows = $('ngb-modal-window');
            // these should be ultimately 0 after closed - if not remove top one (most recent one)
            if (modalBackdrops && modalBackdrops.length) {
              modalBackdrops[modalBackdrops.length - 1].remove();
            }
            if (modalWindows && modalWindows.length) {
              modalWindows[modalWindows.length - 1].remove();
            }
            $('body').removeClass('modal-open');
          }
          // else if (modalBackdrops.length === 0) {
          //   // no more modals, ensure modal-open class is removed
          // }
        }
        return latestResult;
      } else if (this._modalRef.then) {
        // {N} ModalDialogService
        if (isObject(latestResult) && latestResult.params) {
          // {N} modal
          if (latestResult.params.closeCallback) {
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
      if (result) {
        this._closed$.next(result);
      } else {
        // just emit explitly undefined since there's no value
        // we use valid value or undefined to determine if closed$ should actually fire/complete
        // see ui.effect modalClose
        this._closed$.next(undefined);
      }
    }
  }
}
