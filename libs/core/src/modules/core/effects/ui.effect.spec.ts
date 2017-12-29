import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { StoreModule } from '@ngrx/store';

import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  PNPTestingModule,
  TestComponent,
  MockFirebasePlatform,
} from '../../../testing';
import { AnalyticsService } from '../../analytics/services/analytics.service';
import {
  ModalPlatformService,
  ModalService,
} from '../services';
import {
  ModalActions,
  ProgressIndicatorActions,
  UIActions,
} from '../actions';
import { uiReducer } from '../reducers';
import { ProgressIndicatorState } from '../states';
import {
  PlatformLanguageToken,
  FirebasePlatformToken,
} from '../tokens';
import { UIEffects } from './ui.effect';
import { LocaleActions } from '../actions/locale.action';
import { MockWindow } from '../../../testing/services/window.mock';

let actions: Observable<any>;
class TestPlatformModalService implements ModalPlatformService {
  public open(
    cmpType: any,
    options?: any,
  ) {
    console.log(cmpType);
  }
}

const configModule = function (langToken?: string) {
  TestBed.configureTestingModule({
    imports : [
      StoreModule.forRoot({
        ui : uiReducer,
      }),
      PNPTestingModule,
    ],
    providers : [
      AnalyticsService,
      UIEffects,
      provideMockActions(() => actions),
      {
        provide : ModalService,
        useValue : jasmine.createSpyObj(
          'modalService',
          [
            'open',
            'close',
          ],
        ),
      },
      {
        provide : PlatformLanguageToken,
        useValue : langToken,
      },
      {
        provide : FirebasePlatformToken,
        useValue : MockFirebasePlatform,
      },
    ],
  });
  spyOn(console, 'log');
};

const setup = function (params?: { openReturnValue?: any; closeReturnValue?: any }) {
  const modalService = TestBed.get(ModalService);
  if ( params ) {
    if ( params.openReturnValue ) {
      modalService.open.and.returnValue(params.openReturnValue);
    }
    if ( params.closeReturnValue ) {
      modalService.close.and.returnValue(params.closeReturnValue);
    }
  }

  return {
    runner : actions = new ReplaySubject(1),
    uiEffects : TestBed.get(UIEffects),
  };
};

