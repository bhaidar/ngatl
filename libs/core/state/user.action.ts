import { Action } from '@ngrx/store';
import { SystemUser } from '@ngatl/api';
// app
import { UserState } from './user.state';

export namespace UserActions {

  export interface IUserActions {
    INIT: string;
    INIT_CURRENT_LOAD_SCANNED: string;
    EMAIL_SUBSCRIBE: string;
    UPDATE: string;
    LOGIN: string;
    LOGIN_SUCCESS: string;
    LOGIN_FAILURE: string;
    FORGOT_PASSWORD: string;
    UPDATE_PASSWORD: string;
    MODIFY_PASSWORD: string;
    MODIFY_PASSWORD_VERIFICATION_SUCCESS: string;
    LOGOUT: string;
    LOGOUT_SUCCESS: string;
    SEARCH: string;
    CHECK_EMAIL: string;
    CREATE: string;
    CREATE_FINISH: string;
    REFRESH_USER: string;
    FIND_USER: string;
    CLAIM_USER: string;
    UNCLAIM_USER: string;
    ADD_USER: string;
    REMOVE_SCANNED_USER: string;
    UPDATE_NOTE: string;
    DELETE: string;
    EMAIL_CONNECT: string;
    FIREBASE_CONNECT: string;
    UNAUTHORIZED: string;
    API_ERROR: string;
    RESET_ERRORS: string;
    CHANGED: string;
  }

  export const ActionTypes: IUserActions = {
    INIT : `[@ngatl/user] Init`,
    INIT_CURRENT_LOAD_SCANNED: `[@ngatl/user] Init current and load scanned`,
    EMAIL_SUBSCRIBE : `[@ngatl/user] Email Subscribe`,
    UPDATE : `[@ngatl/user] Update`,
    LOGIN : `[@ngatl/user] Login`,
    LOGIN_SUCCESS : `[@ngatl/user] Login Success`,
    LOGIN_FAILURE : `[@ngatl/user] Login Failure`,
    FORGOT_PASSWORD : `[@ngatl/user] Forgot Password`,
    UPDATE_PASSWORD : `[@ngatl/user] Update Password`,
    MODIFY_PASSWORD : `[@ngatl/user] Modify Password`,
    MODIFY_PASSWORD_VERIFICATION_SUCCESS : `[@ngatl/user] Modify Password Verification Success`,
    LOGOUT : `[@ngatl/user] Logout`,
    LOGOUT_SUCCESS : `[@ngatl/user] Logout Success`,
    SEARCH : `[@ngatl/user] Search`,
    CHECK_EMAIL : `[@ngatl/user] Check Email Availability`,
    CREATE : `[@ngatl/user] Create`,
    CREATE_FINISH : `[@ngatl/user] Create Finish`,
    REFRESH_USER: `[@ngatl/user] Refresh User`,
    FIND_USER: `[@ngatl/user] Find User`,
    CLAIM_USER: `[@ngatl/user] Claim User`,
    UNCLAIM_USER: `[@ngatl/user] Unclaim User`,
    ADD_USER: `[@ngatl/user] Add User`,
    REMOVE_SCANNED_USER: `[@ngatl/user] Remove Scanned User`,
    UPDATE_NOTE: `[@ngatl/user] Update Note`,
    DELETE : `[@ngatl/user] Delete`,
    EMAIL_CONNECT : `[@ngatl/user] Email Connect`,
    FIREBASE_CONNECT : `[@ngatl/user] Firebase Connect`,
    UNAUTHORIZED : `[@ngatl/user] Unauthorized`,
    API_ERROR : `[@ngatl/user] Api Error`,
    RESET_ERRORS : `[@ngatl/user] Reset Errors`,
    CHANGED : `[@ngatl/user] Changed`,
  };

  export class InitAction implements Action {
    type = ActionTypes.INIT;
    payload: string = null;
  }

