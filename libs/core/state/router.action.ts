import { Action } from '@ngrx/store';

export namespace RouterActions {
  export enum Types {
    GO = '[@ngatl/router] Go',
    BACK = '[@ngatl/router] Back',
    FORWARD = '[@ngatl/router] Forward'
  }

  export class Go implements Action {
    readonly type = Types.GO;

    constructor(
      public payload: {
        path: any[];
        extras?: any;
      }
    ) {}
  }

  export class Back implements Action {
    readonly type = Types.BACK;
  }

  export class Forward implements Action {
    readonly type = Types.FORWARD;
  }

  export type Actions = Go | Back | Forward;
}
