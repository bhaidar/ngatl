import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// libs
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { throwIfAlreadyLoaded } from '@ngatl/utils';
import {
  CoreModule, PlatformFirebaseToken,
  PlatformLanguageToken, PlatformRouterToken,
  WindowPlatformService
} from '@ngatl/core'
import { RouterModule } from '@angular/router'
import * as firebase from 'firebase/app';

// bring in custom web services here...

// factories
export function winFactory() {
  return window;
}

export function platformLangFactory() {
  const browserLang = window.navigator.language || 'en'; // fallback English
  // browser language has 2 codes, ex: 'en-US'
  return browserLang.split('-')[0];
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, `./assets/i18n/`, '.json');
}

export function firebaseFactory() {
  return firebase;
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule.forRoot([
      {
        provide: PlatformLanguageToken,
        useFactory: platformLangFactory
      },
      {
        provide: WindowPlatformService,
        useFactory: winFactory
      },
      {
        provide: PlatformRouterToken,
        useClass: RouterModule,
      },
      {
        provide : PlatformFirebaseToken,
        useFactory : firebaseFactory,
      },
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
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
