// nativescript
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

// angular
import { NgModule, ModuleWithProviders, Optional, SkipSelf, NO_ERRORS_SCHEMA } from '@angular/core';

// libs
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoadingIndicator } from 'nativescript-loading-indicator';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { device } from 'tns-core-modules/platform';
import * as TNSUtils from 'tns-core-modules/utils/utils';
import * as TNSApplicationSettings from 'tns-core-modules/application-settings';
import { SDKModule, SocketDriver, InternalStorage, SDKStorage } from '@ngatl/api';
import {
  CoreModule as LibCoreModule,
  FirebasePlatformToken,
  HttpErrorService,
  ModalPlatformService,
  PlatformLanguageToken,
  PlatformLoaderService,
  StorageService,
  throwIfAlreadyLoaded,
  WindowPlatformService,
  LogService,
  AudioPlayer,
  LocaleService,
  NetworkCommonService,
  isApiProd
} from '@ngatl/core';

// app
import { SocketNative } from './services/api-socket.native';
import { StorageNative } from './services/api-storage.native';
import { EventEffects } from '../events/effects';
import { EVENT_PROVIDERS } from '../events/services';
import { SearchEffects } from '../search/effects';
import { SEARCH_PROVIDERS } from '../search/services';
import { SpeakerEffects } from '../speakers/effects';
import { SPEAKER_PROVIDERS } from '../speakers/services';
import { SponsorEffects } from '../sponsors/effects';
import { SPONSOR_PROVIDERS } from '../sponsors/services';
import { CORE_PROVIDERS } from './services';
import { AudioMobilePlayer } from './services/audio-mobile-player.service';
import { NSAppService, toggleHttpLogs, DebugKeys } from './services/ns-app.service';
import { TnsHttpErrorService } from './services/tns-http-error.service';
import { TNSModalService } from './services/tns-modal.service';
import { TNSStorageService } from './services/tns-storage.service';
import { MobileWindowPlatformService } from './services/tns-window.service';
import { TNSTranslateLoader } from './utils';
import { reducers } from '../ngrx';

// factories
export function loadingIndicatorFactory() {
  return new LoadingIndicator();
}

export function platformLangFactory() {
  console.log('platformLangFactory:', device.language);

  return device.language;
}

// export function firebaseFactory() {
//   return TNSFirebase;
// }

NetworkCommonService.API_URL = '';

/**
 * DEBUGGING
 * Only enabled when not production api
 */
LogService.DEBUG.LEVEL_4 = !isApiProd(NetworkCommonService.API_URL);
// optionally debug analytics (will log out all data before its sent)
// LogService.DEBUG_ANALYTICS = true;
// enable http logging early to get all init http request as well
toggleHttpLogs(true);//TNSApplicationSettings.getBoolean(DebugKeys.httpLogs, false));
// JSON files:
// * comment out toggleHttpLogs above and uncomment below to use local json files:
// toggleHttpLogs(true, '/assets/json/');

export function defaultModalParams() {
  return new ModalDialogParams({}, null);
}
export function createTranslateLoader() {
  return new TNSTranslateLoader('/assets/i18n/');
}

// various feature module singletons with core providers
const SINGLETON_PROVIDERS: any[] = [
  ...CORE_PROVIDERS,
  ...EVENT_PROVIDERS,
  ...SEARCH_PROVIDERS,
  ...SPEAKER_PROVIDERS,
  ...SPONSOR_PROVIDERS
];

@NgModule({
  imports: [
    LibCoreModule.forRoot([
      {
        provide : PlatformLanguageToken,
        useFactory : platformLangFactory,
      },
      {
        provide : WindowPlatformService,
        useClass : MobileWindowPlatformService,
      },
      {
        provide : StorageService,
        useClass : TNSStorageService,
      },
      {
        provide : ModalPlatformService,
        useClass : TNSModalService,
      },
      {
        provide : PlatformLoaderService,
        useFactory : loadingIndicatorFactory,
      },
      {
        provide: FirebasePlatformToken,
        useValue: {},
        // useFactory : firebaseFactory,
      },
      {
        provide : HttpErrorService,
        useClass : TnsHttpErrorService,
      },
      {
        provide : AudioPlayer,
        useClass : AudioMobilePlayer,
      },
    ]),
    TranslateModule.forRoot({
      loader : {
        provide : TranslateLoader,
        useFactory : createTranslateLoader,
      },
    }),
    // provide native services over top the shared services
    TNSFontIconModule.forRoot({
      fa: './assets/font-awesome.min.css',
    }),

    // backend services configuration
    SDKModule.forRoot([
      { provide: SocketDriver, useClass: SocketNative },
      { provide: InternalStorage, useClass: StorageNative },
      { provide: SDKStorage, useClass: StorageNative }
    ]),

    // app setup
    StoreModule.forFeature('conference', reducers),
    EffectsModule.forFeature( [
      EventEffects,
      SearchEffects,
      SpeakerEffects,
      SponsorEffects
    ] )
  ],
  providers: [
    ...SINGLETON_PROVIDERS,
    // allows components to be reused as modals as well as routing components
    // this service is provided to each component when opened in a modal
    // however because components will need to inject this for both conditions (route and modal)
    // this ensures Angular DI works fine everytime
    { provide: ModalDialogParams, useFactory: defaultModalParams }
  ],
  schemas : [NO_ERRORS_SCHEMA],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
