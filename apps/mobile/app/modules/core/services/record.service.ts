import {
  Injectable,
  NgZone,
} from '@angular/core';
// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TNSRecorder, TNSPlayer, AudioRecorderOptions, AudioPlayerOptions } from 'nativescript-audio';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
import { knownFolders, Folder, File, path } from 'tns-core-modules/file-system';
import {
  AudioActions,
  IAudioPlatformPlayer,
  ProgressService,
  IAppState,
  LogService,
  WindowService,
} from '@ngatl/core';

@Injectable()
export class RecordService {
  public audioMeter = '0';
  public duration$: BehaviorSubject<string> = new BehaviorSubject( '00:00' );
  private _isPlaying = false;
  private _isRecording = false;
  private _recorder: TNSRecorder;
  private _player: TNSPlayer;
  private _audioSessionId;
  private _meterInterval: any;
  private _fileState: { path?: string; saved?: boolean } = {};
  private _recordDuration: number;
  private _durationInterval: number;

  constructor(
    public store: Store<IAppState>,
    public progressService: ProgressService,
    public ngZone: NgZone,
    private _log: LogService,
    private _win: WindowService,
    private _translate: TranslateService,
  ) {

    this._player = new TNSPlayer();
    this._player.debug = true; // set true for tns_player logs
    this._recorder = new TNSRecorder();
    this._recorder.debug = true; // set true for tns_recorder logs
  }

  public get isPlaying() {
    return this._isPlaying;
  }

  public set isPlaying(value: boolean) {
    this._isPlaying = value;
  }

  public get isRecording() {
    return this._isRecording;
  }

  public set isRecording(value: boolean) {
    this._isRecording = value;
  }

  public get filepath() {
    return this._fileState.path;
  }

  public set filepath(value: string) {
    this._fileState.path = value;
  }

  public startRecord() {
    try {
      if ( !TNSRecorder.CAN_RECORD() ) {
        this._win.alert( this._translate.instant( 'audio.disabled' ) );
        return;
      }

      const filename = `recording-${Date.now()}.${this.platformExtension()}`;
      this._fileState.path = path.join( knownFolders.documents().path, filename );

      let androidFormat;
      let androidEncoder;
      if ( isAndroid ) {
        // m4a
        // static constants are not available, using raw values here
        // androidFormat = android.media.MediaRecorder.OutputFormat.MPEG_4;
        androidFormat = 2;
        // androidEncoder = android.media.MediaRecorder.AudioEncoder.AAC;
        androidEncoder = 3;
      }

      const recorderOptions: AudioRecorderOptions = {
        filename: this._fileState.path,

        format: androidFormat,

        encoder: androidEncoder,

        // metering: true,

        infoCallback: infoObject => {
          console.log( JSON.stringify( infoObject ) );
        },

        errorCallback: errorObject => {
          console.log( JSON.stringify( errorObject ) );
        }
      };

      this._recordDuration = 0;
      this._recorder.start( recorderOptions );
      this.isRecording = true;
      if ( recorderOptions.metering ) {
        this._initMeter();
      }

      this._startRecordDurationTracking();
    } catch ( err ) {
      this.isRecording = false;
      this._resetMeter();
      this._win.alert( this._translate.instant( 'general.error' ) );
    }
  }

  private _startRecordDurationTracking() {
    this._durationInterval = this._win.setInterval( () => {
      this._recordDuration++;
      this.duration$.next( this._SMPTEToString(this._secondsToSMPTE(this._recordDuration)) );
      // console.log(`this.remainingDuration = ${this.remainingDuration}`);
    }, 1000 );
  }

  private _stopDurationTracking() {
    if (typeof this._durationInterval !== 'undefined') {
      this._win.clearInterval(this._durationInterval);
      this._durationInterval = undefined;
    }
  }

  public stopRecord() {
    this.isRecording = false;
    this._resetMeter();
    this._stopDurationTracking();
    this._recorder.stop();
  }

  private _initMeter() {
    this._resetMeter();
    this._meterInterval = this._win.setInterval( () => {
      this.audioMeter = this._recorder.getMeters();
      console.log( this.audioMeter );
    }, 300 );
  }

  private _resetMeter() {
    if ( typeof this._meterInterval !== 'undefined' ) {
      this.audioMeter = '0';
      this._win.clearInterval( this._meterInterval );
      this._meterInterval = undefined;
    }
  }

  public playRecordedFile() {

    const playerOptions: AudioPlayerOptions = {
      audioFile: this._fileState.path,
      loop: false,
      completeCallback: () => {
        this.isPlaying = false;
      },

      errorCallback: errorObject => {
        console.log( JSON.stringify( errorObject ) );
        this.isPlaying = false;
      },

      infoCallback: infoObject => {
        console.log( JSON.stringify( infoObject ) );
      }
    };

    this._player.playFromFile( playerOptions ).then( () => {
      this._startPlayTracking(this._player.duration);
    }, err => {
      console.log( "error playFromFile" );
      this.ngZone.run( () => {
        this.isPlaying = false;
      } );
    } );

    this.isPlaying = true;
  }

  public stopPlaying() {
    this.isPlaying = false;
    this._player.pause();
    this._stopDurationTracking();
  }

  public saveRecording() {
    return new Promise((resolve, reject) => {
      if (this.filepath) {
        // TODO dispatch action to upload and create cdn url
        // wire up subscription or do manual api to resolve directly the url 
      } else {
        reject();
      }
    });
  }

  public discard() {
    return new Promise((resolve, reject) => {
      if (this.filepath) {
        if (File.exists(this.filepath)) {
          const f = File.fromPath(this.filepath);
          if (f) {
            f.remove().then(_ => {
              resolve();
            }, (err) => {
              reject(err);
            })
          }
        }
      }
    })
  }

  private _startPlayTracking(duration) {
    if (this._player && this._player.isAudioPlaying()) {
      this._durationInterval = this._win.setInterval(() => {
        this.duration$.next(this._SMPTEToString(this._secondsToSMPTE(duration - this._player.currentTime)));
        // console.log(`this.remainingDuration = ${this.remainingDuration}`);
      }, 1000);
    }
  }

  private platformExtension() {
    // 'mp3'
    return `${isAndroid ? "m4a" : "caf"}`;
  }

  private _secondsToSMPTE( seconds ) {
    var s = Math.floor( seconds );
    var m = Math.floor( s / 60 );
    m = m % 60;
    s = s % 60;

    return { m: m, s: s };
  }

  private _SMPTEToString( timecode ) {
    if ( timecode.m < 10 ) { timecode.m = "0" + timecode.m; }
    if ( timecode.s < 10 ) { timecode.s = "0" + timecode.s; }

    return timecode.m + ":" + timecode.s;
  }

}
