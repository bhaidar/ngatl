import {
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  StoreModule,
  Store,
} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  PNPTestingModule,
  MockAudioPlayer,
  MockFirebasePlatform,
  MockWindow,
} from '../../../testing';
import { AnalyticsService } from '../../analytics/services/analytics.service';
import { UIEffects } from '../../core/effects';
import { uiReducer } from '../../core/reducers';
import { WindowService } from '../../core/services/window.service';
import {
  PlatformLanguageToken,
  FirebasePlatformToken,
} from '../../core/tokens';
import { IAppState } from '../../ngrx';
import { AudioActions } from '../actions';
import { AudioEffects } from '../effects';
import { audioReducer } from '../reducers';
import {
  AudioPlayer,
  AudioService,
} from './audio.service';

const url = 'https://domain.com/audio.mp3';
const loadPlayLog = `loaded and play: ${url}`;

const progressState = function (enabled: boolean = false) {
  return {
    page : {
      enabled,
    },
  };
};

describe('core: AudioService', () => {
  let audioService: AudioService = null;
  let store: Store<IAppState> = null;

  beforeEach(() => {
    spyOn(console, 'log');
    TestBed.configureTestingModule({
      imports : [
        StoreModule.forRoot({
          audio : audioReducer,
          ui : uiReducer,
        }),
        EffectsModule.forRoot([
          AudioEffects,
          UIEffects
        ]),
        PNPTestingModule,
      ],
      providers : [
        AnalyticsService,
        AudioService,
        {
          provide : WindowService,
          useClass : MockWindow,
        },
        {
          provide : PlatformLanguageToken,
          useValue : 'en',
        },
        {
          provide : FirebasePlatformToken,
          useValue : MockFirebasePlatform,
        },
        {
          provide : AudioPlayer,
          useClass : MockAudioPlayer,
        },
      ],
    });
    audioService = TestBed.get(AudioService);
    store = TestBed.get(Store);
  });

  it(
    'play',
    fakeAsync(() => {
      let result = null;
      let uiResult = null;
      store.select(
        s => s.audio)
           .subscribe(
             state => (result = state));
      store.select(
        s => s.ui)
           .subscribe(
             state => (uiResult = state));
      tick();
      expect(result).toEqual({
        url : null,
        playing : false,
      });

      store.dispatch(
        new AudioActions.TogglePlayAction({
          url,
        }),
      );
      tick();
      expect(result).toEqual({
        url,
        playing : true,
      });
      expect(uiResult.progressIndicator).toEqual(progressState(true));

      // should load and auto toggle off spinner
      tick(500);
      expect(uiResult.progressIndicator).toEqual(progressState());
      expect(console.log).toHaveBeenCalledWith(loadPlayLog);
    }),
  );

  it(
    'stop',
    fakeAsync(() => {
      let result = null;
      store.select(
        s => s.audio)
           .subscribe(
             state => (result = state));
      tick();
      expect(result).toEqual({
        url : null,
        playing : false,
      });
      store.dispatch(new AudioActions.PlayAction(url));
      tick(500);
      expect(result).toEqual({
        url,
        playing : true,
      });
      expect(console.log).toHaveBeenCalledWith(loadPlayLog);

      store.dispatch(new AudioActions.StopAction());
      tick();
      expect(result).toEqual({
        url,
        playing : false,
      });

      expect(console.log).toHaveBeenCalledWith('stop');
    }),
  );

  it(
    'cleanup',
    fakeAsync(() => {
      let result = null;
      store.select(
        s => s.audio)
           .subscribe(
             state => (result = state));
      tick();
      expect(result).toEqual({
        url : null,
        playing : false,
      });
      store.dispatch(new AudioActions.PlayAction(url));
      tick(500);
      expect(result).toEqual({
        url,
        playing : true,
      });
      expect(console.log).toHaveBeenCalledWith(loadPlayLog);

      store.dispatch(new AudioActions.CleanupAction());
      tick();
      expect(result).toEqual({
        url : null,
        playing : false,
      });

      expect(console.log).toHaveBeenCalledWith('cleanup');
    }),
  );
});
