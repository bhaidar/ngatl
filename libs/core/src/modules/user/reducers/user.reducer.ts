import { UserState } from '../states';
import { UserActions } from '../actions';

export function userReducer(
  state: UserState.IState = UserState.initialState,
  action: UserActions.Actions,
): UserState.IState {
  const changeState = (customPayload?: any) => {
    return Object.assign({}, state, customPayload || action.payload);
  };
  switch ( action.type ) {
    case UserActions.ActionTypes.CHANGED:
      return changeState();
    default:
      return state;
  }
}
