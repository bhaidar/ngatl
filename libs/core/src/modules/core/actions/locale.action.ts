import { Action } from '@ngrx/store';
import { type } from '../../helpers';
import { LocaleState } from '../states';

export namespace LocaleActions {
  const CATEGORY: string = 'Locale';

  export interface IActions {
    INIT: string;
    SET: string;
    SET_SUCCESS: string;
  }

  export const ActionTypes: IActions = {
    INIT : type(`${CATEGORY} Init`),
    SET : type(`${CATEGORY} Set`),
    SET_SUCCESS : type(`${CATEGORY} Set Success`),
  };

  export class InitAction implements Action {
    type: string = ActionTypes.INIT;
    payload: string = null;
  }

  export class SetAction implements Action {
    type: string = ActionTypes.SET;

    constructor(public payload: LocaleState.Locale) {}
  }

  export class SetSuccessAction implements Action {
    type: string = ActionTypes.SET_SUCCESS;

    constructor(public payload: LocaleState.Locale) {}
  }

  export type Actions = InitAction | SetAction | SetSuccessAction;
}
