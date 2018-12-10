import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AUDIO_PROVIDERS } from './services';
import { audioReducer } from './state/audio.reducer';
import { AudioEffects } from './state/audio.effect';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('audio', audioReducer),
    EffectsModule.forFeature([AudioEffects])
  ],
  providers: [AudioEffects, ...AUDIO_PROVIDERS]
})
export class AudioModule {}
