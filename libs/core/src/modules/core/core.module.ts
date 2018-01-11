import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import {
  Http,
  XHRBackend,
  RequestOptions,
  HttpModule,
} from '@angular/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// libs
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// app
import { AnalyticsModule } from '../analytics';
import { LocaleService } from './services/locale.service';
import { NetworkCommonService } from './services/network.service';
import { HttpService } from './services/http.service';
import { CORE_PROVIDERS } from './services';
import { UIEffects } from './effects';
import { throwIfAlreadyLoaded, } from '../helpers';
import { reducers } from '../ngrx';
import { AudioModule } from '../audio/audio.module';
import { AudioEffects } from '../audio/effects';
import { HttpErrorService } from './services/http-error.service';
import { ApiInterceptor } from './services/http-interceptor.service';
import { UserModule } from '../user/user.module';
import { UserEffects } from '../user/effects';

// factories
export function httpFactory(
  backend,
  options,
  localeService,
  httpErrorSrvice,
  networkService,
) {
  return new HttpService(
    backend,
    options,
    localeService,
    httpErrorSrvice,
    networkService,
  );
}

export const BASE_PROVIDERS: any[] = [
  ...CORE_PROVIDERS,
  {
    provide : APP_BASE_HREF,
    useValue : '/',
  },
  {
    provide : Http,
    deps : [
      XHRBackend,
      RequestOptions,
      LocaleService,
      HttpErrorService,
      NetworkCommonService,
    ],
    // Factory creates PnpHttpService under the hood
    useFactory : httpFactory,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
  }
];

@NgModule({
  imports : [
    HttpModule,
    AnalyticsModule,
    AudioModule,
    UserModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      // startWith: platform locale
      UIEffects,
      AudioEffects,
      // startWith: user init
      UserEffects,
    ]),
  ],
})
export class CoreModule {
  // configuredProviders: *required to configure WindowService per platform
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
    return {
      ngModule : CoreModule,
      providers : [
        ...BASE_PROVIDERS,
        ...configuredProviders
      ],
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
      parentModule: CoreModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
