import { Injectable, } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';
import { SystemUser, SystemUserApi } from '@ngatl/api';
// app
import { AnalyticsService } from '../../analytics/services/analytics.service';
import {
  UserActions,
} from '../actions';
import { LogService } from '../../core/services/log.service';
import { NetworkCommonService } from '../../core/services/network.service';
import {
  Cache,
  StorageKeys,
  StorageService,
} from '../../core/services/storage.service';
import { WindowService } from '../../core/services/window.service';
import { UserState } from '../states/user.state';
import {
  isNativeScript,
  isObject,
  getYear,
} from '../../helpers';
import { IAppState } from '../../ngrx';

const CryptoJS = require( 'crypto-js' );

@Injectable()
export class UserService extends Cache {
  // init helpers
  private _userInitialized: BehaviorSubject<boolean> = new BehaviorSubject( false );
  // see getters below for docs
  private _unauthorizedRouteAttempt: Subject<string> = new Subject();
  // for quick access in other api calls
  private _currentUserId: number;
  // allow various effect chain to prevent the default loaderOff$ handling in user.effect
  private _preventDefaultSpinner: boolean;
  private _preventDefaultSpinnerTimeout: number;
  // control alerts
  private _showingAlert = false;
  // badge list
  private _promptUserClaim$: Subject<UserState.IClaimStatus> = new Subject();
  // sponsor handling
  private _promptSponsorPin$: Subject<UserState.IClaimStatus> = new Subject();

  constructor(
    private _store: Store<IAppState>,
    private _http: HttpClient,
    private _log: LogService,
    private _storageService: StorageService,
    private _win: WindowService,
    private _router: Router,
    private _analytics: AnalyticsService,
    private _network: NetworkCommonService,
    private _translateService: TranslateService,
    private _systemUserApi: SystemUserApi,
  ) {
    super( _storageService );
    this.isObjectCache = true;
    this.key = StorageKeys.USER;

    _store
      .select( 'user' )
      .skip( 1 ) // ignore the wiring, only listen to effect chain reaction
      .subscribe( ( state: UserState.IState ) => {
        // this.currentUserId = state.current && state.current.id ? state.current.id : null;
        this.currentUserId = state.current && state.current.id ? state.current.id : null;
      } );
  }

  /**
   * Get specificity on the crucial boot init phase of the user
   * Helpful for deep linking on several data resolvers for routes
   */
  public get userInitialized$() {
    return this._userInitialized;
  }

  public get currentUserId() {
    return this._currentUserId;
  }

  public set currentUserId( id: any ) {
    if ( this._currentUserId !== id ) {
      this._currentUserId = id || null;
      // ensure user id is tracked with analytics all the time (mainly for gtm)
      this._analytics.userId = id;
      // fire user initialized anytime this changes (safely determines whether the user boot phase has fired yet or not)
      this._userInitialized.next( true );
      // only if actually changing (to new user or null)
      // preloadData
      this.preloadData( id != null );
    }
  }

  public get promptUserClaim$() {
    return this._promptUserClaim$;
  }

  public get promptSponsorPin$() {
    return this._promptSponsorPin$;
  }

  /**
   * Subscribe to this (public getter below) to customize app behavior
   * whenever an unauthorized attempt to a route is made
   * For example, route app somewhere specific, show dialog, etc.
   */
  public get unauthorizedRouteAttempt$() {
    return this._unauthorizedRouteAttempt;
  }

  // convenient for some effect chains
  public get translateService() {
    return this._translateService;
  }

  // public firebaseConnect(firebaseToken: string) {
  //   return this._apiUsers.linkAuthFirebase({ firebaseToken });
  // }

  public emailConnect( credentials: { email: string; password: string } ) {
    return this._systemUserApi.login( credentials );
  }

  public createUser( user: SystemUser ) {
    return this._systemUserApi.create( user );
  }

  public findUser( badgeId: string, scanned: Array<UserState.IRegisteredUser> ) {
    // if (scanned) {
    //   const alreadyScanned = scanned.find(u => {
    //     return u.unique_ticket_url.indexOf(badgeId) > -1;
    //   });
    //   if (alreadyScanned) {
    //     return null;
    //   }
    // }
    // return foundUser;
    return this._http.get( `${NetworkCommonService.API_URL}ConferenceTickets/${badgeId}/claim` )
      .map( ( claimStatus: UserState.IClaimStatus ) => {
        return claimStatus;
      } );

  }

