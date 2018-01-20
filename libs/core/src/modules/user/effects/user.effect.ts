// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// libs
import {
  Action,
  Store,
} from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  Actions,
  Effect,
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
// module
import { SystemUser } from '@ngatl/api';
import {
  Analytics,
  AnalyticsService,
} from '../../analytics/services/analytics.service';
import { LogService } from '../../core/services/log.service';
import { ProgressService } from '../../core/services/progress.service';
import { WindowService } from '../../core/services/window.service';
import {
  getErrorStatus,
  Tracking,
  decodeToken,
} from '../../helpers';
import { UserService } from '../services/user.service';
import { UserActions } from '../actions/user.action';
import { UserState } from '../states';
import {
  IAppState,
  AppActions,
} from '../../ngrx/index';

@Injectable()
export class UserEffects extends Analytics {

  @Effect()
  claimUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.CLAIM_USER )
      .switchMap( ( action: UserActions.ClaimUserAction ) =>
        this._userService
          .claimUser( action.payload, this._currentBadgeId )
          .map( user => {
            return new UserActions.LoginAction( action.payload );
          } )
          .catch( err => {
            this._log.debug( 'claim error:', err );
            return Observable.of( new UserActions.ApiErrorAction( err ) );
          } ) );

  @Effect()
  unclaimUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.UNCLAIM_USER )
      .switchMap( ( action: UserActions.UnclaimUserAction ) =>
        this._userService
          .unclaimUser( action.payload )
          .map( unclaimed => {
            // clear badge and claim
            this._userService.badgeId = null;
            this._userService.claimId = null;
            return new UserActions.LogoutAction();
          } )
          .catch( err => {
            this._log.debug( 'claim error:', err );
            return Observable.of( new UserActions.ApiErrorAction( err ) );
          } ) );

  @Effect()
  login$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.LOGIN )
      .map( ( action: UserActions.LoginAction ) => {
        const user = action.payload;
        if ( user ) {
          this._userService.badgeId = this._currentBadgeId;
          // clear ref, no longer needed
          this._currentBadgeId = null;
          this._userService.claimId = user.attendee.id;
          // TODO: use real/secure token
          // this._userService.token = 'admin-token';
          this._userService.token = this._userService.getTokenHash(user.attendee.id);
          // this._win.setTimeout(_ => {
          //   this._win.alert(`${this._translate.instant('user.logged-in')} ${user.attendee.name}`);
          // }, 300);
          return new UserActions.RefreshUserAction( user.attendee.id );
        } else {
          return new UserActions.LoginFailedAction( 'login failed' );
        }
      } );

  @Effect()
  loginSuccess$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.LOGIN_SUCCESS )
      .switchMap( ( action: UserActions.LoginSuccessAction ) => {
        const user = action.payload;
        if ( user ) {
          this._userService.loadUser( user.id )
            .map( user => {
              this._userService.persistUser( user );

              // this._trackUser(user);

              // this.track(Tracking.Actions.LOG_IN, {
              //   user_id : user.id.toString(),
              // });

              return new UserActions.ChangedAction( {
                current: user,
                errors: [],
              } );
            } )
            .catch( err => Observable.of( new UserActions.LoginFailedAction( this._userService.translateService.instant( 'generic.connection-error-lbl' ) ) ) );

        } else {
          return Observable.of( new UserActions.LoginFailedAction( this._userService.translateService.instant( 'generic.connection-error-lbl' ) ) );
        }
      } );

  @Effect()
  userUpdate$: Observable<Action> =
    this._actions$
        .ofType(UserActions.ActionTypes.UPDATE)
        .switchMap((action: UserActions.UpdateAction) => {
          this._progressService.toggleSpinner(true);
          return this._userService
                     .updateUser(action.payload)
                     .map(user => {
                         return new UserActions.RefreshUserAction(user.id);
                        //  if ( user.authenticationToken ) {
                        //    this._userService.token = user.authenticationToken;
                        //  }
                        //  this._userService.persistUser(user);
                        //  return new UserActions.ChangedAction({
                        //    current : user,
                        //    errors : [],
                        //  });
                       })
                     .catch(
                       err => Observable.of(new UserActions.ApiErrorAction(err)));
        });

  @Effect()
  logout$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.LOGOUT )
      .map( ( action: UserActions.LogoutAction ) => {
        this._log.debug( UserActions.ActionTypes.LOGOUT );
        this._currentBadgeId = null;
        // clear persisted user
        this._userService.clear();
        // clear token
        this._userService.removeToken();
        // this.track(Tracking.Actions.LOG_OUT, {}); // ensure blank properties are passed
        return new UserActions.LogoutSuccessAction();
      } );

  @Effect()
  logoutSuccess$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.LOGOUT_SUCCESS )
      .map( ( action: UserActions.LogoutSuccessAction ) => {
        return new UserActions.ChangedAction( {
          current: null,
          scanned: [],
          reservedEmails: null,
          errors: [],
        } );
      } );

  @Effect()
  resetErrors$: Observable<Action> =
    this._actions$.ofType( UserActions.ActionTypes.RESET_ERRORS ).map(
      ( action: UserActions.ResetErrorsAction ) =>
        new UserActions.ChangedAction( {
          errors: [],
        } ),
    );

  @Effect( { dispatch: false } )
  unauthorized$ =
    this._actions$
      .ofType( UserActions.ActionTypes.UNAUTHORIZED )
      // limit these since many could fire at same time
      // many different api calls firing simultaneously which may all return 401s
      .debounce( ( value ) => Promise.resolve( 500 ) )
      .do( ( action: UserActions.UnauthorizedAction ) => {
        // always hide loader
        this._progressService.toggleSpinner();
        // log user out completely
        this._store.dispatch( new UserActions.LogoutAction() );
        this._log.debug( 'unauthorized$ fired, about to call this._userService.setUnauthorizedRoute(url)' );
        // use explicity payload or current router.url or root route
        const url = action.payload || this._router.url || '/';
        // this._userService.setUnauthorizedRoute(url);
      } );

  /**
   * User API_ERROR and LOGIN_FAILURE are uniquely handled
   */
  @Effect()
  apiError$: Observable<Action> =
    this._actions$
      .ofType(
      UserActions.ActionTypes.LOGIN_FAILURE,
      UserActions.ActionTypes.API_ERROR,
    )
      .withLatestFrom( this._store )
      .map( ( [action, state]: [UserActions.LoginFailedAction | UserActions.ApiErrorAction, IAppState] ) => {
        console.log( 'UserEffect.apiError$...' );
        console.log( action.type );
        if ( action.payload ) {
          console.log( 'error:' );
          console.log( action.payload );
          console.log( action.payload.constructor.name );
          if ( typeof action.payload === 'object' ) {
            for ( let key in action.payload ) {
              console.log( key, action.payload[key] );
            }
          }
        }
        this._progressService.toggleSpinner();
        // TODO: alert?
        return new UserActions.ChangedAction( {
          errors: [
            action.payload,
            ...( state.user.errors || [] )
          ],
        } );
      } );

  @Effect()
  findUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.FIND_USER )
      .withLatestFrom( this._store )
      .switchMap( ( [action, state]: [UserActions.FindUserAction, IAppState] ) => {

        // this._progressService.toggleSpinner();
        this._currentBadgeId = action.payload.badgeGuid;
        return this._userService.findUser( action.payload.badgeGuid, state.user.scanned )
          .map( ( foundUser ) => {
            // this._progressService.toggleSpinner(false);
            this._log.debug('foundUser:', foundUser);
            if ( foundUser ) {
              if ( state.user.current ) {
                // authenticated
                this._log.debug('state.user.current.id:', state.user.current.id);
                this._log.debug('foundUser.attendee.id:', foundUser.attendee.id);
                if (state.user.current.id === foundUser.attendee.id) {
                  // re-scanning yourself for fun
                  this._win.setTimeout( _ => {
                    this._win.alert( this._translate.instant( 'user.scan-yourself' ) );
                  }, 300 );
                  return new AppActions.NoopAction();
                } else {
                  // just add to notes
                  return new UserActions.AddUserAction( foundUser );
                }
              } else {
                // if they had already claimed this user id, then just log them in with it
                const claimedLocallyId = this._userService.claimId;
                if ( claimedLocallyId === foundUser.attendee.id ) {
                  return new UserActions.LoginAction( foundUser );
                } else if ( !foundUser.claimed ) {
                  // if they haven't claimed one themselves, prompt if they want to claim it
                  this._userService.promptUserClaim$.next( foundUser );
                  return new AppActions.NoopAction();
                } else {
                  this._win.setTimeout( _ => {
                    this._win.alert( this._translate.instant( 'user.already-claimed' ) );
                  }, 300 );
                  // TODO: check if sponsor, if so the prompt them to enter pin code to verify they are a valid member of the sponsor group
                  // this._userService.promptSponsorPin$.next( foundUser );
                  return new AppActions.NoopAction();
                }
              }
            } else {
              // assume user has already been scanned
              this._win.setTimeout( _ => {
                this._win.alert( `${this._translate.instant( 'user.already-scanned' )} ${this._translate.instant( 'user.person' )}`);
              }, 300 );
              return new AppActions.NoopAction();
            }
          } )
          .catch( ( err ) => {
            this._win.setTimeout( _ => {
              this._win.alert(this._translate.instant( 'user.not-found' ));
            }, 300 );
            return Observable.of( new UserActions.LoginFailedAction( err ) ) 
          });

      } );

  @Effect()
  addUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.ADD_USER )
      .withLatestFrom( this._store )
      .switchMap( ( [action, state]: [UserActions.AddUserAction, IAppState] ) => {

        if ( state.user.current ) {
          const currentScanned = state.user.current.notes || [];
          const alreadyScanned = currentScanned.find( u => u.peerAttendeeId === action.payload.attendee.id );
          this._currentScanAttendee = action.payload.attendee;
          this._log.debug('alreadyScanned:', alreadyScanned);
          if ( alreadyScanned ) {
            this._win.setTimeout( _ => {
              this._win.alert( `${this._translate.instant( 'user.already-scanned' )} ${alreadyScanned.peer.name}.` );
            }, 300 );
            return Observable.of( new AppActions.NoopAction() );
          } else {
            return this._userService.createAttendeeNote( action.payload.attendee.id )
              .map( ( result: UserState.IRegisteredUser ) => {
                return new UserActions.RefreshUserAction( this._userService.currentUserId );
              } )
              .catch( ( err ) => {
                return Observable.of( new AppActions.NoopAction() );
              } );
          }
        } else {
          // do nothing
          return Observable.of( new AppActions.NoopAction() );
        }
      } );

  @Effect()
  updateNote$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.UPDATE_NOTE )
      .withLatestFrom( this._store )
      .switchMap( ( [action, state]: [UserActions.UpdateNoteAction, IAppState] ) =>
        this._userService.updateAttendeeNote( action.payload )
          .map( ( result: UserState.IConferenceAttendeeNote ) => {
            return new UserActions.RefreshUserAction( this._userService.currentUserId );
          } )
          .catch( ( err ) => {
            return Observable.of( new AppActions.NoopAction() );
          } ) );

  @Effect()
  refreshUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.REFRESH_USER )
      .withLatestFrom( this._store )
      .switchMap( ( [action, state]: [UserActions.RefreshUserAction, IAppState] ) => {
        this._log.debug( 'loadUser:', action.payload );
        return this._userService.loadUser( action.payload )
          .map( ( result: UserState.IRegisteredUser ) => {
            // if ( result && result.notes && ( this._currentScanAttendee || this._currentSavedNotes ) ) {
            //   // update with appropriate name
            //   // TODO: won't need this when Bram can add name in there
            //   for ( let i = 0; i < result.notes.length; i++ ) {
            //     if ( this._currentScanAttendee ) {
            //       if ( result.notes[i].peerAttendeeId === this._currentScanAttendee.id ) {
            //         result.notes[i].name = this._currentScanAttendee.name;
            //         break;
            //       }
            //     } else if ( this._currentSavedNotes && this._currentSavedNotes.length ) {
            //       const savedNote = this._currentSavedNotes.find( n => n.id === result.notes[i].id );
            //       if ( savedNote ) {
            //         // ensure names are preserved
            //         result.notes[i].peer.name = savedNote.peer.name;
            //       }
            //     }
            //   }
            // }
            // this._currentScanAttendee = this._currentSavedNotes = null; // reset
            this._userService.persistUser( result );
            return new UserActions.ChangedAction( {
              current: result
            } );
          } )
          .catch( ( err ) => {
            return Observable.of( new AppActions.NoopAction() );
          } );
      } );

  @Effect()
  removeScannedUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.REMOVE_SCANNED_USER )
      .withLatestFrom( this._store )
      .switchMap( ( [action, state]: [UserActions.RemoveScannedUserAction, IAppState] ) => {

        // this._progressService.toggleSpinner();
        const currentUser = Object.assign( {}, state.user.current );
        const index = currentUser.notes.findIndex( u => u.id === action.payload.id );
        if ( index > -1 ) {
          const note = currentUser.notes[index];
          return this._userService.deleteAttendeeNote( note.id )
            .map( ( result: any ) => {
              currentUser.notes.splice( index, 1 );
              return new UserActions.ChangedAction( {
                current: new UserState.RegisteredUser( currentUser )
              } )
            } )
            .catch( err => Observable.of( new UserActions.ApiErrorAction( err ) ) );
        } else {
          return Observable.of( new AppActions.NoopAction() );
        }
      } );

  @Effect( { dispatch: false } )
  loaderOff$: Observable<Action> =
    this._actions$
      .ofType(
      UserActions.ActionTypes.LOGOUT,
      UserActions.ActionTypes.LOGIN_FAILURE,
      UserActions.ActionTypes.UNAUTHORIZED,
      UserActions.ActionTypes.API_ERROR,
      UserActions.ActionTypes.CHANGED,
    )
      // always hide loader when finally updating user state
      .do(
      _ => {
        this._progressService.toggleSpinner();
      } );

  // Any startWith observables - Should always BE LAST!
  @Effect()
  init$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.INIT )
      .startWith( new UserActions.InitAction() )
      .switchMap( ( action: UserActions.InitAction ) =>
        this._userService
          .getCurrentUser()
          .map( user => {
            if ( user ) {
              // get latest
              // TODO: use valid token
              this._userService.token = this._userService.getTokenHash(user.id);// 'admin-token';
              this._currentSavedNotes = user.notes;
              return new UserActions.RefreshUserAction( user.id );
            } else {
              // just ignore, no user
              return new AppActions.NoopAction();
            }
          } )
          .catch(
          err => Observable.of( new UserActions.ApiErrorAction( err ) ) ),
    );

  private _postingData: any; // used with create user chain
  private _currentBadgeId: string;
  private _currentScanAttendee: UserState.IRegisteredUser;
  private _currentSavedNotes: Array<UserState.IConferenceAttendeeNote>;

  constructor(
    public analytics: AnalyticsService,
    private _store: Store<IAppState>,
    private _log: LogService,
    private _actions$: Actions,
    private _router: Router,
    private _win: WindowService,
    private _translate: TranslateService,
    private _progressService: ProgressService,
    private _userService: UserService,
  ) {
    super();
    this.category = Tracking.Categories.USERS;
  }

  private _trackUser( user: UserState.IRegisteredUser ) {// SystemUser) {
    if ( user ) {
      const id = user.id;
      const props: any = {
        // must be a string!!
        // otherwise can end up with errors like:
        // Error in firebase.analytics.logEvent: Error: Cannot convert number to Ljava/lang/String; at index 1
        user_id: id,
      };
      // track analytics for user
      this.track( Tracking.Actions.SET_USER_PROPERTIES_USER, props );
      this.analytics.identify( {
        key: 'user_id',
        value: id,
      } );
    }
  }
}