describe('core: UIEffects.', () => {
  afterEach(() => {
    MockWindow.resetCache();
  });
  describe('Locale for en', () => {
    beforeEach(() => {
      configModule('en');
    });
    it(
      'localeInit$',
      fakeAsync(() => {
        const { runner, uiEffects } = setup();

        runner.next(new LocaleActions.InitAction());

        let result = null;
        uiEffects.localeInit$.subscribe(
          _result => (result = _result));
        tick();
        expect(result).toEqual(new LocaleActions.SetAction('en'));
      }),
    );
  });

  describe('Locale for fr', () => {
    beforeEach(() => {
      configModule('fr');
    });
    it(
      'localeInit$',
      fakeAsync(() => {
        const { runner, uiEffects } = setup();

        runner.next(new LocaleActions.InitAction());

        let result = null;
        uiEffects.localeInit$.subscribe(
          _result => (result = _result));
        tick();
        expect(result).toEqual(new LocaleActions.SetAction('fr'));
      }),
    );
  });

  describe('Locale should handle fr-CA', () => {
    beforeEach(() => {
      configModule('fr-CA');
    });
    it(
      'localeInit$',
      fakeAsync(() => {
        const { runner, uiEffects } = setup();

        runner.next(new LocaleActions.InitAction());

        let result = null;
        uiEffects.localeInit$.subscribe(
          _result => (result = _result));
        tick();
        expect(result).toEqual(new LocaleActions.SetAction('fr'));
      }),
    );
  });

  describe('Locale for undefined', () => {
    beforeEach(() => {
      configModule();
    });
    it(
      'localeInit$',
      fakeAsync(() => {
        const { runner, uiEffects } = setup();

        runner.next(new LocaleActions.InitAction());

        let result = null;
        uiEffects.localeInit$.subscribe(
          _result => (result = _result));
        tick();
        expect(result).toEqual(new LocaleActions.SetAction('en'));
      }),
    );
  });

  describe('Locale set', () => {
    beforeEach(() => {
      configModule();
    });
    it(
      'localeSet$',
      fakeAsync(() => {
        const { runner, uiEffects } = setup();

        const expectedResult = new LocaleActions.SetSuccessAction('fr');
        runner.next(new LocaleActions.SetAction('fr'));

        let result = null;
        uiEffects.localeSet$.subscribe(
          _result => (result = _result));
        tick();
        expect(result).toEqual(expectedResult);
      }),
    );
  });

  describe('Locale set success', () => {
    beforeEach(() => {
      configModule();
    });
    it(
      'localeSetSuccess$',
      fakeAsync(() => {
        const { runner, uiEffects } = setup();

        const expectedResult = new UIActions.ChangedAction({
          locale : 'fr',
        });
        runner.next(new LocaleActions.SetSuccessAction('fr'));

        let result = null;
        uiEffects.localeSetSuccess$.subscribe(
          _result => (result = _result));
        tick();
        expect(result).toEqual(expectedResult);
      }),
    );
  });

  describe('Modal:', () => {
    beforeEach(() => {
      configModule('en');
    });
    describe('modalOpen$', () => {
      it(
        'should return ModalActions.OpenedAction',
        fakeAsync(() => {
          const title = 'Login with...';
          const expectedState = {
            open : true,
            cmpType : TestComponent,
            title,
            latestResult : null,
          };
          const { runner, uiEffects } = setup({
            openReturnValue : {
              open : expectedState.open,
              cmpType : expectedState.cmpType,
              trackTitle : title,
              latestResult : null,
            },
          });

          const expectedResult = new ModalActions.OpenedAction(expectedState);
          runner.next(
            new ModalActions.OpenAction({
              cmpType : TestComponent,
              props : { trackTitle : title },
            }),
          );

          let result = null;
          uiEffects.modalOpen$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );
    });

    describe('modalOpened$', () => {
      it(
        'should return UIActions.ChangedAction',
        fakeAsync(() => {
          const payload = {
            open : true,
            cmpType : TestComponent,
          };
          const expectedResult = new UIActions.ChangedAction({
            modal : payload,
          });
          const { runner, uiEffects } = setup();
          runner.next(new ModalActions.OpenedAction(payload));

          let result = null;
          uiEffects.modalOpened$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );
    });

    describe('modalClose$', () => {
      it(
        'should return ModalActions.ClosedAction',
        fakeAsync(() => {
          const payload = {
            open : false,
            cmpType : null,
            title : null,
            latestResult : null,
          };
          const expectedResult = new ModalActions.ClosedAction(payload);
          const { runner, uiEffects } = setup({
            closeReturnValue : null,
          });
          runner.next(new ModalActions.CloseAction());

          let result = null;
          uiEffects.modalClose$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );

      it(
        'should return ModalActions.ClosedAction with results',
        fakeAsync(() => {
          const payload = {
            open : false,
            cmpType : null,
            title : null,
            latestResult : 'testing results',
          };
          const expectedResult = new ModalActions.ClosedAction(payload);
          const { runner, uiEffects } = setup({
            closeReturnValue : 'testing results',
          });
          runner.next(new ModalActions.CloseAction('testing resultsd'));

          let result = null;
          uiEffects.modalClose$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );

      it(
        'should return ModalActions.ClosedAction and handle mobile specific needs',
        fakeAsync(() => {
          const mobileCloseResult = {
            params : {
              closeCallback : () => {},
            },
            value : 'test',
          };
          const payload = {
            open : false,
            cmpType : null,
            title : null,
            latestResult : 'test',
          };
          const expectedResult = new ModalActions.ClosedAction(payload);
          const { runner, uiEffects } = setup({
            closeReturnValue : 'test',
          });
          runner.next(new ModalActions.CloseAction(mobileCloseResult));

          let result = null;
          uiEffects.modalClose$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );
    });

    describe('modalClosed$', () => {
      it(
        'should return UIActions.ChangedAction',
        fakeAsync(() => {
          const payload = {
            open : false,
            cmpType : null,
            title : null,
          };
          const expectedResult = new UIActions.ChangedAction({
            modal : payload,
          });
          const { runner, uiEffects } = setup();
          runner.next(new ModalActions.ClosedAction(payload));

          let result = null;
          uiEffects.modalClosed$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );
    });
  });

  describe('Progress Indicators:', () => {
    beforeEach(() => {
      configModule('en');
    });
    describe('progressShow$ for page', () => {
      it(
        'should return UIActions.ChangedAction',
        fakeAsync(() => {
          const payload: ProgressIndicatorState.IState = {
            page : {
              enabled : true,
            },
          };
          const { runner, uiEffects } = setup();

          const expectedResult = new UIActions.ChangedAction({
            progressIndicator : payload,
          });
          runner.next(new ProgressIndicatorActions.ShowAction(payload));

          let result = null;
          uiEffects.progressShow$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );

      it(
        'should work with no payload to default page level handling',
        fakeAsync(() => {
          const { runner, uiEffects } = setup();

          const expectedResult = new UIActions.ChangedAction({
            progressIndicator : {
              page : {
                enabled : true,
              },
            },
          });
          runner.next(new ProgressIndicatorActions.ShowAction());

          let result = null;
          uiEffects.progressShow$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );

      it(
        'should handle message',
        fakeAsync(() => {
          const payload: ProgressIndicatorState.IState = {
            page : {
              enabled : true,
              message : 'testing',
            },
          };
          const { runner, uiEffects } = setup();

          const expectedResult = new UIActions.ChangedAction({
            progressIndicator : payload,
          });
          runner.next(new ProgressIndicatorActions.ShowAction(payload));

          let result = null;
          uiEffects.progressShow$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );
    });

    describe('progressHide$ for page', () => {
      it(
        'should return UIActions.ChangedAction',
        fakeAsync(() => {
          const payload: ProgressIndicatorState.IState = {
            page : {
              enabled : false,
            },
          };
          const { runner, uiEffects } = setup();

          const expectedResult = new UIActions.ChangedAction({
            progressIndicator : payload,
          });
          runner.next(new ProgressIndicatorActions.HideAction(payload));

          let result = null;
          uiEffects.progressHide$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );

      it(
        'should work with no payload to default page level handling',
        fakeAsync(() => {
          const { runner, uiEffects } = setup();

          const expectedResult = new UIActions.ChangedAction({
            progressIndicator : {
              page : {
                enabled : false,
              },
            },
          });
          runner.next(new ProgressIndicatorActions.HideAction());

          let result = null;
          uiEffects.progressHide$.subscribe(
            _result => (result = _result));
          tick();
          expect(result).toEqual(expectedResult);
        }),
      );
    });
  });
});
