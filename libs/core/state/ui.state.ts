import { createSelector } from '@ngrx/store';
import { LocaleState } from './locale.state';
import { ModalState } from './modal.state';
import { ProgressIndicatorState } from './progress-indicator.state';

export namespace UIState {
  export interface IState {
    locale?: LocaleState.Locale;
    modal?: ModalState.IState;
    progressIndicator?: ProgressIndicatorState.IState;
  }

  export const initialState: IState = {
    locale: null,
    modal: ModalState.initialState,
    progressIndicator: ProgressIndicatorState.initialState
  };

  export const selectUi = (state: any) => state.ui;
  export const selectModal = createSelector(
    selectUi,
    (state: IState) => state.modal
  );
  export const selectModalResult = createSelector(
    selectModal,
    (modal: ModalState.IState) => modal.latestResult
  );
  export const selectLocale = createSelector(
    selectUi,
    (state: IState) => state.locale
  );
  export const selectProgress = createSelector(
    selectUi,
    (state: IState) => state.progressIndicator
  );
}
