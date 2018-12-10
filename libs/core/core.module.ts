import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  Inject
} from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';

// libs
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateService } from '@ngx-translate/core';
import { throwIfAlreadyLoaded } from '@ngatl/utils';

// app
import { environment } from './environments/environment';
import { CORE_PROVIDERS, PlatformLanguageToken } from './services';
import { LogService } from './services/log.service';
import { UIEffects } from './state/ui.effect';
import { uiReducer } from './state/ui.reducer';
import { UIState } from './state/ui.state';
import { UserEffects } from './state/user.effect';
import { userReducer } from './state/user.reducer';
import { UserState } from './state/user.state';

/**
 * DEBUGGING
 */
LogService.DEBUG.LEVEL_4 = !environment.production;

export const BASE_PROVIDERS: any[] = [
  ...CORE_PROVIDERS,
  {
    provide: APP_BASE_HREF,
    useValue: '/'
  }
];

@NgModule({
  imports: [
    CommonModule, 
    NxModule.forRoot(),
    StoreModule.forRoot(
      {
        ui: uiReducer,
        user: userReducer
      },
      {
        initialState: {
          ui: UIState.initialState,
          user: UserState.initialState
        }
      }
    ),
    EffectsModule.forRoot([UIEffects, UserEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    }),
  ]
})
export class CoreModule {
  // configuredProviders: *required to configure WindowService and others per platform
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [...BASE_PROVIDERS, ...configuredProviders]
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    @Inject(PlatformLanguageToken) lang: string,
    translate: TranslateService
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');

    // ensure default platform language is set
    translate.use(lang);
  }
}
