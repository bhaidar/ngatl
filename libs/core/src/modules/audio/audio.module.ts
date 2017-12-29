import { NgModule } from '@angular/core';
import { AUDIO_PROVIDERS } from './services';

@NgModule({
  providers : [...AUDIO_PROVIDERS],
})
export class AudioModule {}
