import {
  Injectable,
  NgZone,
} from '@angular/core';

import { Store } from '@ngrx/store';
// app
import { IAppState } from '../../ngrx';
import { ProgressIndicatorActions } from '../actions';
import { WindowService } from './window.service';
import {
  UIState,
  ProgressIndicatorState,
} from '../states';

export interface IPlatformLoaderService {
  show(options?: any): void;

  hide(options?: any): void;
}

/**
 * Platform agnostic loader
 * Provide in web and mobile specific implementations
 */
@Injectable()
export class PlatformLoaderService implements IPlatformLoaderService {
  // overidden and implemented by platforms
  public show(options?: any) {}

  public hide(options?: any) {}
}

/**
 * Reactive progress indicator
 */
@Injectable()
export class ProgressService {
  // default options
  private _defaultOptions: any = {};
  // internal state, helps avoid extraneous action dispatch
  private _enabled = false;

  /**
   * Prevent infinite spinning loaders.
   * Since LoadingIndicator is app ui blocking
   * this uses a timeout to ensure the app is never blocked
   */
    // timeout tracker
  private _infiniteTimeout: number;
  // default number of seconds to wait til notifying of infinite spinner
  private _defaultNoticeDelay: number = 8;
  // allow case by case control
  private _infiniteNoticeDelay: number;
  // default notice message
  private _defaultInfiniteMessage: string;
  // allow notice message customizations
  private _infiniteMessage: string;
  // enable/disable
  private _infinitePreventionOn: boolean = true;

  constructor(
    private _store: Store<IAppState>,
    private _win: WindowService,
    private _ngZone: NgZone,
    private _loader: PlatformLoaderService,
  ) {
    // use default delay to start
    this._infiniteNoticeDelay = this._defaultNoticeDelay;
    // set default message
    this._defaultInfiniteMessage = `The action was taking longer than ${this
      ._infiniteNoticeDelay} seconds. You might try again later.`;
    this._infiniteMessage = this._defaultInfiniteMessage;

    _store.select((s: IAppState) => s.ui).subscribe((state: UIState.IState) => {
      if ( state && state.progressIndicator && state.progressIndicator.page ) {
        if ( state.progressIndicator.page.enabled ) {
          // provide a message or even progress
          const extendedOptions: any = {};
          if ( state.progressIndicator.page.message ) {
            extendedOptions.message = state.progressIndicator.page.message;
          }
          if ( typeof state.progressIndicator.page.progress !== 'undefined' ) {
            extendedOptions.progress = state.progressIndicator.page.progress;
          }
          const options = Object.assign({}, this._defaultOptions, extendedOptions);

          // iOS customizations
          options.ios = {
            dimBackground: true,
            hideBezel: true,
            color: '#fff'
          };

          this._loader.show(options);

          if ( this._infinitePreventionOn ) {
            // Prevent infinite spinning loaders
            this._startInfinitePrevention();
          }
        } else {
          // Reset infinite prevention
          this._resetInfinitePrevention();

          this._loader.hide();
        }
      }
    });
  }

  /**
   * Components/Services can inject this service and tweak if needed
   * For example: There might be an action that is expected to take longer
   * therefore can adjust this to larger.
   */
  public set infiniteNoticeDelay(value: number,
                                 /* seconds til showing infinite notice */) {
    this._infiniteNoticeDelay = value;
  }

  public get infiniteNoticeDelay() {
    return this._infiniteNoticeDelay;
  }

  /**
   * Reset infinite defaults (delay and message)
   * If other services/components customize they can reset easily with this.
   */
  public resetInfiniteDefault() {
    this._infiniteNoticeDelay = this._defaultNoticeDelay;
    this._infiniteMessage = this._defaultInfiniteMessage;
  }

  /**
   * Customize infinite message.
   * Set to null to never show a message.
   */
  public set infiniteMessage(message: string,
                             /* custom message */) {
    this._infiniteMessage = message;
  }

  public get infiniteMessage() {
    return this._infiniteMessage;
  }

  /**
   * Enable/disable infinite prevention
   */
  public set infinitePreventionOn(enable: boolean) {
    this._infinitePreventionOn = enable;
  }

  public get infinitePreventionOn() {
    return this._infinitePreventionOn;
  }

  /**
   * Convenient way to check if currently enabled
   */
  public get isEnabled() {
    return this._enabled;
  }

  /**
   * Used to easily toggle the page blocking spinner
   * @param enable boolean turn spinner on
   * @param details { message?: string; progress?: number } Optioanl message or progress total
   */
  public toggleSpinner(
    enable?: boolean,
    details?: { message?: string; progress?: number },
  ) {
    let action = null;
    if ( enable ) {
      if ( this._enabled ) {
        // already enabled
        let needsUpdate = false;
        if ( details ) {
          // check if details are different from current state, only if different should update be allowed
          this._store.select((s: IAppState) => s.ui)
              .take(1)
              .subscribe((state: UIState.IState) => {
                if ( state && state.progressIndicator && state.progressIndicator.page ) {
                  if ( state.progressIndicator.page.enabled ) {
                    if ( details.message !== state.progressIndicator.page.message || details.progress !== state.progressIndicator.page.progress ) {
                      needsUpdate = true;
                    }
                  }
                }
              });

        }
        if ( !needsUpdate ) {
          // doesn't need updates just exit
          return;
        }
      }
      this._enabled = true;

      let options: ProgressIndicatorState.IState = null;
      if ( details ) {
        const page: ProgressIndicatorState.IProgress = {
          enabled : true,
        };
        if ( details.message ) {
          page.message = details.message;
        }
        if ( details.progress ) {
          page.progress = details.progress;
        }
        options = { page };
      }
      action = new ProgressIndicatorActions.ShowAction(options);
    } else {
      if ( !this._enabled ) {
        // already disabled
        return;
      }
      this._enabled = false;
      action = new ProgressIndicatorActions.HideAction();
    }

    this._ngZone.run(() => {
      // to be safe, ensure run in zone (this helps on mobile/{N} in particular)
      // sometimes 3rd party plugins leave Angular's zone
      // this helps ensure changes are picked up from the state change
      // spinner is critical as to not block the app forever with a spinner (wrapped here for safety)
      this._store.dispatch(action);
    });
  }

  // internal
  private _startInfinitePrevention() {
    this._resetInfinitePrevention();
    this._infiniteTimeout = this._win.setTimeout(() => {
      this._resetInfinitePrevention();
      // hide infinite spinner
      this.toggleSpinner();
      // show message
      // TODO: Reenable later
      // Disabling for now since we need to evalutate average response times
      // if (this._infiniteMessage) {
      //     timer.setTimeout(() => {
      //         // give spinner time to disappear
      //         this._win.alert(<any>{ message: this._infiniteMessage, title: 'Notice', okButtonText: 'Ok' });
      //     }, 500);
      // }
    }, this._infiniteNoticeDelay * 1000);
  }

  private _resetInfinitePrevention() {
    if ( typeof this._infiniteTimeout !== 'undefined' ) {
      this._win.clearTimeout(this._infiniteTimeout);
      this._infiniteTimeout = undefined;
    }
  }
}
