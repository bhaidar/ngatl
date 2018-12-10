import { Action } from '@ngrx/store';
import { EventState } from '../states/event.state';

export namespace EventActions {

  export interface IActions {
    INIT: string;
    FETCH: string;
    SELECT: string;
    API_ERROR: string;
    CHANGED: string;
  }

  export const ActionTypes: IActions = {
    INIT: `[@ngatl/event] Init`,
    FETCH: `[@ngatl/event] Fetch`,
    SELECT: `[@ngatl/event] Select`,
    API_ERROR: `[@ngatl/event] Api Error`,
    CHANGED: `[@ngatl/event] Changed`
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
    constructor(public payload?: any /* event id */) {}
  }

  export class ApiErrorAction implements Action {
    type = ActionTypes.API_ERROR;
    constructor(public payload?: any) {}
  }

  export class ChangedAction implements Action {
    type = ActionTypes.CHANGED;
    constructor(public payload?: EventState.IState) {}
  }

  export type Actions = InitAction | FetchAction | ApiErrorAction | ChangedAction;
}
