import { SystemUser } from '@ngatl/api';

export namespace UserState {

  export interface IRegisteredUser {
    number?: number;
    ticket_created_date?: string;
    ticket_last_updated_date?: string;
    ticket?: string;
    ticket_full_name?: string;
    ticket_first_name?: string;
    ticket_last_name?: string;
    ticket_email?: string;
    ticket_company_name?: string;
    ticket_phone_number?: string;
    event?: string;
    void_status?: string;
    discount_status?: string;
    ticket_reference?: string;
    tags?: string;
    unique_ticket_url?: string;
    unique_order_url?: string;
    order_reference?: string;
    order_name?: string;
    order_email?: string;
    order_company_name?: string;
    order_phone_number?: string;
    order_discount_code?: string;
    order_ip?: string;
    order_created_date?: string;
    order_completed_date?: string;
    payment_reference?: string;
    scanned_date?: number;
    note?: string;
    swiping?: boolean;
  }

  export interface ILoadAllResult { 
    all: Array<UserState.IRegisteredUser>;
    scanned: Array<UserState.IRegisteredUser>; 
  }

  export class RegisteredUser implements IRegisteredUser {
    constructor(model?: any) {
      for (const key in model) {
        const cleanKey = key.toLowerCase().replace(/ /ig, '_');
        const isDate = false;//cleanKey.indexOf('date') > -1;
        this[cleanKey] = isDate ? new Date(model[key]) : model[key];
      }
    }
  }

  export interface IState {
    /**
     * Current Authenticated User
     */
    current?: IRegisteredUser;//SystemUser;
    /**
     * list of all registered users
     */
    all?: Array<IRegisteredUser>;

    /**
     * list of scanned users
     */
    scanned?: Array<IRegisteredUser>;

    anonymousEmail?: string;
    /**
     * An available email for user to signup with.
     */
    emailAvailable?: string;
    /**
     * Reserved emails which are already taken.
     * User signup attempts trying to find available email.
     * Use cases:
     *   - Determine if a user already exists and prompt them for a password.
     *   - Simply track which emails are already taken for analytics purposes.
     *     Cases may arise where bunk accounts are created
     *     with people's actual emails. Reporting these in analytics
     *     could help track this problematic case down. A user could
     *     be attempting several times to register their own email address however
     *     somebody could have created a bunk account with it. Seeing this pattern
     *     via analytics can help determine an appropriate resolution.
     */
    reservedEmails?: Array<string>;
    /**
     * Whether a forgot password request has been sent.
     */
    forgotPasswordSent?: boolean;
    /**
     * Whether request with new passwords and token has been sent.
     */
    updatePasswordSent?: boolean;

    signUpMethod?: string;

    /**
     * User api errors that have occurred during user session.
     */
    errors?: Array<any>;
  }

  export const initialState: IState = {
    current : null,
    errors : [],
  };
}
