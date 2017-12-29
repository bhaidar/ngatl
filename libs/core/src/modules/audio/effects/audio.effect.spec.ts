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
  MockFirebasePlatform,
  MockAudioPlayer,
} from '../../../testing';
import { AnalyticsService } from '../../analytics/services/analytics.service';
import {
  AudioService,
  AudioPlayer,
} from '../services';
import { AudioActions } from '../actions';
import { audioReducer } from '../reducers';
import { UIEffects } from '../../core/effects';
import { uiReducer } from '../../core/reducers';
import {
  PlatformLanguageToken,
  FirebasePlatformToken,
} from '../../core/tokens';
import { AudioEffects } from './audio.effect';

let actions: Observable<any>;
const configModule = function (langToken?: string) {
  TestBed.configureTestingModule({
    imports : [
      StoreModule.forRoot({
        audio : audioReducer,
        ui : uiReducer,
      }),
      PNPTestingModule,
    ],
    providers : [
      AnalyticsService,
      AudioEffects,
      UIEffects,
      provideMockActions(() => actions),
      AudioService,
      {
        provide : AudioPlayer,
        useClass : MockAudioPlayer,
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

const setup = function () {
  return {
    runner : actions = new ReplaySubject(1),
    audioEffects : TestBed.get(AudioEffects),
  };
};

const url = 'https://domain.com/audio.mp3';

describe('audio: AudioEffects.', () => {
  beforeEach(() => {
    configModule('en');
  });

  it(
    'togglePlay$',
    fakeAsync(() => {
      const { runner, audioEffects } = setup();

      runner.next(
        new AudioActions.TogglePlayAction({
          url,
        }),
      );

      let result = null;
      audioEffects.togglePlay$.subscribe(
        _result => (result = _result));
      tick();
      expect(result).toEqual(
        new AudioActions.ChangedAction({
          url,
          playing : true,
        }),
      );
    }),
  );

  it(
    'play$',
    fakeAsync(() => {
      const { runner, audioEffects } = setup();

      runner.next(new AudioActions.PlayAction(url));

      let result = null;
      audioEffects.play$.subscribe(
        _result => (result = _result));
      tick();
      expect(result).toEqual(
        new AudioActions.ChangedAction({
          url,
          playing : true,
        }),
      );
    }),
  );

  it(
    'stop$',
    fakeAsync(() => {
      const { runner, audioEffects } = setup();

      runner.next(new AudioActions.StopAction());

      let result = null;
      audioEffects.stop$.subscribe(
        _result => (result = _result));
      tick();
      expect(result).toEqual(
        new AudioActions.ChangedAction({
          playing : false,
        }),
      );
    }),
  );

  it(
    'cleanup$',
    fakeAsync(() => {
      const { runner, audioEffects } = setup();

      runner.next(new AudioActions.CleanupAction());

      let result = null;
      audioEffects.cleanup$.subscribe(
        _result => (result = _result));
      tick();
      expect(result).toEqual(
        new AudioActions.ChangedAction({
          url : null,
          playing : false,
        }),
      );
    }),
  );
});
