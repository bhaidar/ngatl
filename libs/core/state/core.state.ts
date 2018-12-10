import { Action } from '@ngrx/store';
import { UserState } from './user.state';
import { UIState } from './ui.state';

export namespace AppActions {
  export enum Types {
    NOOP = '[@ngatl/app] Noop'
  }

  export class NoopAction implements Action {
    type = Types.NOOP;
    payload: string = null;
  }

  export type Actions = NoopAction;
}

export interface ICoreState {
  user: UserState.IState;
  ui: UIState.IState;
}
