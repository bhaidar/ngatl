import { Injectable, NgZone } from '@angular/core';
// libs
import { Store, select } from '@ngrx/store';
import { TNSPlayer } from 'nativescript-audio';
import { isIOS } from 'tns-core-modules/platform';
import { ProgressService, LogService } from '@ngatl/core';
import { AudioActions, AudioState, AudioService } from '@ngatl/features';

@Injectable()
export class AudioPlayer {
  private _audio: TNSPlayer;
  private _url: string; // loaded url
  private _playing: boolean;
  private _reset: () => void;
  // Used to configure player to force reload audio from the beginning everytime it is played
  // default is to just resume where it left off
  private _forceReloadPlay = false;

  constructor(
    protected _store: Store<any>,
    protected _progressService: ProgressService,
    protected _ngZone: NgZone,
    private _log: LogService,
    private _audioService: AudioService
  ) {
    this._reset = this._resetFn.bind(this);
    // init player
    this._audio = new TNSPlayer();

    this._store
      .pipe(select('audio'))
      .subscribe((audioState: AudioState.IState) => {
        if (audioState.playing) {
          this.play(audioState.url, this.forceReloadPlay);
        } else {
          this.stop();
        }
      });

    this._audioService.cleanup$.subscribe(_ => {
      this.cleanup();
    });
  }

  public get forceReloadPlay() {
    return this._forceReloadPlay;
  }

  public set forceReloadPlay(value: boolean) {
    this._forceReloadPlay = value;
  }

  isPlaying() {
    return this._playing;
  }

  play(url: string, forceReload?: boolean) {
    // ensure to stop any others (only 1 audio should play at a time)
    this.stop();

    // check if player needs reinitialization
    if (isIOS && !this._audio.ios) {
      forceReload = true;
    } else if (!this._audio.android) {
      forceReload = true;
    }

    const isNewUrl = this._url !== url;
    if (isNewUrl || forceReload) {
      if (isNewUrl) {
        // only if new url, show spinner (since if it's the same it's already loaded)
        this._progressService.toggleSpinner(true);
      }

      this._url = url;

      // load player with url
      this._audio
        .initFromUrl({
          audioFile: url,
          loop: false,
          completeCallback: this._reset,
          errorCallback: this._reset
        })
        .then(() => {
          this._audio.getAudioTrackDuration().then(duration => {
            this._progressService.toggleSpinner();
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
    if (this._audio && this.isPlaying()) {
      this._playing = false;
      this._audio.pause();
    }
  }

  public cleanup() {
    // reset flag to default
    this.forceReloadPlay = false;
    // always stop any playback when cleaning up
    this._store.dispatch(new AudioActions.StopAction());
    this._playing = false;
    this._url = ''; // reset url to nothing
    if (this._audio && (this._audio.ios || this._audio.android)) {
      try {
        this._audio.dispose();
      } catch (err) {
        this._log.debug('error disposing audio player.');
      }
    }
  }

  private _resetFn() {
    this._ngZone.run(() => {
      this._progressService.toggleSpinner();
      this._store.dispatch(new AudioActions.StopAction());
    });
  }
}
