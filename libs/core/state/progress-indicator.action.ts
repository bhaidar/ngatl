import { Action } from '@ngrx/store';
import { ProgressIndicatorState } from './progress-indicator.state';

export namespace ProgressIndicatorActions {
  export enum Types {
    SHOW = '[@ngatl/progressIndicator] Show',
    HIDE = '[@ngatl/progressIndicator] Hide'
  }

  export class ShowAction implements Action {
    type = Types.SHOW;

    constructor(public payload?: ProgressIndicatorState.IState) {}
  }

  export class HideAction implements Action {
    type = Types.HIDE;

    constructor(public payload?: ProgressIndicatorState.IState) {}
  }

  export type Actions = ShowAction | HideAction;
}
