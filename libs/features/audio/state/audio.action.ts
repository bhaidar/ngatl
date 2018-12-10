import { Action } from '@ngrx/store';
// app
import { AudioState } from './audio.state';

export namespace AudioActions {
  export enum Types {
    TOGGLE_PLAY = '[@ngatl/audio] Toggle play',
    PLAY = '[@ngatl/audio] Play',
    STOP = '[@ngatl/catalog] Stop',
    CLEANUP = '[@ngatl/audio] Cleanup',
    CHANGED = '[@ngatl/audio] Changed'
  }

  export interface ITogglePlayOptions {
    url: string;
    forcePlayingState?: boolean;
  }

  export class TogglePlayAction implements Action {
    type = Types.TOGGLE_PLAY;

    constructor(public payload: ITogglePlayOptions) {}
  }

  export class PlayAction implements Action {
    type = Types.PLAY;

    constructor(public payload: string) /* url */ {}
  }

  export class StopAction implements Action {
    type = Types.STOP;
    payload: never;
  }

  export class CleanupAction implements Action {
    type = Types.CLEANUP;
    payload: never;
  }

  export class ChangedAction implements Action {
    type = Types.CHANGED;

    constructor(public payload: AudioState.IState) {}
  }

  export type Actions =
    | TogglePlayAction
    | PlayAction
    | StopAction
    | CleanupAction
    | ChangedAction;
}
