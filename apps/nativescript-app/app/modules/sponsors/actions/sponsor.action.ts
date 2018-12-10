import { Action } from '@ngrx/store';
import { SponsorState } from '../states/sponsor.state';

export namespace SponsorActions {

  export interface IActions {
    INIT: string;
    FETCH: string;
    SELECT: string;
    API_ERROR: string;
    CHANGED: string;
  }

  export const ActionTypes: IActions = {
    INIT: `[@ngatl/sponsor] Init`,
    FETCH: `[@ngatl/sponsor] Fetch`,
    SELECT: `[@ngatl/sponsor] Select`,
    API_ERROR: `[@ngatl/sponsor] Api Error`,
    CHANGED: `[@ngatl/sponsor] Changed`
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
    constructor(public payload?: any /* sponsor id */) {}
  }

  export class ApiErrorAction implements Action {
    type = ActionTypes.API_ERROR;
    constructor(public payload?: any) {}
  }

  export class ChangedAction implements Action {
    type = ActionTypes.CHANGED;
    constructor(public payload?: SponsorState.IState) {}
  }

  export type Actions = InitAction | FetchAction | ChangedAction;
}
