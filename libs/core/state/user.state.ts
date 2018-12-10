import { SystemUser } from '@ngatl/api';
import { LocaleState } from './locale.state';

export namespace UserState {

  export interface IConferenceAttendeeNote {
    id?: string;
    name?: string;
    peerAttendeeId?: string;
    note?: string;
    audioUrl?: string;
    imageUrl?: string;
    photos?: Array<string>;
    conferenceAttendeeId?: string;
    created?: string;
    modified?: string;
    peer?: IRegisteredUser;
    attendee?: IRegisteredUser;
  }

  export interface IRegisteredUser {
    id?:string;
    avatar?: string;
    email?:string;
    name?:string;
    company?:string;
    phone?:string;
    imageUrl?:string;
    language?: LocaleState.Locale;
    created?:string;
    modified?:string;
    notes?: Array<IConferenceAttendeeNote>;
    favs?: Array<string>;
    pin?: number;
    sponsor?: string;
  }
  
  export interface IClaimStatus {
    claimed:boolean;
    attendee?: IRegisteredUser;
    newClaim:false;
  }

  export interface ILoadAllResult { 
    all?: Array<UserState.IRegisteredUser>;
    scanned: Array<UserState.IRegisteredUser>; 
  }

  export class RegisteredUser implements IRegisteredUser {
    public id: string;
    public avatar: string;
    public email:string;
    public name:string;
    public company:string;
    public phone:string;
    public imageUrl:string;
    public created:string;
    public modified:string;
    public language: LocaleState.Locale;
    public notes: Array<IConferenceAttendeeNote>;
    public favs: Array<string>;
    public pin: number;
    public sponsor: string;

    constructor(model?: any) {
      Object.assign(this, this, model);
      // for (const key in model) {
      //   const cleanKey = key.toLowerCase().replace(/ /ig, '_');
      //   const isDate = false;//cleanKey.indexOf('date') > -1;
      //   this[cleanKey] = isDate ? new Date(model[key]) : model[key];
      // }
    }
  }

  export class ConferenceAttendeeNote implements IConferenceAttendeeNote {
    constructor(model?: any) {
      Object.assign(this, this, model);
      // for (const key in model) {
      //   const cleanKey = key.toLowerCase().replace(/ /ig, '_');
      //   const isDate = false;//cleanKey.indexOf('date') > -1;
      //   this[cleanKey] = isDate ? new Date(model[key]) : model[key];
      // }
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
