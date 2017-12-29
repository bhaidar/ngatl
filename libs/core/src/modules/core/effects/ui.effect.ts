// angular
import { Injectable } from '@angular/core';
// libs
import {
  Action,
  Store,
} from '@ngrx/store';
import {
  Actions,
  Effect,
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
// module
import { AnalyticsService } from '../../analytics/services/analytics.service';
import { Tracking } from '../../helpers';
import { ModalService } from '../services/modal.service';
import { ProgressService } from '../services/progress.service';
import {
  LocaleActions,
  ModalActions,
  ProgressIndicatorActions,
  UIActions,
} from '../actions';
import { LocaleService } from '../services/locale.service';
import { NetworkCommonService } from '../services/network.service';
import { IAppState } from '../../ngrx';

@Injectable()
export class UIEffects {
  @Effect()
  localeSet$ =
    this._actions$
        .ofType(LocaleActions.ActionTypes.SET)
        .map((action: LocaleActions.SetAction) => {
      this._localeService.locale = action.payload;
      this._translateService.use(action.payload);
      return new LocaleActions.SetSuccessAction(action.payload);
    });

  @Effect()
  localeSetSuccess$ =
    this._actions$
        .ofType(LocaleActions.ActionTypes.SET_SUCCESS)
        .map((action: LocaleActions.SetSuccessAction) => {
          return new UIActions.ChangedAction({
            locale : action.payload,
          });
        });

  @Effect()
  modalOpen$: Observable<Action> =
    this._actions$
        .ofType(ModalActions.ActionTypes.OPEN)
        .map((action: ModalActions.OpenAction) => {
          const details = this._modal.open(action.payload);
          // this.analytics.track(Tracking.Actions.DIALOG_OPEN, {
          //   category : Tracking.Categories.DIALOGS,
          //   dialog_name : details.trackTitle || '' // ensure empty string and not null
          // });
          return new ModalActions.OpenedAction({
            open : true,
            cmpType : details.cmpType,
            title : details.trackTitle,
            latestResult : null // reset when opening
          });
        });

  @Effect()
  modalOpened$: Observable<Action> =
    this._actions$.ofType(ModalActions.ActionTypes.OPENED).map(
      (action: ModalActions.OpenedAction) =>
        new UIActions.ChangedAction({
          modal : action.payload,
        }),
    );

  @Effect()
  modalClose$: Observable<Action> =
    this._actions$
        .ofType(ModalActions.ActionTypes.CLOSE)
        .map((action: ModalActions.CloseAction) => {
          const closeResult = this._modal.close(action.payload);
          return new ModalActions.ClosedAction({
            open : false,
            cmpType : null,
            title : null,
            // keep null values to be consistent (instead of undefined)
            latestResult : typeof closeResult === 'undefined' ? null : closeResult,
          });
        });

  @Effect()
  modalClosed$: Observable<Action> =
    this._actions$.ofType(ModalActions.ActionTypes.CLOSED).map(
      (action: ModalActions.ClosedAction) =>
        new UIActions.ChangedAction({
          modal : action.payload,
        }),
    );

  @Effect()
  progressShow$: Observable<Action> =
    this._actions$
        .ofType(ProgressIndicatorActions.ActionTypes.SHOW)
        .map((action: ProgressIndicatorActions.ShowAction) => {
          let payload = action.payload;
          if ( !action.payload ) {
            // if no payload, default to showing page level progress loader
            payload = {
              page : {
                enabled : true,
              },
            };
          }
          return new UIActions.ChangedAction({
            progressIndicator : payload,
          });
        });

  @Effect()
  progressHide$: Observable<Action> =
    this._actions$
        .ofType(ProgressIndicatorActions.ActionTypes.HIDE)
        .map((action: ProgressIndicatorActions.HideAction) => {
          // .map((action: ProgressIndicatorActions.HideAction) => {
          let payload = action.payload;
          if ( !action.payload ) {
            // if no payload, default to hiding page level progress loader
            payload = {
              page : {
                enabled : false,
              },
            };
          }
          return new UIActions.ChangedAction({
            progressIndicator : payload,
          });
        });

  // Any startWith observables - Should always BE LAST!
  @Effect()
  localeInit$ =
    this._actions$
        .ofType(LocaleActions.ActionTypes.INIT)
        .startWith(new LocaleActions.InitAction())
        .map((action: LocaleActions.InitAction) => {
          this._translateService.setDefaultLang('en');
          return new LocaleActions.SetAction(this._localeService.locale);
        });

  constructor(
    public analytics: AnalyticsService,
    private _store: Store<IAppState>,
    private _actions$: Actions,
    private _modal: ModalService,
    private _localeService: LocaleService,
    private _translateService: TranslateService,
    // instantiates service automatically
    // even though not used this helps ensure single instance is created on boot
    private _progress: ProgressService,
    private _network: NetworkCommonService,
  ) {}
}
