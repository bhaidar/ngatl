// libs
import { ActionReducer, combineReducers, Action } from '@ngrx/store';

// app
import { type, IAppState } from '@ngatl/core';

// various app module state
import { searchReducer } from '../search/reducers';
import { SearchState } from '../search/states';
import { speakerReducer } from '../speakers/reducers';
import { SpeakerState } from '../speakers/states';
import { sponsorReducer } from '../sponsors/reducers';
import { SponsorState } from '../sponsors/states';
import { eventReducer } from '../events/reducers';
import { EventState } from '../events/states';

// overall shape of app state
export interface IConferenceState {
  events: EventState.IState;
  search: SearchState.IState;
  speakers: SpeakerState.IState;
  sponsors: SponsorState.IState;
}

export interface IConferenceAppState extends IAppState {
  conference: IConferenceState;
}

export const reducers = {
  events: eventReducer,
  search: searchReducer,
  speakers: speakerReducer,
  sponsors: sponsorReducer,
};

