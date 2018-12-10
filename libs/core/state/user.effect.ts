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
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, tap, startWith } from 'rxjs/operators';
// module
import { SystemUser } from '@ngatl/api';
import {
  Analytics,
  AnalyticsService,
} from '../services/analytics.service';
import { LogService } from '../services/log.service';
import { ProgressService } from '../services/progress.service';
import { WindowService } from '../services/window.service';
import {
  Tracking,
} from '@ngatl/utils';
import { UserService } from '../services/user.service';
import { UserActions } from './user.action';
import { UserState } from './user.state';
import {
  ICoreState,
  AppActions,
} from '../state';

@Injectable()
export class UserEffects extends Analytics {

  @Effect()
  claimUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.CLAIM_USER )
      .pipe(
      switchMap( ( action: UserActions.ClaimUserAction ) =>
        this._userService
          .claimUser( action.payload, this._userService.tmpBadgeId ).pipe(
          map( user => {
            return new UserActions.LoginAction( action.payload );
          } ),
          catchError( err => {
            this._log.debug( 'claim error:', err );
            return of( new UserActions.ApiErrorAction( err ) );
          } ) )));

  @Effect()
  unclaimUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.UNCLAIM_USER )
      .pipe(switchMap( ( action: UserActions.UnclaimUserAction ) =>
        this._userService
          .unclaimUser( action.payload ).pipe(
          map( unclaimed => {
            // clear badge and claim
            this._userService.badgeId = null;
            this._userService.claimId = null;
            return new UserActions.LogoutAction();
          } ),
          catchError( err => {
            this._log.debug( 'claim error:', err );
            return of( new UserActions.ApiErrorAction( err ) );
          } ) )));

  @Effect()
  login$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.LOGIN )
      .pipe(map( ( action: UserActions.LoginAction ) => {
        const user = action.payload;
        if ( user ) {
          this._userService.badgeId = this._userService.tmpBadgeId;
          // clear ref, no longer needed
          this._userService.tmpBadgeId = null;
          this._userService.claimId = user.attendee.id;
          // TODO: use real/secure token
          // this._userService.token = 'admin-token';
          this._userService.token = this._userService.getTokenHash(user.attendee.id);
          // this._win.setTimeout(_ => {
          //   this._win.alert(`${this._translate.instant('user.logged-in')} ${user.attendee.name}`);
          // }, 300);
          return new UserActions.RefreshUserAction( { id: user.attendee.id, user: user.attendee } );
        } else {
          return new UserActions.LoginFailedAction( 'login failed' );
        }
      } ));

  @Effect()
  loginSuccess$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.LOGIN_SUCCESS )
      .pipe(switchMap( ( action: UserActions.LoginSuccessAction ) => {
        const user = action.payload;
        if ( user ) {
          this._userService.loadUser( { id: user.id } ).pipe(
            map( user => {
              this._userService.persistUser( user );

              // this._trackUser(user);

              // this.track(Tracking.Actions.LOG_IN, {
              //   user_id : user.id.toString(),
              // });

              return new UserActions.ChangedAction( {
                current: user,
                errors: [],
              } );
            } ),
            catchError( err => of( new UserActions.LoginFailedAction( this._userService.translateService.instant( 'generic.connection-error-lbl' ) ) ) )
          );

        } else {
          return of( new UserActions.LoginFailedAction( this._userService.translateService.instant( 'generic.connection-error-lbl' ) ) );
        }
      } ));

  @Effect()
  userUpdate$: Observable<Action> =
    this._actions$
        .ofType(UserActions.ActionTypes.UPDATE)
        .pipe(
        withLatestFrom( this._store ),
        switchMap( ( [action, state]: [UserActions.UpdateAction, ICoreState] ) => {
          this._progressService.toggleSpinner(true);
          return this._userService
                     .updateUser(action.payload)
                     .pipe(
                     map((user: any) => {
                       const currentUser = Object.assign({}, state.user.current);
                       if (!user.sponsor) {
                        // updated user might have just unlinked sponsor, make sure user passed to refresh is cleared as well
                        delete currentUser.sponsor;
                       }
                         return new UserActions.RefreshUserAction({id: user.id, user: currentUser });
                        //  if ( user.authenticationToken ) {
                        //    this._userService.token = user.authenticationToken;
                        //  }
                        //  this._userService.persistUser(user);
                        //  return new UserActions.ChangedAction({
                        //    current : user,
                        //    errors : [],
                        //  });
                       }),
                     catchError(
                       err => of(new UserActions.ApiErrorAction(err))));
        }));

  @Effect()
  logout$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.LOGOUT )
      .pipe(map( ( action: UserActions.LogoutAction ) => {
        this._log.debug( UserActions.ActionTypes.LOGOUT );
        this._userService.tmpBadgeId = null;
        // clear persisted user
        this._userService.clear();
        // clear token
        this._userService.removeToken();
        // this.track(Tracking.Actions.LOG_OUT, {}); // ensure blank properties are passed
        return new UserActions.LogoutSuccessAction();
      } ));

  @Effect()
  logoutSuccess$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.LOGOUT_SUCCESS )
      .pipe(map( ( action: UserActions.LogoutSuccessAction ) => {
        return new UserActions.ChangedAction( {
          current: null,
          scanned: [],
          reservedEmails: null,
          errors: [],
        } );
      } ));

  @Effect()
  resetErrors$: Observable<Action> =
    this._actions$.ofType( UserActions.ActionTypes.RESET_ERRORS ).pipe(map(
      ( action: UserActions.ResetErrorsAction ) =>
        new UserActions.ChangedAction( {
          errors: [],
        } ),
    ));

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
    .pipe(
      withLatestFrom( this._store ),
      map( ( [action, state]: [UserActions.LoginFailedAction | UserActions.ApiErrorAction, ICoreState] ) => {
        console.log( 'UserEffect.apiError$...' );
        console.log( action.type );
        if ( action.payload ) {
          console.log( 'error:' );
          console.log( action.payload );
          console.log( action.payload.constructor.name );
          if ( typeof action.payload === 'object' ) {
            for ( const key in action.payload ) {
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
      } ));

  @Effect()
  findUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.FIND_USER )
      .pipe(
      withLatestFrom( this._store ),
      switchMap( ( [action, state]: [UserActions.FindUserAction, ICoreState] ) => {

        this._progressService.toggleSpinner(true);
        this._userService.tmpBadgeId = action.payload.badgeGuid;
        return this._userService.findUser( action.payload.badgeGuid, state.user.scanned )
          .pipe(
          map( ( foundUser: any ) => {
            this._progressService.toggleSpinner(false);
            this._log.debug('foundUser:', foundUser);
            if ( foundUser ) {
              if ( state.user.current ) {
                // authenticated
                // this._log.debug('state.user.current.id:', state.user.current.id);
                // this._log.debug('foundUser.attendee.id:', foundUser.attendee.id);
                if (state.user.current.id === foundUser.attendee.id) {
                  // re-scanning yourself for fun
                  this._win.setTimeout( _ => {
                    this._win.alert( this._translate.instant( 'user.scan-yourself' ) );
                  }, 300 );
                  return new AppActions.NoopAction();
                } else if (foundUser.attendee.pin) {
                  this._userService.promptSponsorPin$.next( foundUser );
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
                } else if (foundUser.attendee.pin) {
                  this._win.setTimeout( _ => {
                    this._win.alert( this._translate.instant( 'user.claim-personal-first' ) );
                  }, 300 );
                  return new AppActions.NoopAction();
                } else if ( !foundUser.claimed ) {
                  // if they haven't claimed one themselves, prompt if they want to claim it
                  this._userService.promptUserClaim$.next( foundUser );
                  return new AppActions.NoopAction();
                } else {
                  this._win.setTimeout( _ => {
                    this._win.alert( this._translate.instant( 'user.already-claimed' ) );
                  }, 300 );
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
          } ),
          catchError( ( err ) => {
            this._win.setTimeout( _ => {
              this._win.alert(this._translate.instant( 'user.not-found' ));
            }, 300 );
            return of( new UserActions.LoginFailedAction( err ) ) 
          }));

      } ));

  @Effect()
  addUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.ADD_USER )
      .pipe(
      withLatestFrom( this._store ),
      switchMap( ( [action, state]: [UserActions.AddUserAction, ICoreState] ) => {

        const currentUser = state.user.current;
        if ( currentUser ) {
          const currentScanned = currentUser.notes || [];
          const alreadyScanned = currentScanned.find( u => u.peerAttendeeId === action.payload.attendee.id );
          this._currentScanAttendee = action.payload.attendee;
          this._log.debug('alreadyScanned:', alreadyScanned);
          if ( alreadyScanned ) {
            this._win.setTimeout( _ => {
              this._win.alert( `${this._translate.instant( 'user.already-scanned' )} ${alreadyScanned.peer.name}.` );
            }, 300 );
            return of( new AppActions.NoopAction() );
          } else {
            return this._userService.createAttendeeNote( action.payload.attendee.id )
            .pipe(
              map( ( result: UserState.IRegisteredUser ) => {
                return new UserActions.RefreshUserAction( {id: this._userService.currentUserId, user: currentUser} );
              } ),
              catchError( ( err ) => {
                return of( new AppActions.NoopAction() );
              } ));
          }
        } else {
          // do nothing
          return of( new AppActions.NoopAction() );
        }
      } ));

  @Effect()
  updateNote$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.UPDATE_NOTE )
      .pipe(
      withLatestFrom( this._store ),
      switchMap( ( [action, state]: [UserActions.UpdateNoteAction, ICoreState] ) =>
        this._userService.updateAttendeeNote( action.payload )
        .pipe(
          map( ( result: UserState.IConferenceAttendeeNote ) => {
            return new UserActions.RefreshUserAction( {id: this._userService.currentUserId, user: state.user.current} );
          } ),
          catchError( ( err ) => {
            return of( new AppActions.NoopAction() );
          } ) )));

  @Effect()
  refreshUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.REFRESH_USER )
      .pipe(
      withLatestFrom( this._store ),
      switchMap( ( [action, state]: [UserActions.RefreshUserAction, ICoreState] ) => {
        this._log.debug( 'loadUser:', action.payload );
        return this._userService.loadUser( action.payload )
          .pipe(
          map( ( result: UserState.IRegisteredUser ) => {
            this._userService.persistUser( result );
            return new UserActions.ChangedAction( {
              current: result
            } );
          } ),
          catchError( ( err ) => {
            return of( new AppActions.NoopAction() );
          } ));
      } ));

  @Effect()
  removeScannedUser$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.REMOVE_SCANNED_USER )
      .pipe(
      withLatestFrom( this._store ),
      switchMap( ( [action, state]: [UserActions.RemoveScannedUserAction, ICoreState] ) => {

        // this._progressService.toggleSpinner();
        const currentUser = Object.assign( {}, state.user.current );
        const index = currentUser.notes.findIndex( u => u.id === action.payload.id );
        if ( index > -1 ) {
          const note = currentUser.notes[index];
          return this._userService.deleteAttendeeNote( note.id )
            .pipe(
            map( ( result: any ) => {
              currentUser.notes.splice( index, 1 );
              return new UserActions.ChangedAction( {
                current: new UserState.RegisteredUser( currentUser )
              } )
            } ),
            catchError( err => of( new UserActions.ApiErrorAction( err ) ) ));
        } else {
          return of( new AppActions.NoopAction() );
        }
      } ));

  @Effect( { dispatch: false } )
  loaderOff$: Observable<Action> =
    this._actions$
      .ofType(
      UserActions.ActionTypes.LOGOUT,
      UserActions.ActionTypes.LOGIN_FAILURE,
      UserActions.ActionTypes.UNAUTHORIZED,
      UserActions.ActionTypes.API_ERROR,
      UserActions.ActionTypes.CHANGED,
    ).pipe(
      // always hide loader when finally updating user state
      tap(
      _ => {
        this._progressService.toggleSpinner();
      } ));

  // Any startWith observables - Should always BE LAST!
  @Effect()
  init$: Observable<Action> =
    this._actions$
      .ofType( UserActions.ActionTypes.INIT )
      .pipe(
      startWith( new UserActions.InitAction() ),
      switchMap( ( action: UserActions.InitAction ) =>
        this._userService
          .getCurrentUser()
          .pipe(
          map( user => {
            if ( user ) {
              // get latest
              // TODO: use valid token
              this._userService.token = this._userService.getTokenHash(user.id);// 'admin-token';
              this._currentSavedNotes = user.notes;
              return new UserActions.RefreshUserAction( { id: user.id, user } );
            } else {
              // just ignore, no user
              return new AppActions.NoopAction();
            }
          } ),
          catchError(
          err => of( new UserActions.ApiErrorAction( err ) ) ),
    )));

  private _postingData: any; // used with create user chain
  private _currentScanAttendee: UserState.IRegisteredUser;
  private _currentSavedNotes: Array<UserState.IConferenceAttendeeNote>;

  constructor(
    public analytics: AnalyticsService,
    private _store: Store<ICoreState>,
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
