// angular
import { Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
// libs
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isNativeScript, isObject } from '@ngatl/utils';
import { Observable, of } from 'rxjs';
import { map, startWith, tap, mergeMap, filter } from 'rxjs/operators';
// module
import { LocaleService } from '../services/locale.service';
import { LogService } from '../services/log.service';
import { ModalService } from '../services/modal.service';
import { ProgressService } from '../services/progress.service';
import { PlatformRouterToken } from '../services/tokens';
import { WindowService } from '../services/window.service';
import { ICoreState } from './core.state';
import { LocaleActions } from './locale.action';
import { ModalActions } from './modal.action';
import { ProgressIndicatorActions } from './progress-indicator.action';
import { RouterActions } from './router.action';
import { UIActions } from './ui.action';

@Injectable()
export class UIEffects {
  @Effect()
  localeSet$ = this._actions$.pipe(
    ofType(LocaleActions.Types.SET),
    map((action: LocaleActions.SetAction) => {
      this._localeService.locale = action.payload;
      this._translateService.use(action.payload);
      return new LocaleActions.SetSuccessAction(action.payload);
    })
  );

  @Effect()
  localeSetSuccess$ = this._actions$.pipe(
    ofType(LocaleActions.Types.SET_SUCCESS),
    map((action: LocaleActions.SetSuccessAction) => {
      return new UIActions.ChangedAction({
        locale: action.payload
      });
    })
  );

  @Effect()
  modalOpen$: Observable<Action> = this._actions$.pipe(
    ofType(ModalActions.Types.OPEN),
    map((action: ModalActions.OpenAction) => {
      const details = this._modal.open(action.payload);
      return new ModalActions.OpenedAction({
        open: true,
        cmpType: details.cmpType,
        title: details.trackTitle,
        latestResult: null // reset when opening
      });
    })
  );

  @Effect()
  modalOpened$: Observable<Action> = this._actions$.pipe(
    ofType(ModalActions.Types.OPENED),
    map(
      (action: ModalActions.OpenedAction) =>
        new UIActions.ChangedAction({
          modal: action.payload
        })
    )
  );

  @Effect()
  modalClose$: Observable<Action> = this._actions$.pipe(
    ofType(ModalActions.Types.CLOSE),
    mergeMap((action: ModalActions.CloseAction) => {
      this._modal.close(action.payload);
      return this._modal.closed$.pipe(
        filter(value => typeof value === 'undefined' || value)
      );
    }),
    map(value => {
      // reset
      this._modal.closed$.next(false);
      return new ModalActions.ClosedAction({
        open: false,
        cmpType: null,
        title: null,
        // keep null values to be consistent (instead of undefined)
        latestResult: typeof value === 'undefined' ? null : value
      });
    })
  );

  @Effect()
  modalClosed$: Observable<Action> = this._actions$.pipe(
    ofType(ModalActions.Types.CLOSED),
    map(
      (action: ModalActions.ClosedAction) =>
        new UIActions.ChangedAction({
          modal: action.payload
        })
    )
  );

  @Effect()
  progressShow$: Observable<Action> = this._actions$.pipe(
    ofType(ProgressIndicatorActions.Types.SHOW),
    map((action: ProgressIndicatorActions.ShowAction) => {
      let payload = action.payload;
      if (!action.payload) {
        // if no payload, default to showing page level progress loader
        payload = {
          page: {
            enabled: true
          }
        };
      }
      return new UIActions.ChangedAction({
        progressIndicator: payload
      });
    })
  );

  @Effect()
  progressHide$: Observable<Action> = this._actions$.pipe(
    ofType(ProgressIndicatorActions.Types.HIDE),
    map((action: ProgressIndicatorActions.HideAction) => {
      // .map((action: ProgressIndicatorActions.HideAction) => {
      let payload = action.payload;
      if (!action.payload) {
        // if no payload, default to hiding page level progress loader
        payload = {
          page: {
            enabled: false
          }
        };
      }
      return new UIActions.ChangedAction({
        progressIndicator: payload
      });
    })
  );

  @Effect({ dispatch: false })
  navigate$ = this._actions$.pipe(
    ofType(RouterActions.Types.GO),
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, extras }) => {
      if (!this._router) {
        // on web we just rely on injecting @angular/router
        // avoids having to create a factory to create it in core.module
        // on mobile, this will be defined as RouterExtensions
        this._router = this._ngRouter;
      }
      if (LogService.DEBUG.LEVEL_4) {
        this._log.debug(`${RouterActions.Types.GO} from: `, this._ngRouter.url);
        this._log.debug(
          `${RouterActions.Types.GO} to: `,
          isObject(path) ? JSON.stringify(path) : path
        );
      }
      extras = extras ? { ...extras } : undefined; // must be explicitly undefined (angular issue)
      this._router.navigate(path, extras);
    })
  );

  @Effect({ dispatch: false })
  navigateBack$ = this._actions$.pipe(
    ofType(RouterActions.Types.BACK),
    tap(() => this._location.back())
  );

  @Effect({ dispatch: false })
  navigateForward$ = this._actions$.pipe(
    ofType(RouterActions.Types.FORWARD),
    tap(() => this._location.forward())
  );

  // Any startWith observables - Should always BE LAST!
  @Effect()
  localeInit$ = this._actions$.pipe(
    ofType(LocaleActions.Types.INIT),
    startWith(new LocaleActions.InitAction()),
    map((action: LocaleActions.InitAction) => {
      // We don't want to set a default language since it pulls the extra data,
      // but leaving this here to document that and show where we would if anyone searches
      // this._translateService.setDefaultLang('en');
      return new LocaleActions.SetAction(this._localeService.locale);
    })
  );

  private _isNativeScript = false;

  constructor(
    private _store: Store<ICoreState>,
    private _actions$: Actions,
    private _modal: ModalService,
    private _log: LogService,
    private _win: WindowService,
    private _localeService: LocaleService,
    private _translateService: TranslateService,
    // instantiates service automatically
    // even though not used this helps ensure single instance is created on boot
    private _progress: ProgressService,
    @Inject(PlatformRouterToken)
    private _router: any,
    private _ngRouter: Router,
    private _location: Location
  ) {
    this._isNativeScript = isNativeScript();
  }
}
