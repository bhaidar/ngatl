import { Action } from '@ngrx/store';
import { type } from '../../helpers';
import { ModalState } from '../states';

export namespace ModalActions {
  const CATEGORY: string = 'Modal';

  export interface IActions {
    OPEN: string;
    OPENED: string;
    CLOSE: string;
    CLOSED: string;
  }

  export const ActionTypes: IActions = {
    OPEN : type(`${CATEGORY} Open`),
    OPENED : type(`${CATEGORY} Opened`),
    CLOSE : type(`${CATEGORY} Close`),
    CLOSED : type(`${CATEGORY} Closed`),
  };

  export class OpenAction implements Action {
    type = ActionTypes.OPEN;

    constructor(public payload: ModalState.IOptions) {}
  }

  export class OpenedAction implements Action {
    type = ActionTypes.OPENED;

    constructor(public payload: ModalState.IState) {}
  }

  export class CloseAction implements Action {
    type = ActionTypes.CLOSE;

    /**
     * @param payload any object or for mobile, the ModalDialogParams as params and optional value to pass back
     */
    constructor(public payload?: any | { params: any; value?: any }) {}
  }

  export class ClosedAction implements Action {
    type = ActionTypes.CLOSED;

    constructor(public payload?: ModalState.IState) {}
  }

  export type Actions = OpenAction | OpenedAction | CloseAction | ClosedAction;
}
