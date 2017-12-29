// angular
import { Injectable } from '@angular/core';
// libs
import {
  Store,
  Action,
} from '@ngrx/store';
import {
  Effect,
  Actions,
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
// app
import { LogService } from '../../core/services/log.service';
import { AudioActions } from '../actions';
import { AudioService } from '../services/audio.service';
import { IAppState } from '../../ngrx';

@Injectable()
export class AudioEffects {
  @Effect()
  togglePlay$: Observable<Action> =
    this._actions$
        .ofType(AudioActions.ActionTypes.TOGGLE_PLAY)
        .withLatestFrom(this.store)
        .map(([action, state]: [AudioActions.TogglePlayAction, IAppState]) => {
          const force = action.payload.forcePlayingState;
          return new AudioActions.ChangedAction({
            url : action.payload.url,
            playing : typeof force === 'undefined' ? !state.audio.playing : force,
          });
        });

  @Effect()
  play$: Observable<Action> =
    this._actions$
        .ofType(AudioActions.ActionTypes.PLAY)
        .map((action: AudioActions.PlayAction) => {
          return new AudioActions.ChangedAction({
            url : action.payload,
            playing : true,
          });
        });

  @Effect()
  stop$: Observable<Action> =
    this._actions$
        .ofType(AudioActions.ActionTypes.STOP)
        .map((action: AudioActions.StopAction) => {
          return new AudioActions.ChangedAction({
            playing : false,
          });
        });

  @Effect()
  cleanup$: Observable<Action> =
    this._actions$
        .ofType(AudioActions.ActionTypes.CLEANUP)
        .map((action: AudioActions.CleanupAction) => {
          this.audioService.cleanup();
          return new AudioActions.ChangedAction({
            url : null,
            playing : false,
          });
        });

  constructor(
    private store: Store<IAppState>,
    private log: LogService,
    private _actions$: Actions,
    private audioService: AudioService,
  ) {}
}
