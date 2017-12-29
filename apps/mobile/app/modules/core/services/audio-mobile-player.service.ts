import {
  Injectable,
  NgZone,
} from '@angular/core';
// libs
import { Store } from '@ngrx/store';
import { TNSPlayer } from 'nativescript-audio';
import { isIOS } from 'tns-core-modules/platform';
import {
  AudioActions,
  IAudioPlatformPlayer,
  ProgressService,
  IAppState,
  LogService,
} from '@ngatl/core';

@Injectable()
export class AudioMobilePlayer implements IAudioPlatformPlayer {
  private _audio: TNSPlayer;
  private _url: string; // loaded url
  private _playing: boolean;
  private _reset: () => void;

  constructor(
    public store: Store<IAppState>,
    public progressService: ProgressService,
    public ngZone: NgZone,
    private _log: LogService,
  ) {
    this._reset = this._resetFn.bind(this);
    // init player
    this._audio = new TNSPlayer();
  }

  isPlaying() {
    return this._playing;
  }

  play(
    url: string,
    forceReload?: boolean,
  ) {
    // ensure to stop any others (only 1 audio should play at a time)
    this.stop();

    // check if player needs reinitialization
    if (isIOS && !this._audio.ios) {
      forceReload = true;
    } else if (!this._audio.android) {
      forceReload = true;
    }

    const isNewUrl = this._url !== url;
    if ( isNewUrl || forceReload ) {
      if ( isNewUrl ) {
        // only if new url, show spinner (since if it's the same it's already loaded)
        this.progressService.toggleSpinner(true);
      }

      this._url = url;

      // load player with url
      this._audio.initFromUrl({
        audioFile : url,
        loop : false,
        completeCallback : this._reset,
        errorCallback : this._reset,
      }).then(() => {
        this._audio.getAudioTrackDuration()
            .then(
              duration => {
                this.progressService.toggleSpinner();
                this._audio.play();
                this._playing = true;
              }, this._reset);
      }, this._reset);

      // if needed to load, return false
      // allows potential for global handling of spinner in common if needed
      return false;
    } else if (this._audio) {
      // already loaded, just play
      this._audio.play();
      this._playing = true;
      return true;
    }
  }

  stop() {
    if ( this._audio && this.isPlaying() ) {
      this._playing = false;
      this._audio.pause();
    }
  }

  cleanup() {
    this._playing = false;
    this._url = ''; // reset url to nothing
    if ( this._audio && (this._audio.ios || this._audio.android) ) {
      try {
        this._audio.dispose();
      } catch ( err ) {
        this._log.debug('error disposing audio player.');
      }
    }
  }

  private _resetFn() {
    this.ngZone.run(() => {
      this.progressService.toggleSpinner();
      this.store.dispatch(new AudioActions.StopAction());
    });
  }
}
