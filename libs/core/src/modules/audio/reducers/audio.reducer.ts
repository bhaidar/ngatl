import { AudioActions } from '../actions';
import { AudioState } from '../states';

export function audioReducer(
  state: AudioState.IState = AudioState.initialState,
  action: AudioActions.Actions,
): AudioState.IState {
  const changeState = (customPayload?: any) => {
    return Object.assign({}, state, customPayload || action.payload);
  };
  switch ( action.type ) {
    case AudioActions.ActionTypes.CHANGED:
      return changeState();
    default:
      return state;
  }
}
