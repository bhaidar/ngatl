import {
  NgModule,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

// libs
import { TranslateModule } from '@ngx-translate/core';

// app
import {
  CORE_PROVIDERS,
  ModalPlatformService,
  WindowService,
  PlatformLoaderService,
} from '../modules/core/services';
import { PlatformLanguageToken } from '../modules/core/tokens/index';
import {
  MockModalWeb,
  MockPlatformLoaderService,
  MockWindow,
  MOCK_BACKEND_PROVIDERS,
} from './services';

@Component({
  selector : 'app-test-cmp',
  template : '<div>Test</div>',
})
export class TestComponent {}

@NgModule({
  imports : [
    RouterTestingModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({}),
  ],
  declarations : [TestComponent],
  providers : [
    ...CORE_PROVIDERS,
    // mock testing providers
    {
      provide : ModalPlatformService,
      useClass : MockModalWeb,
    },
    {
      provide : WindowService,
      useClass : MockWindow,
    },
    {
      provide : PlatformLoaderService,
      useClass : MockPlatformLoaderService,
    },
    {
      provide : PlatformLanguageToken,
      useValue : 'en',
    },
  ],
  exports : [TranslateModule],
})
export class TestingModule {}

@NgModule({
  imports : [
    TestingModule,
    // ApisModule,
  ],
  providers : [...MOCK_BACKEND_PROVIDERS],
})
export class HttpTestingModule {}

export * from './models';
export * from './services';
export * from './utils';
