import { userReducer } from './user.reducer';
import { UserState } from '../states';
import { UserActions } from '../actions';
import { getMockUser } from '../../../testing';

describe('userReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = userReducer(undefined, action);
      expect(result).toEqual(UserState.initialState);
    });
  });

  describe('CHANGED', () => {
    it('should update user state', () => {
      const user = getMockUser();
      const action = new UserActions.ChangedAction({ current : <any>user });

      const result = userReducer(UserState.initialState, action);
      expect(result).toEqual({
        current : <any>user,
        errors : [],
      });
    });

    it('should only update user state with incoming changes and leave other user state as is', () => {
      const initialState = {
        current : getMockUser(),
        recipients : [<any>{ id : 1 }],
      };

      const action = new UserActions.ChangedAction({ current : null });

      const result = userReducer(<any>initialState, action);
      expect(result).toEqual({
        current : null,
        recipients : [<any>{ id : 1 }],
      });
    });
  });
});
