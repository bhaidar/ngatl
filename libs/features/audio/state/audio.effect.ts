// angular
import { Injectable } from '@angular/core';
// libs
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';
// app
import { ICoreState, LogService } from '@ngatl/core';
import { AudioService } from '../services/audio.service';
import { AudioActions } from './audio.action';
import { AudioState } from './audio.state';

@Injectable()
export class AudioEffects {
  @Effect()
  togglePlay$: Observable<Action> = this._actions$.pipe(
    ofType(AudioActions.Types.TOGGLE_PLAY),
    withLatestFrom(this.store),
    map(
      ([action, state]: [
        AudioActions.TogglePlayAction,
        AudioState.IFeatureState
      ]) => {
        const force = action.payload.forcePlayingState;
        return new AudioActions.ChangedAction({
          url: action.payload.url,
          playing: typeof force === 'undefined' ? !state.audio.playing : force
        });
      }
    )
  );

  @Effect()
  play$: Observable<Action> = this._actions$.pipe(
    ofType(AudioActions.Types.PLAY),
    map((action: AudioActions.PlayAction) => {
      return new AudioActions.ChangedAction({
        url: action.payload,
        playing: true
      });
    })
  );

  @Effect()
  stop$: Observable<Action> = this._actions$.pipe(
    ofType(AudioActions.Types.STOP),
    map((action: AudioActions.StopAction) => {
      return new AudioActions.ChangedAction({
        playing: false
      });
    })
  );

  @Effect()
  cleanup$: Observable<Action> = this._actions$.pipe(
    ofType(AudioActions.Types.CLEANUP),
    map((action: AudioActions.CleanupAction) => {
      this.audioService.cleanup$.next(true);
      return new AudioActions.ChangedAction({
        url: null,
        playing: false
      });
    })
  );

  constructor(
    private store: Store<any>,
    private _log: LogService,
    private _actions$: Actions,
    private audioService: AudioService
  ) {}
}
