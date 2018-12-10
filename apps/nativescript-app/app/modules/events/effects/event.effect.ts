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
import { EventService } from '../services/event.service';
import { EventActions } from '../actions/event.action';
import { EventState } from '../states/event.state';
import { Session } from '../models/conference.model';

@Injectable()
export class EventEffects {

  @Effect()
  fetch$ = this.actions$
    .ofType(EventActions.ActionTypes.FETCH)
    .pipe(
    switchMap((action: EventActions.FetchAction) => this.eventService.fetch(action.payload)),
    map((value: Array<Session>) => {
      // console.log('fetched events result:', value);
      // console.log(JSON.stringify(value));

      return new EventActions.ChangedAction({
        list: value
      });
    }),
    catchError(err => of(new EventActions.ApiErrorAction())));

  // @Effect()
  // select$ = this.actions$
  //   .ofType(EventActions.ActionTypes.SELECT)
  //   .switchMap((action: EventActions.SelectAction) => this.eventService.loadDetail(action.payload))
  //   .map(result => {
  //     this.log.info(EventActions.ActionTypes.SELECT);
  //     return new EventActions.ChangedAction({
  //       selected: result
  //     });
  //   });

  @Effect()
  apiError$ = this.actions$
    .ofType(EventActions.ActionTypes.API_ERROR)
    .pipe(
      withLatestFrom(this.store),
      map(([action, state]: [EventActions.ApiErrorAction, any]) => {
      //this.win.alert(action.payload);
      return new EventActions.ChangedAction({
        errors: [action.payload, ...(state.errors || [])]
      });
    }));

  @Effect()
  init$ = this.actions$
    .ofType(EventActions.ActionTypes.INIT)
    .pipe(
      startWith(new EventActions.InitAction()),
      map(action => new EventActions.FetchAction()));

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private log: LoggerService,
    private eventService: EventService,
    private win: WindowService
  ) {}
}
