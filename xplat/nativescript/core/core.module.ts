import { NgModule, Optional, SkipSelf, Injector, NgZone } from '@angular/core';

// nativescript
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { RouterExtensions } from 'nativescript-angular/router';
import { device } from 'tns-core-modules/platform';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { LoadingIndicator } from 'nativescript-loading-indicator';
import * as TNSFirebase from 'nativescript-plugin-firebase';

// libs
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  CoreModule,
  StorageService,
  PlatformLanguageToken,
  PlatformLoaderService,
  ModalPlatformService,
  PlatformFirebaseToken,
  PlatformRouterToken,
  WindowPlatformService
} from '@ngatl/core';
import { AudioModule } from '@ngatl/features';
import { throwIfAlreadyLoaded } from '@ngatl/utils';

// app
import { PROVIDERS } from './services';
import { TNSWindowService } from './services/tns-window.service';
import { TNSTranslateLoader } from './services/tns-translate.loader';
import { TNSStorageService } from './services/tns-storage.service';
import { TNSModalService } from './services/tns-modal.service';

// factories
export function platformLangFactory() {
  return device.language;
}

export function createTranslateLoader() {
  return new TNSTranslateLoader('/assets/i18n/');
}

export function loadingIndicatorFactory() {
  return new LoadingIndicator();
}

export function firebaseFactory() {
  return TNSFirebase;
}

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptHttpClientModule,
    TNSFontIconModule.forRoot({
      ion: './assets/ionicons.min.css'
    }),
    CoreModule.forRoot([
      {
        provide: PlatformLanguageToken,
        useFactory: platformLangFactory
      },
      {
        provide: WindowPlatformService,
        useClass: TNSWindowService,
        deps: [Injector, NgZone]
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
        provide : PlatformFirebaseToken,
        useFactory : firebaseFactory,
      },
      {
        provide: PlatformRouterToken,
        useClass: RouterExtensions
      }
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader
      }
    }),
    // feature modules
    AudioModule
  ],
  providers: [...PROVIDERS]
})
export class NgatlCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: NgatlCoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'NgatlCoreModule');
  }
}