  public loadAll(): Observable<UserState.ILoadAllResult> {
    // return this._http.get(`${NetworkCommonService.API_URL}ConferenceAttendees`)//'/assets/users.json')
    //   .map((users) => {
    // this._log.debug(typeof users);
    // this._log.debug('isarray:', Array.isArray(users));
    // this._log.debug(users);
    let scanned = [];
    const savedScans = this._storageService.getItem( StorageKeys.SCANNED );
    if ( savedScans ) {
      scanned = savedScans.map( u => new UserState.RegisteredUser( u ) )
    }
    if ( scanned.length ) {
      // TODO: may want to query updates from colmena to get latest attendee profile updates
      // will want to get new photo or other information if user had updated it
    }
    return Observable.of( {
      // all: (<Array<any>>users).map(u => new UserState.RegisteredUser(u)),
      scanned
    } );
    // });
  }

  public deleteAttendeeNote( id: string ) {
    return this._http.delete( `${NetworkCommonService.API_URL}ConferenceAttendeeNotes/${id}` )
      .map( ( result ) => {
        // assume it worked
        return true;
      } );
  }

  public saveScans( scanned: Array<UserState.IRegisteredUser> ) {
    if ( scanned ) {
      this._storageService.setItem( StorageKeys.SCANNED, scanned );
    }
  }

  public getCurrentUser(): Observable<UserState.IRegisteredUser> {
    let storedUser = this.cache;
    // if ( !storedUser ) {
    //   // check if there is a token
    //   return this.loadUser();
    // } else {
    //   // ensure network is updated to handle auth token headers
    //   if ( storedUser.authenticationToken ) {
    //     this._network.authToken = storedUser.authenticationToken;
    //   } else {
    //     // check storage
    //     const token = this.token;
    //     if ( token ) {
    //       this._network.authToken = token;
    //     } else {
    //       // no valid token, force user to relogin
    //       storedUser = null;
    //     }
    //   }
    // }

    return Observable.of( storedUser ? new UserState.RegisteredUser( storedUser ) : null );
  }

  public isAuthenticated(): boolean {
    return this.currentUserId != null;
  }

  // public emailIsAvailable(email: string): Observable<any> {
  //   return this._http.get(`api/4.0/users?username=${email.replace(/\+/g, '%2B')}`).map((response: any) => {
  //     if ( response && response._body ) {
  //       const data = response.json();
  //       if ( data ) {
  //         if ( data instanceof Array ) {
  //           return data;
  //         } else if ( data.id && data.username ) {
  //           return [data];
  //         }
  //       }
  //     }
  //     return new Error('Invalid response data');
  //   });
  // }

  // public forgotPasswordRequest(email: string): Observable<any> {
  //   const resetRequest = new ResetPasswordRequest({ email });
  //   return this._apiResetting.pnpPasswordAskForToken(resetRequest);
  // }

  // public updatePasswordRequest(
  //   token: string,
  //   confirmPassword: string,
  //   plainPassword: string,
  // ): Observable<any> {
  //   const forgotRequest = new ForgotPasswordTokenRequest({
  //     token,
  //     confirmPassword,
  //     plainPassword,
  //   });
  //   return this._apiResetting.pnpUpdatePassword(forgotRequest);
  // }

  public updateUser(user: UserState.IRegisteredUser) {
    const url = `${NetworkCommonService.API_URL}ConferenceAttendees/${user.id}`;
    this._serializeUpdates(user);
    return this._http.put( url, user )
      .map( ( user: any ) => {
        this._log.debug( 'updated user:', user );
        return new UserState.RegisteredUser( user );
      } );
  }

  // public deleteUser(id: string) {
  //   return this._apiUsers.deleteUser(id);
  // }

  public loadUser( id: string ): Observable<UserState.IRegisteredUser> {
    // get user with all details in case reloading from a fresh login
    this._log.debug( 'loadUser:', id );
    const url = `${NetworkCommonService.API_URL}ConferenceAttendees/${id}?filter=%7B%22include%22%3A%7B%22relation%22%3A%22notes%22%2C%22scope%22%3A%7B%22include%22%3A%22peer%22%7D%7D%7D`;
    this._log.debug( url );
    // let params = new HttpParams();

    // // Begin assigning parameters
    // params = params.append('filter', );
    // params = params.append('secondParameter', parameters.valueTwo);
    return this._http.get( url )
      .map( ( user: any ) => {
        this._log.debug( 'loaded user:', user );
        return new UserState.RegisteredUser( user );
      } );
  }

