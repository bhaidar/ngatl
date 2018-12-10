// nativescript
// import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

// angular
import { NgModule, Optional, SkipSelf, NO_ERRORS_SCHEMA } from '@angular/core';

// libs
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SDKModule, SocketDriver, InternalStorage, SDKStorage } from '@ngatl/api';
import { NgatlCoreModule } from '@ngatl/nativescript';
import { throwIfAlreadyLoaded } from '@ngatl/utils';

// app
import { SocketNative } from './services/api-socket.native';
import { StorageNative } from './services/api-storage.native';
import { EventEffects } from '../events/effects';
import { EVENT_PROVIDERS } from '../events/services';
import { SpeakerEffects } from '../speakers/effects';
import { SPEAKER_PROVIDERS } from '../speakers/services';
import { SponsorEffects } from '../sponsors/effects';
import { SPONSOR_PROVIDERS } from '../sponsors/services';
import { CORE_PROVIDERS } from './services';
import { reducers } from '../ngrx';

// various feature module singletons with core providers
const SINGLETON_PROVIDERS: any[] = [
  ...CORE_PROVIDERS,
  ...EVENT_PROVIDERS,
  ...SPEAKER_PROVIDERS,
  ...SPONSOR_PROVIDERS
];

@NgModule({
  imports: [
    NgatlCoreModule,

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
    // { provide: ModalDialogParams, useFactory: defaultModalParams }
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
