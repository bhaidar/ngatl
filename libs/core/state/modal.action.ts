import { Action } from '@ngrx/store';
import { ModalState } from './modal.state';

export namespace ModalActions {
  export enum Types {
    OPEN = '[@ngatl/modal] Open',
    OPENED = '[@ngatl/modal] Opened',
    CLOSE = '[@ngatl/modal] Close',
    CLOSED = '[@ngatl/modal] Closed'
  }

  export class OpenAction implements Action {
    type = Types.OPEN;

    constructor(public payload: ModalState.IOptions) {}
  }

  export class OpenedAction implements Action {
    type = Types.OPENED;

    constructor(public payload: ModalState.IState) {}
  }

  export class CloseAction implements Action {
    type = Types.CLOSE;

    /**
     * @param payload any object or for mobile, the ModalDialogParams as params and optional value to pass back
     */
    constructor(public payload?: any | { params: any; value?: any }) {}
  }

  export class ClosedAction implements Action {
    type = Types.CLOSED;

    constructor(public payload?: ModalState.IState) {}
  }

  export type Actions = OpenAction | OpenedAction | CloseAction | ClosedAction;
}