  export class InitCurrentAndLoadScannedAction implements Action {
    type = ActionTypes.INIT_CURRENT_LOAD_SCANNED;
    constructor(public payload: UserState.IRegisteredUser) {}
  }

  /**
   * Register email for newsletter
   */
  export class EmailSubscribeAction implements Action {
    type = ActionTypes.EMAIL_SUBSCRIBE;

    /**
     * @param payload Email
     */
    constructor(public payload: string) {}
  }

  /**
   * Update user
   */
  export class UpdateAction implements Action {
    type = ActionTypes.UPDATE;

    constructor(public payload: UserState.IRegisteredUser) {}
  }

  export class LoginAction implements Action {
    type = ActionTypes.LOGIN;

    /**
     * @param payload user id
     */
    constructor(public payload?: UserState.IClaimStatus) {}
  }

  export class LoginSuccessAction implements Action {
    type = ActionTypes.LOGIN_SUCCESS;

    /**
     * @param payload user object
     */
    constructor(public payload: UserState.IRegisteredUser){}// SystemUser) {}
  }

  export class LoginFailedAction implements Action {
    type = ActionTypes.LOGIN_FAILURE;

    /**
     * @param payload error
     */
    constructor(public payload: any) {}
  }

  /**
   * Send forgot password request to send email with link to reset.
   */
  export class ForgotPasswordAction implements Action {
    type = ActionTypes.FORGOT_PASSWORD;

    /**
     * @param payload email address
     */
    constructor(public payload: string) {}
  }

  export class UpdatePasswordAction implements Action {
    type = ActionTypes.UPDATE_PASSWORD;

    /**
     * @param payload new passwords and token
     */
    constructor(public payload: { token: string; confirmPassword: string; plainPassword: string }) {}
  }

  export class ModifyPasswordAction implements Action {
    type = ActionTypes.MODIFY_PASSWORD;

    /**
     * @param payload { oldPassword: string, newPassword: string }
     */
    constructor(public payload: { oldPassword: string; newPassword: string }) {}
  }

  export class ModifyPasswordVerificationSuccessAction implements Action {
    type = ActionTypes.MODIFY_PASSWORD_VERIFICATION_SUCCESS;

    /**
     * @param payload new password
     */
    constructor(public payload: string) {}
  }

  export class LogoutAction implements Action {
    type = ActionTypes.LOGOUT;
    payload = null;
  }

  /**
   * Used by some other effect chains to react when the user is fully logged out
   * All persisted user data will be clear by this point
   */
  export class LogoutSuccessAction implements Action {
    type = ActionTypes.LOGOUT_SUCCESS;
    payload = null;
  }

  /**
   * Search for existing emails already registered to users.
   * You generally will not use this, and instead should
   * use the more powerful CheckEmailAction as it includes
   * the ability to reduce repetitive api calls to same email check.
   * This exists in the event you may want to force search
   * disregarding previous or repetitive searches.
   * Resulting state affected ---
   *  checkedEmails: [string, string, etc.], // list of emails checked
   *  emailAvailable: null | string // if an available email is found
   */
  export class SearchAction implements Action {
    type = ActionTypes.SEARCH;

    /**
     * @param payload Email as username
     */
    constructor(public payload: string) {}
  }

  /**
   * Check for email availability against already registered users.
   * Offers a little more power over SearchAction
   * This will reduce repetitive api calls to search
   * for same email over/over again.
   * Resulting state affected ---
   *  checkedEmails: [string, string, etc.], // list of emails checked
   *  emailAvailable: null | string // if an available email is found
   */
  export class CheckEmailAction implements Action {
    type = ActionTypes.CHECK_EMAIL;

    /**
     * @param payload email to check is available
     */
    constructor(public payload: string) {}
  }

  /**
   * Create user
   */
  export class CreateAction implements Action {
    type = ActionTypes.CREATE;

    /**
     * @param payload user data
     */
    constructor(public payload: SystemUser) {}
  }

  export class CreateFinishAction implements Action {
    type = ActionTypes.CREATE_FINISH;

