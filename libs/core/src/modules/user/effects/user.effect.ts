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
  // @Effect()
  // checkEmail$: Observable<Action> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.CHECK_EMAIL)
  //       .withLatestFrom(this._store)
  //       .map(([action, state]: [UserActions.CheckEmailAction, IAppState]) => {
  //         let alreadyChecked = false;
  //         if ( state.user.reservedEmails ) {
  //           // prevents repetitive api calls to check for existence of previously entered email
  //           alreadyChecked = !!state.user.reservedEmails.find(
  //             email => email === action.payload);
  //         }
  //         if ( alreadyChecked ) {
  //           return new UserActions.ChangedAction({
  //             reservedEmails : [...(state.user.reservedEmails || [])],
  //             emailAvailable : null,
  //             errors : [],
  //           });
  //         } else {
  //           return new UserActions.SearchAction(action.payload);
  //         }
  //       });

  // @Effect()
  // searchEmail$: Observable<Action> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.SEARCH)
  //       .withLatestFrom(this._store)
  //       .switchMap(([action, state]: [UserActions.SearchAction, IAppState]) => {
  //         this._progressService.toggleSpinner(true);
  //         return this._userService
  //                    .emailIsAvailable(action.payload)
  //                    .map(
  //                      reservedEmails => {
  //                        if ( reservedEmails && reservedEmails.length ) {
  //                          // continue keeping track of emails already found
  //                          return new UserActions.ChangedAction({
  //                            reservedEmails : [
  //                              /* only track usernames, not id (security) */
  //                              ...reservedEmails.map(
  //                                u => u.username),
  //                              ...(state.user.reservedEmails || [])
  //                            ],
  //                            emailAvailable : null,
  //                            errors : [],
  //                          });
  //                        } else {
  //                          return new UserActions.ChangedAction({
  //                            emailAvailable : action.payload,
  //                            errors : [],
  //                          });
  //                        }
  //                      })
  //                    .catch(
  //                      err => Observable.of(new UserActions.ApiErrorAction(err)));
  //       });

  // @Effect()
  // emailConnect$: Observable<Action> =
  // this._actions$
  //   .ofType( UserActions.ActionTypes.EMAIL_CONNECT )
  //   .switchMap( ( action: UserActions.EmailConnectAction ) => {

  //     // Make sureforgotPaswordSent state is false when submitting the form
  //     // Also clear errors so when the Store first fires, we don't get the invaalertlid password
  //     this._store.dispatch( new UserActions.ChangedAction( {
  //       forgotPasswordSent: false,
  //       errors: []
  //     } ) );

  //     this._progressService.toggleSpinner( true );
  //     return this._userService
  //       .emailConnect( {
  //         email: action.payload.username,
  //         password: action.payload.password,
  //       } )
  //       .map( ( response: any ) => {
  //         console.log( 'this._userService.emailConnect' );
  //         for ( const key in response ) {
  //           console.log( key, response[key] );
  //         }
  //         if ( response && response.token ) {
  //           const token = response.token;
  //           this._userService.token = token;
  //           if ( response.user ) {
  //             const userId = response.user.id;
  //             return new UserActions.LoginAction( userId );
  //           } else {
  //             // extra protection against possible null/undefined
  //             // could happen if api call goes out midstream
  //             // could use i18n token here but for now, this will help
  //             return new UserActions.LoginFailedAction( 'User not found.' );
  //           }
  //         } else {
  //           return new UserActions.LoginFailedAction( 'User not found.' );
  //         }
  //       } )
  //       .catch(
  //       err => Observable.of( new UserActions.LoginFailedAction( err ) ) );
  //   } );

  // @Effect()
  // firebaseConnect$: Observable<Action> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.FIREBASE_CONNECT)
  //       .switchMap((action: UserActions.FireBaseConnectAction) => {
  //         this._progressService.toggleSpinner(true);
  //         return this._userService
  //                    .firebaseConnect(action.payload)
  //                    .map((response: any) => {
  //                      if ( response && response.token ) {
  //                        const token = response.token;
  //                        this._userService.token = token;
  //                        // web/mobile set the analytics social auth signUpMethod, therefore just ensure internal
  //                        // reference is updated based on that here
  //                        this.signUpMethod = this.analytics.signUpMethod;
  //                        let userId;
  //                        if ( response.user ) {
  //                          // TODO: this is what we want ONLY
  //                          userId = response.user.id;
  //                        } else {
  //                          // but for now manually decode ourselves
  //                          const decodedToken = decodeToken(token);
  //                          if ( decodedToken ) {
  //                            userId = decodedToken.id;
  //                            if ( !this._signUpMethod ) {
  //                              this.signUpMethod = decodedToken.providerName;
  //                            }
  //                          }
  //                        }
  //                        return new UserActions.LoginAction(userId);
  //                      }
  //                    })
  //                    .catch(
  //                      err => Observable.of(new UserActions.LoginFailedAction(err)));
  //       });

  // @Effect()
  // create$: Observable<any> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.CREATE)
  //       .switchMap((action: UserActions.CreateAction) => {
  //         this._progressService.toggleSpinner(true);
  //         this._postingData = action.payload;
  //         return this._userService.emailIsAvailable(this._postingData.email);
  //       })
  //       .map(
  //         reservedEmails => {
  //           if ( reservedEmails && reservedEmails.length ) {
  //             return new UserActions.ApiErrorAction('An account already exists with that email address'); // TODO
  //           } else {
  //             return new UserActions.CreateFinishAction(this._postingData);
  //           }
  //         })
  //       .catch(
  //         err => Observable.of(new UserActions.ApiErrorAction(err)));

  // @Effect()
  // createFinish$: Observable<any> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.CREATE_FINISH)
  //       .switchMap((action: UserActions.CreateFinishAction) =>
  //         this._userService
  //             .createUser(action.payload)
  //             .map(
  //           user => {
  //             console.log( UserActions.CreateFinishAction );
  //             console.log( user );
  //             for ( const key in user ) {
  //               console.log( key, user[key] );
  //             }
  //                 this._postingData = null; // just clear since no longer needed
  //                 // this._userService.token = user.authenticationToken;
  //                 // this.track(Tracking.Actions.SIGN_UP, {
  //                 //   user_id : user.id.toString(),
  //                 //   sign_up_method : this._signUpMethod || 'Unknown',
  //                 // });
  //                 return new UserActions.LoginSuccessAction( new SystemUser( {
  //                   id: (<any>user).id,
  //                   email: user.email,
  //                   username: user.email,
  //                   firstName: user.firstName,
  //                   lastName: user.lastName,
  //                 }));
  //               })
  //             .catch(
  //               err => Observable.of(new UserActions.ApiErrorAction(err))),
  //       );

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
          this._userService.token = 'admin-token';
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

  // @Effect()
  // forgotPassword$: Observable<Action> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.FORGOT_PASSWORD)
  //       .switchMap((action: UserActions.ForgotPasswordAction) =>
  //         this._userService
  //             .forgotPasswordRequest(action.payload)
  //             .map(
  //               _ =>
  //                 new UserActions.ChangedAction({
  //                   forgotPasswordSent : true,
  //                   errors : [],
  //                 }),
  //             )
  //             .catch(
  //               err => Observable.of(new UserActions.ApiErrorAction(err))),
  //       );

  // @Effect()
  // updatePassword$: Observable<Action> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.UPDATE_PASSWORD)
  //       .withLatestFrom(this._store)
  //       .switchMap(([action, state]: [UserActions.UpdatePasswordAction, IAppState]) => {
  //         this._progressService.toggleSpinner(true);
  //         return this._userService
  //                    .updatePasswordRequest(
  //                      action.payload.token,
  //                      action.payload.confirmPassword,
  //                      action.payload.plainPassword,
  //                    )
  //                    .map(
  //                      _ => {
  //                        return new UserActions.ChangedAction({
  //                          updatePasswordSent : true,
  //                          errors : [],
  //                        });
  //                      })
  //                    .catch(
  //                      err => Observable.of(new UserActions.ApiErrorAction(err)));
  //       });

  // @Effect()
  // modifyPassword$: Observable<Action> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.MODIFY_PASSWORD)
  //       .withLatestFrom(this._store)
  //       .switchMap(([action, state]: [UserActions.ModifyPasswordAction, IAppState]) => {
  //         this._progressService.toggleSpinner(true);
  //         return this._userService
  //                    .emailConnect(state.user.current.email, action.payload.oldPassword)
  //                    .map((response: any) => {
  //                      if ( response && response.token ) {
  //                        const token = response.token;
  //                        this._userService.token = token;
  //                        return new UserActions.ModifyPasswordVerificationSuccessAction(action.payload.newPassword);
  //                      }
  //                    })
  //                    .catch(
  //                      err => Observable.of(new UserActions.ApiErrorAction(err)));
  //       });

  // @Effect()
  // modifyPasswordVerificationSuccess$: Observable<Action> =
  //   this._actions$
  //       .ofType(UserActions.ActionTypes.MODIFY_PASSWORD_VERIFICATION_SUCCESS)
  //       .withLatestFrom(this._store)
  //       .map(([action, state]: [UserActions.ModifyPasswordVerificationSuccessAction, IAppState]) => {
  //         state.user.current.plainPassword = action.payload;
  //         return new UserActions.UpdateAction(state.user.current);
  //       });

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

  // @Effect()
  // delete$: Observable<Action> =
  //   this._actions$.ofType(UserActions.ActionTypes.DELETE)
  //     .switchMap(
  //       (action: UserActions.DeleteAction) => {
  //         this._progressService.toggleSpinner(true);
  //         return this._userService
  //           .deleteUser(`${action.payload}`)
  //           .map(user => {
  //             // https://docs.google.com/document/d/1pE4d0YEvBxax4cq4EMkt-N74Fog1V2_rysI8h_v5jWM/edit#
  //             this.analytics.track(Tracking.Actions.BUTTON_CLICK, {
  //               category : Tracking.Categories.BUTTONS,
  //               button_name : `myaccount_delete`,
  //             });

  //             return new UserActions.LogoutAction();
  //           })
  //           .catch(err => Observable.of(new UserActions.LoginFailedAction(err)));
  //       });

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
   * Handle all other action API_ERROR's here to ensure 401's are handled consistently
   */
  // @Effect()
  // errorHandler$: Observable<Action> =
  //   this._actions$
  //     .ofType(
  //       AbTestActions.ActionTypes.API_ERROR,
  //       CatalogActions.ActionTypes.API_ERROR,
  //       CartActions.ActionTypes.API_ERROR,
  //       FormActions.ActionTypes.API_ERROR,
  //       ReactionRecorderActions.ActionTypes.API_ERROR,
  //     )
  //     .map(
  //       (action: AbTestActions.ApiErrorAction | CatalogActions.ApiErrorAction | CartActions.ApiErrorAction | FormActions.ApiErrorAction | ReactionRecorderActions.ApiErrorAction) => {
  //         this._log.debug('errorHandler$ fired, checking status...');
  //         const status = getErrorStatus(action.payload);
  //         this._log.debug('status:', status);
  //         if ( status === 401 ) {
  //           return new UserActions.UnauthorizedAction();
  //         } else {
  //           if ( status === 0 ) {
  //             // likely user went offline or api is unreachable, alert user so not left in dark
  //             this._userService.alertErrorMessage(this._userService.translateService.instant(
  //               'generic.connection-error-lbl'));
  //           }
  //           return new AppActions.NoopAction();
  //         }
  //       })
  //     .catch(err => Observable.of(new AppActions.NoopAction()));

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

  // @Effect()
  // initCurrentAndLoadScanned$: Observable<Action> =
  //   this._actions$
  //     .ofType( UserActions.ActionTypes.INIT_CURRENT_LOAD_SCANNED )
  //     .switchMap( ( action: UserActions.InitCurrentAndLoadScannedAction ) => {

  //       this._progressService.toggleSpinner();
  //       return this._userService.loadAll()
  //         .map( ( result: UserState.ILoadAllResult ) => {// Array<UserState.IRegisteredUser>) => {
  //           this._progressService.toggleSpinner( false );
  //           return new UserActions.ChangedAction( {
  //             current: action.payload,
  //             // all: result.all,
  //             scanned: result.scanned,
  //           } );
  //         } )
  //         .catch( ( err ) => {
  //           return Observable.of( new UserActions.LoginFailedAction( err ) );
  //         } );
  //     } );

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
            if ( foundUser ) {
              if ( state.user.current ) {
                // authenticated
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
                this._win.alert( this._translate.instant( 'user.already-scanned' ) );
              }, 300 );
              return new AppActions.NoopAction();
            }
          } )
          .catch( ( err ) => Observable.of( new UserActions.LoginFailedAction( err ) ) );

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
          if ( alreadyScanned ) {
            this._win.setTimeout( _ => {
              this._win.alert( this._translate.instant( 'user.already-scanned' ) );
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
            if ( result && result.notes && ( this._currentScanAttendee || this._currentSavedNotes ) ) {
              // update with appropriate name
              // TODO: won't need this when Bram can add name in there
              for ( let i = 0; i < result.notes.length; i++ ) {
                if ( this._currentScanAttendee ) {
                  if ( result.notes[i].peerAttendeeId === this._currentScanAttendee.id ) {
                    result.notes[i].name = this._currentScanAttendee.name;
                    break;
                  }
                } else if ( this._currentSavedNotes && this._currentSavedNotes.length ) {
                  const savedNote = this._currentSavedNotes.find( n => n.id === result.notes[i].id );
                  if ( savedNote ) {
                    // ensure names are preserved
                    result.notes[i].peer.name = savedNote.peer.name;
                  }
                }
              }
            }
            this._currentScanAttendee = this._currentSavedNotes = null; // reset
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
          this._userService.deleteAttendeeNote( note.id )
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
              this._userService.token = 'admin-token';
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
