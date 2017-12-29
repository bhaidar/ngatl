import {
  TestBed,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  StoreModule,
  Store,
} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AnalyticsService } from '../../analytics/services/analytics.service';
import { ProgressIndicatorActions } from '../actions';
import { UIEffects } from '../effects';
import { uiReducer } from '../reducers';
import { ProgressIndicatorState } from '../states';
import { FirebasePlatformToken, } from '../tokens';
import { ProgressService, } from './index';
import {
  PNPTestingModule,
  MockFirebasePlatform,
} from '../../../testing';
import { IAppState } from '../../ngrx';

const stateResult = function (
  enabled?: boolean,
  details?: { progress?: number; message?: string },
  elements?: Array<ProgressIndicatorState.IElementProgress>,
) {
  const progressState: ProgressIndicatorState.IState = {
    page : {
      enabled : typeof enabled === 'undefined' ? false : enabled,
    },
  };
  if ( details ) {
    for ( const key in details ) {
      progressState.page[key] = details[key];
    }
  }
  if ( elements ) {
    progressState.elements = elements;
  }
  return {
    modal : { open : false },
    progressIndicator : progressState,
    locale : 'en',
  };
};

describe('core: ProgressService', () => {
  let progressService: ProgressService = null;
  let store: Store<IAppState> = null;

  describe('reactive loader', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports : [
          StoreModule.forRoot({
            ui : uiReducer,
          }),
          EffectsModule.forRoot([UIEffects]),
          TestingModule,
        ],
        providers : [
          AnalyticsService,
          {
            provide : FirebasePlatformToken,
            useValue : MockFirebasePlatform,
          },
        ],
      });
      spyOn(console, 'log');
    });

    beforeEach(
      inject(
        [
          ProgressService,
          Store,
        ],
        (
          _progressService: ProgressService,
          _store: Store<IAppState>,
        ) => {
          progressService = _progressService;
          store = _store;
        },
      ),
    );

    it(
      'show/hide',
      fakeAsync(() => {
        let result = null;
        store.select(
          s => s.ui)
             .subscribe(
               state => (result = state));
        tick();
        expect(result).toEqual(stateResult(false, null, []));

        store.dispatch(new ProgressIndicatorActions.ShowAction());
        tick();
        expect(result).toEqual(stateResult(true));

        store.dispatch(new ProgressIndicatorActions.HideAction());
        tick();
        expect(result).toEqual(stateResult(false));
      }),
    );

    it(
      'show/hide with page details along with elements',
      fakeAsync(() => {
        let result = null;
        store.select(
          s => s.ui)
             .subscribe(
               state => (result = state));
        tick();
        expect(result).toEqual(stateResult(false, null, []));

        const elements = [
          {
            enabled : true,
            id : 'account-class',
          },
          {
            enabled : true,
            id : 'list-class',
          },
        ];
        store.dispatch(
          new ProgressIndicatorActions.ShowAction({
            page : {
              enabled : true,
              message : 'Loading...',
              progress : 56,
            },
            elements,
          }),
        );
        tick();
        expect(result).toEqual(
          stateResult(
            true,
            {
              message : 'Loading...',
              progress : 56,
            },
            elements,
          ),
        );

        elements[1].enabled = false;
        store.dispatch(
          new ProgressIndicatorActions.HideAction({
            page : { enabled : false },
            elements,
          }),
        );
        tick();
        expect(result).toEqual(stateResult(false, null, elements));
      }),
    );

    it(
      'toggleSpinner',
      fakeAsync(() => {
        let result = null;
        store.select(
          s => s.ui)
             .subscribe(
               state => (result = state));
        tick();
        expect(result).toEqual(stateResult(false, null, []));

        progressService.toggleSpinner(true);
        tick();
        expect(result).toEqual(stateResult(true));

        progressService.toggleSpinner();
        tick();
        expect(result).toEqual(stateResult(false));

        progressService.toggleSpinner(true, { message : 'Loading...' });
        tick();
        expect(result).toEqual(stateResult(true, { message : 'Loading...' }));

        progressService.toggleSpinner();
        tick();
        expect(result).toEqual(stateResult(false));
      }),
    );
  });
});