    /**
     * @param payload user data
     */
    constructor(public payload: SystemUser) {}
  }

  export class FindUserAction implements Action {
    type = ActionTypes.FIND_USER;

    /**
     * @param payload badge reference guid
     */
    constructor(public payload: { badgeGuid: string, forceAdd?: boolean }) {}
  }

  export class ClaimUserAction implements Action {
    type = ActionTypes.CLAIM_USER;

    /**
     * @param payload badge reference guid
     */
    constructor(public payload: UserState.IClaimStatus) {}
  }

  export class UnclaimUserAction implements Action {
    type = ActionTypes.UNCLAIM_USER;

    /**
     * @param payload badge guid
     */
    constructor(public payload: string) {}
  }

  export class RefreshUserAction implements Action {
    type = ActionTypes.REFRESH_USER;

    /**
     * @param payload user id and optional full user object
     */
    constructor(public payload: { id: string, user?: UserState.IRegisteredUser}) {}
  }

  export class AddUserAction implements Action {
    type = ActionTypes.ADD_USER;

    /**
     * @param payload add a user to saved badge scan list
     */
    constructor(public payload: UserState.IClaimStatus) {}
  }

  export class RemoveScannedUserAction implements Action {
    type = ActionTypes.REMOVE_SCANNED_USER;

    /**
     * @param payload user object
     */
    constructor(public payload: UserState.IRegisteredUser) {}
  }

  export class UpdateNoteAction implements Action {
    type = ActionTypes.UPDATE_NOTE;

    /**
     * @param payload note
     */
    constructor(public payload: UserState.IConferenceAttendeeNote) {}
  }

  export class EmailConnectAction implements Action {
    type = ActionTypes.EMAIL_CONNECT;

    /**
     * @param payload { username: string, password: string }
     */
    constructor(public payload: { username: string; password: string }) {}
  }

  /**
   * Connect firebase account via google, facebook, etc.
   */
  export class FireBaseConnectAction implements Action {
    type = ActionTypes.FIREBASE_CONNECT;

    /**
     * @param payload Firebase token
     */
    constructor(public payload: string) {}
  }

  /**
   * Delete a user account
   */
  export class DeleteAction implements Action {
    type = ActionTypes.DELETE;

    /**
     * @param payload user id
     */
    constructor(public payload: number) {}
  }

  /**
   * Used to handle 401 unauthorized api responses from any api.
   * Effect will properly emit the unathorizedRouteAttempt observable for platforms to observe
   */
  export class UnauthorizedAction implements Action {
    type = ActionTypes.UNAUTHORIZED;

    /**
     * Falls back to using this._router.url in effect
     * @param payload url (optional) path of unauthorized route.
     */
    constructor(public payload?: string,
                /* unauthorized route currently on */) {}
  }

  export class ApiErrorAction implements Action {
    type = ActionTypes.API_ERROR;

    /**
     * @param payload error
     */
    constructor(public payload: any) {}
  }

  export class ResetErrorsAction implements Action {
    type = ActionTypes.RESET_ERRORS;
    payload = null;
  }

  /**
   * User has changed; register changes in AppStore
   * Not intended to be used directly.
   */
  export class ChangedAction implements Action {
    type = ActionTypes.CHANGED;

    /**
     * @param payload Changes to user
     */
    constructor(public payload: UserState.IState) {}
  }

  export type Actions =
    | InitAction
    | SearchAction
    | EmailSubscribeAction
    | UpdateAction
    | LoginAction
    | LoginSuccessAction
    | LoginFailedAction
    | ForgotPasswordAction
    | ModifyPasswordAction
    | ModifyPasswordVerificationSuccessAction
    | LogoutAction
    | CreateAction
    | CreateFinishAction
    | CheckEmailAction
    | EmailConnectAction
    | FireBaseConnectAction
    | DeleteAction
    | ApiErrorAction
    | ChangedAction;
}
