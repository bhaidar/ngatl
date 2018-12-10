// angular
import { Injectable } from '@angular/core';

// libs
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, startWith } from 'rxjs/operators';

// app
import { LoggerService } from '@ngatl/api';
import { AppActions, WindowService } from '@ngatl/core';
import { SpeakerService } from '../services/speaker.service';
import { SpeakerActions } from '../actions/speaker.action';
import { SpeakerState } from '../states';

@Injectable()
export class SpeakerEffects {

  @Effect()
  fetch$ = this.actions$
    .ofType(SpeakerActions.ActionTypes.FETCH)
    .pipe(
    switchMap((action:SpeakerActions.FetchAction) => this.speakerService.fetch(action.payload)),
    map(value => {
      // this.log.debug('fetched speakers result:', value);
      // this.log.info(JSON.stringify(value));

      return new SpeakerActions.ChangedAction({
        list: <Array<SpeakerState.ISpeaker>>value
      });
    }),
    catchError(err => of(new SpeakerActions.ApiErrorAction(err))));

  @Effect()
  select$ = this.actions$
    .ofType(SpeakerActions.ActionTypes.SELECT)
    .pipe(
    switchMap((action: SpeakerActions.SelectAction) => this.speakerService.loadDetail(action.payload)),
    map(result => {
      this.log.info('speaker select result:', result);
      return new SpeakerActions.ChangedAction({
        selected: result
      });
    }),
    catchError(err => of(new SpeakerActions.ApiErrorAction(err))));

  @Effect()
  apiError$ = this.actions$
    .ofType(SpeakerActions.ActionTypes.API_ERROR)
    .pipe(
    withLatestFrom(this.store),
    map(([action, state]: [SpeakerActions.ApiErrorAction, any]) => {
      //this.win.alert(action.payload);
      return new SpeakerActions.ChangedAction({
        errors: [action.payload, ...(state.errors || [])]
      });
    }));

  @Effect()
  init$ = this.actions$
    .ofType(SpeakerActions.ActionTypes.INIT)
    .pipe(
      startWith(new SpeakerActions.InitAction()),
    map(action => new SpeakerActions.FetchAction()));

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private log: LoggerService,
    private speakerService: SpeakerService,
    private win: WindowService
  ) {}
}
