import {
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
// libs
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
// app
import { LogService } from './log.service';
import { WindowService } from './window.service';
import { HttpErrorService } from './http-error.service';
import { NetworkCommonService } from './network.service';
import { MockWindow } from '../../../testing';

// test module configuration for each test
const testModuleConfig = () => {
  TestBed.configureTestingModule({
    imports : [TranslateModule.forRoot({})],
    providers : [
      {
        provide : WindowService,
        useClass : MockWindow,
      },
      HttpErrorService,
      NetworkCommonService,
      LogService,
    ],
  });
};

describe('core: NetworkCommonService', () => {
  let network: NetworkCommonService;

  beforeEach(() => {
    testModuleConfig();
    network = TestBed.get(NetworkCommonService);
    spyOn(console, 'log');
  });

  it('isOffline', () => {
    expect(network.isOffline).toBe(false);
  });

  it(
    'offline$',
    fakeAsync(() => {
      let result = null;
      network.offline$.subscribe(
        state => (result = state));
      tick();
      expect(result).toBeNull();

      network.offline = true;
      tick();
      expect(result).toBe(true);
      expect(network.isOffline).toBe(true);

      network.offline = false;
      tick();
      expect(result).toBe(false);
      expect(network.isOffline).toBe(false);
    }),
  );

  it(
    'offlineHttpCancel$',
    fakeAsync(() => {
      expect(network.isOffline).toBe(false);
      let result = null;
      let sample$ = Observable.create(
        observer => {
          setTimeout(() => {
            observer.next('done');
            observer.complete();
          }, 1000);
        });

      let sub = sample$
        .takeUntil(network.offlineHttpCancel$('1'))
        .subscribe(
          r => (result = r),
          err => console.log('error!', err),
        );
      tick(1000);
      expect(result).toBe('done'); // completed successfully
      network.cleanup('1');

      // reset and try with cancel
      sub.unsubscribe();
      result = null;
      sample$ = Observable.create(
        observer => {
          setTimeout(() => {
            observer.next('done');
            observer.complete();
          }, 1000);
        });

      sub = sample$.takeUntil(network.offlineHttpCancel$('2')).subscribe(
        r => {
          // success
          result = r;
        },
        err => {
          // offline canceled this preventing result from ever getting set
          // console.log('this one got canceled by:', err);
        },
      );
      tick(500);
      // should still be null
      expect(result).toBeNull();
      network.offline = true; // this will cancel the sample$
      tick(500);
      // result should have never completed
      expect(result).toBeNull();
      // cleanup
      sub.unsubscribe();
    }),
  );
});
