import { Action } from '@ngrx/store';
import { SpeakerState } from '../states/speaker.state';

export namespace SpeakerActions {

  export interface IActions {
    INIT: string;
    FETCH: string;
    SELECT: string;
    API_ERROR: string;
    CHANGED: string;
  }

  export const ActionTypes: IActions = {
    INIT: `[@ngatl/speaker] Init`,
    FETCH: `[@ngatl/speaker] Fetch`,
    SELECT: `[@ngatl/speaker] Select`,
    API_ERROR: `[@ngatl/speaker] Api Error`,
    CHANGED: `[@ngatl/speaker] Changed`
  };

  export class InitAction implements Action {
    type = ActionTypes.INIT;
    payload = null;
  }

  export class FetchAction implements Action {
    type = ActionTypes.FETCH;
    constructor(public payload?: boolean /* force refresh */) {}
  }

  export class SelectAction implements Action {
    type = ActionTypes.SELECT;
    constructor(public payload?: any /* speaker id */) {}
  }

  export class ApiErrorAction implements Action {
    type = ActionTypes.API_ERROR;
    constructor(public payload?: any) {}
  }

  export class ChangedAction implements Action {
    type = ActionTypes.CHANGED;
    constructor(public payload?: SpeakerState.IState) {}
  }

  export type Actions = InitAction | FetchAction | ApiErrorAction | ChangedAction;
}
