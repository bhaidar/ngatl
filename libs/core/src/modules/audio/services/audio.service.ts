import {
  Injectable,
  NgZone,
} from '@angular/core';
// libs
import { Store } from '@ngrx/store';
// app
import { IAppState } from '../../ngrx';
import { ProgressService } from '../../core/services/progress.service';
import { AudioActions } from '../actions';
import { AudioState } from '../states';

export interface IAudioPlatformPlayer {
  isPlaying(): boolean;

  play(
    url: string,
    forceReload?: boolean,
  ): boolean; // return whether file is already loaded
  stop(): void;

  cleanup(): void;
}

/**
 * web/mobile should provide for this at runtime
 */
@Injectable()
export class AudioPlayer implements IAudioPlatformPlayer {
  constructor(
    public store: Store<IAppState>,
    public progressService: ProgressService,
    public ngZone: NgZone,
  ) {}

  isPlaying() {
    return false;
  }

  play(
    url: string,
    forceReload?: boolean,
  ) {
    return true;
  }

  stop() {}

  cleanup() {}
}

@Injectable()
export class AudioService {
  // Used to configure player to force reload audio from the beginning everytime it is played
  // default is to just resume where it left off
  private _forceReloadPlay = false;

  constructor(
    private _store: Store<IAppState>,
    private _audioPlayer: AudioPlayer,
    private _progressService: ProgressService,
  ) {
    this._store.select((s: IAppState) => s.audio).subscribe((audioState: AudioState.IState) => {
      if ( audioState.playing ) {
        this._audioPlayer.play(audioState.url, this.forceReloadPlay);
      } else {
        this._audioPlayer.stop();
      }
    });
  }

  public set forceReloadPlay(value: boolean) {
    this._forceReloadPlay = value;
  }

  public get forceReloadPlay() {
    return this._forceReloadPlay;
  }

  public cleanup() {
    // reset flag to default
    this.forceReloadPlay = false;
    // always stop any playback when cleaning up
    this._store.dispatch(new AudioActions.StopAction());
    this._audioPlayer.cleanup();
  }
}
