import {
  Injectable,
  NgZone,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { TNSRecorder, TNSPlayer, AudioRecorderOptions, AudioPlayerOptions } from 'nativescript-audio';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
import { knownFolders, Folder, File, path } from 'tns-core-modules/file-system';
import {
  AudioActions,
  IAudioPlatformPlayer,
  ProgressService,
  NetworkCommonService,
  IAppState,
  LogService,
  WindowService,
  UserService,
} from '@ngatl/core';
import { AWSService } from './aws.service';

@Injectable()
export class RecordService {
  public audioMeter = '0';
  public duration$: BehaviorSubject<string> = new BehaviorSubject( '00:00' );
  public transcription$: Subject<string> = new Subject();
  private _isPlaying = false;
  private _isRecording = false;
  private _recorder: TNSRecorder;
  private _player: TNSPlayer;
  private _audioSessionId;
  private _meterInterval: any;
  private _fileState: { path?: string; saved?: boolean; isRemote?: boolean } = {};
  private _recordDuration: number;
  private _durationInterval: number;
  private _autoTranscribe = true;

  constructor(
    public store: Store<IAppState>,
    public progressService: ProgressService,
    public ngZone: NgZone,
    private _http: HttpClient,
    private _log: LogService,
    private _win: WindowService,
    private _translate: TranslateService,
    private _userService: UserService,
    private _aws: AWSService,
  ) {

    this._player = new TNSPlayer();
    // this._player.debug = true; // set true for tns_player logs
    this._recorder = new TNSRecorder();
    // this._recorder.debug = true; // set true for tns_recorder logs
  }

  public reset() {
    this._fileState = {};
    this.isPlaying = false;
    this.isRecording = false;
    this._stopDurationTracking();
  }

  public set autoTranscribe(value: boolean) {
    this._autoTranscribe = value;
  }

  public get autoTranscribe() {
    return this._autoTranscribe;
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

  public get isFileRemote() {
    return this._fileState.isRemote;
  }

  public get filepath() {
    return this._fileState.path;
  }

  public set filepath(value: string) {
    this._fileState.path = value;
    if (value && value.indexOf('http') > -1) {
      this._fileState.isRemote = this._fileState.saved = true;
    } else {
      this._fileState.isRemote = this._fileState.saved = false;
    }
  }

  public startRecord() {
    try {
      if ( !TNSRecorder.CAN_RECORD() ) {
        this._win.alert( this._translate.instant( 'audio.disabled' ) );
        return;
      }

      const filename = `${this._userService.currentUserId || ''}recording-${Date.now()}.${this.platformExtension()}`;
      this._fileState.path = path.join( knownFolders.documents().path, filename );
      this._fileState.isRemote = false;

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
          // this._log.debug( JSON.stringify( infoObject ) );
        },

        errorCallback: errorObject => {
          // this._log.debug( JSON.stringify( errorObject ) );
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
    if (this.autoTranscribe) {
      this._transcribe();
    }
  }

  public reTranscribe() {
    if (this.filepath) {
      this._transcribe();
    }
  }

  private _transcribe() {
    if (isIOS) {
      const speechRecongiser = SFSpeechRecognizer.alloc().init();
      let url;
      if (this._fileState.isRemote) {
        url = NSURL.URLWithString(this.filepath);
      } else {
        url = NSURL.fileURLWithPath(this.filepath);
      }
      const request = SFSpeechURLRecognitionRequest.alloc().initWithURL(url);

      speechRecongiser.recognitionTaskWithRequestResultHandler(request, (result: SFSpeechRecognitionResult, error) => {
        if (error) {
          this._win.alert(this._translate.instant('audio.transcribe-error'));
          return;
        }
        this.ngZone.run(() => {
          this.transcription$.next(result.bestTranscription.formattedString);
        });
      });
    }
  }

  private _initMeter() {
    this._resetMeter();
    this._meterInterval = this._win.setInterval( () => {
      this.audioMeter = this._recorder.getMeters();
      // console.log( this.audioMeter );
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
        this._togglePlayingStateOff();
      },

      errorCallback: errorObject => {
        // console.log( JSON.stringify( errorObject ) );
        this._togglePlayingStateOff();
      },

      infoCallback: infoObject => {
        // console.log( JSON.stringify( infoObject ) );
      }
    };

    this.progressService.toggleSpinner(true);
    if (this._fileState.isRemote) {
      this._player.playFromUrl( playerOptions ).then(this._playStarted.bind(this), this._playError.bind(this) );
    } else {
      this._player.playFromFile( playerOptions ).then(this._playStarted.bind(this), this._playError.bind(this) );
    }

    this.isPlaying = true;
  }

  private _togglePlayingStateOff() {
    this.ngZone.run(() => {
      this.isPlaying = false;
      this._stopDurationTracking();
    });
  }

  private _playStarted() {
    this.progressService.toggleSpinner(false);
    this._startPlayTracking(this._player.duration);
  }

  private _playError(err) {
    // console.log( "error playFromFile" );
    this.ngZone.run( () => {
      this.progressService.toggleSpinner(false);
      this.isPlaying = false;
    } );
  }

  public stopPlaying() {
    this.isPlaying = false;
    this._player.pause();
    this._stopDurationTracking();
  }

  public saveRecording() {
    return new Promise((resolve, reject) => {
      if (!this._fileState.isRemote) { // needs saving
        const file = File.fromPath(this._fileState.path);
        if (file) {
          this._aws.upload(file).then((url) => {
            resolve(url);
          }, err => {
            reject();
          });
        } else {
          reject();
        }
      } else if (this._fileState.isRemote) {
        // already saved remotely
        resolve(this.filepath);
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
