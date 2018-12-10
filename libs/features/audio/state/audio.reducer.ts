import { AudioActions } from './audio.action';
import { AudioState } from './audio.state';

export function audioReducer(
  state: AudioState.IState = AudioState.initialState,
  action: AudioActions.Actions
): AudioState.IState {
  const changeState = (customPayload?: any) => {
    return Object.assign({}, state, customPayload || action.payload);
  };
  switch (action.type) {
    case AudioActions.Types.CHANGED:
      return changeState();
    default:
      return state;
  }
}
