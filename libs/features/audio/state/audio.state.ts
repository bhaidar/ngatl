import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICoreState } from '@ngatl/core/state';

export namespace AudioState {
  export interface IFeatureState extends ICoreState {
    audio: IState;
  }

  export interface IState {
    playing: boolean;
    url?: string;
  }

  export const initialState: IState = {
    playing: false,
    url: null
  };

  export const selectState = createFeatureSelector<IState>('audio');
  export const selectPlaying = createSelector(
    selectState,
    (state: IState) => state.playing
  );
}
