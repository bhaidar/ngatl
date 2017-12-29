import {
  TestBed,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { StoreModule, } from '@ngrx/store';
import { LogService } from './log.service';
import {
  ModalService,
  ModalPlatformService,
} from './modal.service';
import {
  TestingModule,
  TestComponent,
  MockModalWeb,
  MockModalNativeScript,
} from '../../../testing';

describe('core: ModalService', () => {
  let modalService: ModalService = null;
  let logService: LogService = null;
  const options = {
    cmpType : TestComponent,
    props : {
      trackTitle : 'Modal title',
      sample : 'testing',
    },
  };

  describe('web implementation (assuming @ng-bootstrap)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports : [
          StoreModule.forRoot({}),
          TestingModule,
        ],
      });
    });

    beforeEach(
      inject(
        [
          ModalService,
          LogService,
        ],
        (
          _modalService: ModalService,
          _logService: LogService,
        ) => {
          modalService = _modalService;
          logService = _logService;
        },
      ),
    );

    it('should handle open properly', () => {
      const state = modalService.open(options);
      expect(state.trackTitle).toBe('Modal title');
      expect(state.cmpType).toBe(TestComponent);
      expect(modalService.modalRef.constructor.name).toBe('MockModalWeb');
      expect(modalService.modalRef.componentInstance.title).toBeUndefined();
      expect(modalService.modalRef.componentInstance.sample).toBe('testing');
    });

    it(
      'should handle open and close result success handling',
      fakeAsync(() => {
        spyOn(console, 'log');
        spyOn(logService, 'debug');

        const state = modalService.open(options);

        modalService.close('testing close');
        tick();
        expect(console.log).toHaveBeenCalledWith('testing close');
        expect(logService.debug).toHaveBeenCalledWith('Modal closed with:', 'testing close');
      }),
    );

    it(
      'should handle open and close result rejection handling',
      fakeAsync(() => {
        spyOn(console, 'log');
        spyOn(logService, 'debug');

        const state = modalService.open(options);

        MockModalWeb.forceReject = true;
        modalService.close(2);
        tick();
        expect(console.log).toHaveBeenCalledWith(2);
        expect(logService.debug).toHaveBeenCalledWith('Modal closed reason:', 2);
      }),
    );
  });

  describe('native mobile implementation (assuming {N})', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports : [
          StoreModule.forRoot({}),
          TestingModule,
        ],
        providers : [
          LogService,
          ModalService,
          {
            provide : ModalPlatformService,
            useClass : MockModalNativeScript,
          },
        ],
      });
    });

    beforeEach(
      inject(
        [
          ModalService,
          LogService,
        ],
        (
          _modalService: ModalService,
          _logService: LogService,
        ) => {
          modalService = _modalService;
          logService = _logService;
        },
      ),
    );

    it(
      'should mobile close result properly',
      fakeAsync(() => {
        spyOn(console, 'log');

        const state = modalService.open(options);

        modalService.close({
          params : {
            closeCallback :
              value => {
                console.log(value);
              },
          },
          value : 'test result',
        });
        tick();
        expect(console.log).toHaveBeenCalledWith('test result');
      }),
    );
  });
});
