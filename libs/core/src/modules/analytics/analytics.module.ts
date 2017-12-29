// angular
import {
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
// app
import { throwIfAlreadyLoaded } from '../helpers';
import { ANALYTICS_PROVIDERS } from './services';

@NgModule({
  providers : [...ANALYTICS_PROVIDERS],
})
export class AnalyticsModule {
  constructor(
    @Optional()
    @SkipSelf()
      parentModule: AnalyticsModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'AnalyticsModule');
  }
}
