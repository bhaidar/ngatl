import { Action } from '@ngrx/store';
import { UIState } from './ui.state';

export namespace UIActions {
  export enum Types {
    CHANGED = '[@ngatl/ui] Changed'
  }

  export class ChangedAction implements Action {
    type = Types.CHANGED;

    constructor(public payload: UIState.IState) {}
  }

  export type Actions = ChangedAction;
}
