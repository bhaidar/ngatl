import {
  Injectable,
  NgZone,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { IAudioPlatformPlayer } from '../../modules/audio/services/audio.service';
import { ProgressService } from '../../modules/core/services/progress.service';

@Injectable()
export class MockAudioPlayer implements IAudioPlatformPlayer {
  private _url: string; // loaded url
  private _playing: boolean;

  constructor(
    public store: Store<any>,
    public progressService: ProgressService,
    public ngZone: NgZone,
  ) {}

  isPlaying() {
    return this._playing;
  }

  play(
    url: string,
    forceReload?: boolean,
  ) {
    // ensure to stop any others (only 1 audio should play at a time)
    this.stop();

    if ( this._url !== url || forceReload ) {
      this._url = url;
      this.progressService.toggleSpinner(true);
      setTimeout(
        _ => {
          // fake loading async file to play it
          this.progressService.toggleSpinner();
          console.log(`loaded and play: ${url}`);
          this._playing = true;
        }, 500);
      return false;
    } else {
      // already loaded, just play
      this._playing = true;
      console.log(`play: ${url}`);
      return true;
    }
  }

  stop() {
    if ( this._playing ) {
      this._playing = false;
      console.log('stop');
    }
  }

  cleanup() {
    this.stop();
    console.log('cleanup');
  }
}
