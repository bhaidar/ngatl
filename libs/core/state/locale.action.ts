import { Action } from '@ngrx/store';
import { LocaleState } from './locale.state';

export namespace LocaleActions {
  export enum Types {
    INIT = '[@ngatl/locale] Init',
    SET = '[@ngatl/locale] Set',
    SET_SUCCESS = '[@ngatl/locale] Set Success'
  }

  export class InitAction implements Action {
    type: string = Types.INIT;
    payload: string = null;
  }

  export class SetAction implements Action {
    type: string = Types.SET;

    constructor(public payload: LocaleState.Locale) {}
  }

  export class SetSuccessAction implements Action {
    type: string = Types.SET_SUCCESS;

    constructor(public payload: LocaleState.Locale) {}
  }

  export type Actions = InitAction | SetAction | SetSuccessAction;
}
