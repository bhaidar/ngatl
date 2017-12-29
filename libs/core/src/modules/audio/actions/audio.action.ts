import { Action } from '@ngrx/store';
// app
import { type } from '../../helpers';
import { AudioState } from '../states';

export namespace AudioActions {
  const CATEGORY: string = 'Audio';

  export interface IActions {
    TOGGLE_PLAY: string;
    PLAY: string;
    STOP: string;
    CLEANUP: string;
    CHANGED: string;
  }

  export const ActionTypes: IActions = {
    TOGGLE_PLAY : type(`${CATEGORY} Toggle play`),
    PLAY : type(`${CATEGORY} Play`),
    STOP : type(`${CATEGORY} Stop`),
    CLEANUP : type(`${CATEGORY} Cleanup`),
    CHANGED : type(`${CATEGORY} Changed`),
  };

  export interface ITogglePlayOptions {
    url: string;
    forcePlayingState?: boolean;
  }

  export class TogglePlayAction implements Action {
    type = ActionTypes.TOGGLE_PLAY;

    constructor(public payload: ITogglePlayOptions) {}
  }

  export class PlayAction implements Action {
    type = ActionTypes.PLAY;

    constructor(public payload: string,
                /* url */) {}
  }

  export class StopAction implements Action {
    type = ActionTypes.STOP;
    payload: never;
  }

  export class CleanupAction implements Action {
    type = ActionTypes.CLEANUP;
    payload: never;
  }

  export class ChangedAction implements Action {
    type = ActionTypes.CHANGED;

    constructor(public payload: AudioState.IState) {}
  }

  export type Actions = TogglePlayAction | PlayAction | StopAction | CleanupAction | ChangedAction;
}