  /**
   * claim user badge and cache it (aka persist in browser/mobile device)
   * @param token authenticated token
   */
  public claimUser( user: UserState.IClaimStatus, badgeId: string ): Observable<UserState.IRegisteredUser> {
    const confirmHash = CryptoJS.AES.encrypt( user.attendee.id, 'user' ).toString().replace( /\//ig, '+' ); // ensure slashes are replaced by '+'
    this._log.debug( 'confirmHash:', confirmHash );
    // TODO: do this when Bram is ready
    // return this._http.get(`${NetworkCommonService.API_URL}ConferenceTickets/${badgeId}/claim?confirm=${confirmHash}`)
    return this._http.get( `${NetworkCommonService.API_URL}ConferenceTickets/${badgeId}/claim?confirm=true` )
      .map( ( user: any ) => {
        this._log.debug( 'confirmed:', user );
        this._log.debug( 'typeof user:', typeof user );
        for ( const key in user ) {
          this._log.debug( key, user[key] );
        }
        return new UserState.RegisteredUser( user.attendee );
      } );
  }

  public unclaimUser( id: string ): Observable<boolean> {
    return this._http.get( `${NetworkCommonService.API_URL}ConferenceTickets/${id}/unclaim` )
      .map( ( user: any ) => {
        return true;
      } );
  }

  public createAttendeeNote( id: string ): Observable<UserState.IConferenceAttendeeNote> {
    this._log.debug( 'createAttendeeNote for:', id );
    // get user with all details in case reloading from a fresh login
    return this._http.post( `${NetworkCommonService.API_URL}ConferenceAttendeeNotes`, {
      conferenceAttendeeId: this.currentUserId,
      peerAttendeeId: id
    } )
      .map( ( note: any ) => {
        return new UserState.ConferenceAttendeeNote( note );
      } );
  }

  public updateAttendeeNote( updates: UserState.IConferenceAttendeeNote ): Observable<UserState.IConferenceAttendeeNote> {
    const id = updates.id;
    this._serializeUpdates(updates);
    return this._http.put( `${NetworkCommonService.API_URL}ConferenceAttendeeNotes/${id}`, updates )
      .map( ( note: any ) => {
        return new UserState.ConferenceAttendeeNote( note );
      } );
  }

  private _serializeUpdates(updates: any) {
    for (const key of ['id', 'modified', 'created']) {
      // disallow updating of these props
      delete updates[key];
    }
  }

  public persistUser( user: UserState.IRegisteredUser ) {// SystemUser) {
    // persist user
    this.cache = user;
  }

  public set token( value: string ) {
    // persist token
    if ( value ) {
      this._storageService.setItem( StorageKeys.TOKEN, { token: value } );
    } else {
      this._storageService.removeItem( StorageKeys.TOKEN );
    }
    // used via http request to set auth token on request headers
    this._network.authToken = value;
  }

  public get token(): string {
    const value = this._storageService.getItem( StorageKeys.TOKEN );
    if ( value && value.token ) {
      return value.token;
    }
    return null;
  }

  public removeToken() {
    this.token = null;
  }

  public get claimId() {
    const stored = this._storageService.getItem( StorageKeys.CLAIMED_ID );
    if ( stored ) {
      return stored.id;
    }
    return null;
  }

  public set claimId( id: string ) {
    if ( id ) {
      this._storageService.setItem( StorageKeys.CLAIMED_ID, { id } );
    } else {
      this._storageService.removeItem( StorageKeys.CLAIMED_ID );
    }
  }

  public get badgeId() {
    const stored = this._storageService.getItem( StorageKeys.BADGE_ID );
    if ( stored ) {
      return stored.id;
    }
    return null;
  }

  public set badgeId( id: string ) {
    if ( id ) {
      this._storageService.setItem( StorageKeys.BADGE_ID, { id } );
    } else {
      this._storageService.removeItem( StorageKeys.BADGE_ID );
    }
  }

  /**
   * Preload various user data to help boost performance
   */
  public preloadData( isAuth?: boolean ) {
    // ** Preload data **

    // only for authenticated users
    if ( isAuth ) {

    } else {

    }
  }

  private _resetAlert() {
    this._showingAlert = false;
  }
}
