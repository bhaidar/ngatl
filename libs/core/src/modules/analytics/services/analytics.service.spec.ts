import { TestBed, } from '@angular/core/testing';
// app
import { Tracking } from '../../helpers';
import {
  LogService,
  WindowService,
} from '../../core/services';
import { FirebasePlatformToken } from '../../core/tokens';
import { AnalyticsService, } from './index';
import {
  PNPTestingModule,
  MockFirebaseNativeScriptPlatform,
  MockWindow,
} from '../../../testing';

let analyticsService: AnalyticsService = null;
let logService: LogService = null;
let winService: WindowService = null;

const configModule = function (token?: any) {
  spyOn(console, 'log');
  LogService.DEBUG.LEVEL_5 = true; // only allow analytics to flow through log

  const provideToken: any = {
    provide : FirebasePlatformToken,
  };

  if ( token ) {
    provideToken.useClass = token;
  } else {
    provideToken.useValue = {};
  }

  TestBed.configureTestingModule({
    imports : [PNPTestingModule],
    providers : [
      LogService,
      {
        provide : WindowService,
        useClass : MockWindow,
      },
      provideToken,
      AnalyticsService,
    ],
  });
  analyticsService = TestBed.get(AnalyticsService);
  logService = TestBed.get(LogService);
  winService = TestBed.get(WindowService);
};

const gtmDefaults = {
  // GTM defaults
  page_name : '/',
  app_version : null,
  sign_up_method : null,
  zone_id : null,
  user_id : null,
};
const gtmKeyValues = [];
for ( const key in gtmDefaults ) {
  gtmKeyValues.push({
    key,
    value : gtmDefaults[key],
  });
}

describe('analytics: AnalyticsService', () => {
  afterEach(() => {
    LogService.DEBUG.LEVEL_4 = true; // reset
  });

  describe('web implementation (assuming firebase web sdk)', () => {
    beforeEach(() => {
      configModule();
    });

    it('track', () => {
      analyticsService.track('Web app version:', {
        category : 'App Version',
        label : '1.0.0',
      });
      expect(winService.dataLayer).toEqual([
        Object.assign({}, gtmDefaults, {
          category : 'App Version',
          event : 'Web app version:',
          label : '1.0.0',
          page_name : '/',
        }),
      ]);
    });

    it('pageTrack', () => {
      analyticsService.pageTrack('/catalog');
      expect(winService.dataLayer).toEqual([{ event : 'openScreen' }]);
    });

    it('setContent', () => {
      analyticsService.setContent('anyKey', 'anyValue');
      expect(winService.dataLayer).toEqual([{ anyKey : 'anyValue' }]);
    });

    it('identify', () => {
      analyticsService.identify({
        key : 'user_id',
        value : '1',
      });
      expect(winService.dataLayer).toEqual([{ user_id : '1' }]);
    });

    it('devMode should silence everything', () => {
      analyticsService.devMode(true);

      analyticsService.track('Web app version:', {
        category : 'App Version',
        label : '1.0.0',
      });
      analyticsService.pageTrack('/catalog');
      analyticsService.setContent('anyKey', 'anyValue');
      analyticsService.identify({
        key : 'user_id',
        value : '1',
      });
    });
  });

  describe('native mobile implementation (assuming {N}-firebase plugin)', () => {
    beforeEach(() => {
      configModule(MockFirebaseNativeScriptPlatform);
    });

    it('track', () => {
      analyticsService.track('Native app version:', {
        category : 'App Version',
        label : '1.0.0',
      });
      expect(console.log).toHaveBeenCalledWith({
        key : 'Native app version:',
        parameters : [
          {
            key : 'category',
            value : 'App Version',
          },
          {
            key : 'label',
            value : '1.0.0',
          },
          ...gtmKeyValues
        ],
      });
    });

    it('identify', () => {
      analyticsService.identify({
        key : 'user_id',
        value : '1',
      });
      expect(console.log)
        .toHaveBeenCalledWith({
          key : 'user_id',
          value : '1',
        });
    });

    it('devMode should silence everything', () => {
      analyticsService.devMode(true);

      analyticsService.track(Tracking.Actions.SET_USER_PROPERTIES_SESSION, {
        category : Tracking.Categories.APP_VERSION,
        label : '1.0.0',
      });
      analyticsService.pageTrack('/catalog');
      analyticsService.setContent('anyKey', 'anyValue');
      analyticsService.identify({
        key : 'user_id',
        value : '1',
      });
      expect(console.log).toHaveBeenCalledTimes(0);
    });
  });
});
