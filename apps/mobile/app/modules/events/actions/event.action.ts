import { Action } from '@ngrx/store';
import { type } from '@ngatl/core';
import { EventState } from '../states/event.state';

export namespace EventActions {
  const CATEGORY: string = 'Events';

  export interface IActions {
    INIT: string;
    FETCH: string;
    SELECT: string;
    API_ERROR: string;
    CHANGED: string;
  }

  export const ActionTypes: IActions = {
    INIT: type(`${CATEGORY} Init`),
    FETCH: type(`${CATEGORY} Fetch`),
    SELECT: type(`${CATEGORY} Select`),
    API_ERROR: type(`${CATEGORY} Api Error`),
    CHANGED: type(`${CATEGORY} Changed`)
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
