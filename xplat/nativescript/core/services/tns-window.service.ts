import { Injectable, Injector, NgZone } from '@angular/core';
// libs
import { TranslateService } from '@ngx-translate/core';
// nativescript
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { Color } from 'tns-core-modules/color';
import {
  device,
  isIOS,
  isAndroid,
} from 'tns-core-modules/platform';
import * as timer from 'tns-core-modules/timer';
import {
  ProgressService,
  IPromptOptions
} from '@ngatl/core';
import {
  isString,
  isObject,
} from '@ngatl/utils';
import { ColorService } from './color.service';

declare var SCLAlertViewStyleKit;

@Injectable()
export class TNSWindowService {

  private _isDialogOpen = false;
  private _isConfirmOpen = false;
  private _labelOk: string;
  private _labelCancel: string;

  constructor(
    private _injector: Injector,
    private _ngZone: NgZone,
  ) {
    TNSFancyAlert.titleColor = ColorService.Active.TEXT;
    TNSFancyAlert.bodyTextColor = ColorService.Active.TEXT;
    TNSFancyAlert.shouldDismissOnTapOutside = false;
  }

  public get navigator(): any {
    return {
      language : device.language,
      userAgent : 'nativescript',
      onLine : true // default status, updated in ns-app.service
    };
  }

  public get location(): any {
    return {
      host : 'nativescript',
    };
  }

  public history: any = {};

  public dataLayer: Array<any> = [];

  public btoa() {
    return ''; // stub
  }

  public atob() {
    return ''; // stub
  }

  public scrollTo(
    x?: number,
    y?: number,
  ) { }

  public get isDialogOpen() {
    return this._isDialogOpen;
  }

  public get isConfirmOpen() {
    return this._isConfirmOpen;
  }

  public alert(msg: string | dialogs.AlertOptions): Promise<any> {
    this._injector.get(ProgressService).toggleSpinner(); // always ensure spinner is hidden

    return new Promise((resolve) => {
      if ( !this._isDialogOpen ) {
        this._prepDialog();

        let title = this._getDefaultTitle();
        let labelOk = this._labelOk;
        if (!isString(msg)) {
          const options = <dialogs.AlertOptions>msg;
          msg = options.message;
          title = options.title || title;
          if (options.okButtonText) {
            labelOk = options.okButtonText;
          }
        }
        if ( typeof msg === 'string' ) {
          // prevent dialogs.alert being called more than once - {N} doesn't like that
          this._isDialogOpen = true;

          if (isIOS) {
            const buttons = [new TNSFancyAlertButton({
              label: labelOk,
              action: () => {
                this._ngZone.run(() => {
                  this.reset();
                  resolve();
                });
              },
              applyStyle: (btn: UIButton) => {
                // apply nothing
              }
            })];
            TNSFancyAlert.showCustomButtons(buttons,
              this.getAlertImage('warning'),
              ColorService.Active.PRIMARY,
              title,
              msg
            );
          } else {
            TNSFancyAlert.showColorDialog(
              title,
              msg,
              labelOk,
              null,
              ColorService.Active.PRIMARY,
              '#fff',
              '#fff'
            ).then(_ => {
              this.reset();
              resolve();
            }, err => {
              this.reset();
            });
          }
        }
      }
    });
  }

  public alertOldStyle(msg: any): Promise<any> {
    return new Promise((resolve) => {
      if ( !this._isDialogOpen ) {
        this._isDialogOpen = true;
        dialogs.alert(msg).then(_ => {
          this.reset();
          resolve();
        }, err => {
          this.reset();
        });
      }
    });
  }

  public confirm(msg: string | dialogs.ConfirmOptions, action?: Function, okText?: string): Promise<any> {
    return new Promise((resolve) => {
      if ( !this._isDialogOpen ) {
        this._prepDialog();

        let title = this._getDefaultTitle();
        let isUsingCustomTitle = false;
        let labelOk = this._labelOk;
        let labelCancel = this._labelCancel;
        if (!isString(msg)) {
          const options = <dialogs.ConfirmOptions>msg;
          msg = options.message;
          title = options.title || title;
          if (options.title) {
            isUsingCustomTitle = true;
          }
          if (options.okButtonText) {
            labelOk = options.okButtonText;
          }
          if (options.cancelButtonText) {
            labelCancel = options.cancelButtonText;
          }
        }

        if ( typeof msg === 'string' ) {
          this._isDialogOpen = true;
          this._isConfirmOpen = true;

          if (isIOS) {
            const buttons = [
              new TNSFancyAlertButton({
                label: labelCancel,
                action: () => {
                  this.reset();
                  resolve(false);
                },
                applyStyle: (btn: UIButton) => {
                  (<any>btn).buttonFormatBlock = () => {
                    // const dict = NSMutableDictionary.alloc().init();
                    // dict.setObjectForKey(new Color('#3a3939').ios, 'backgroundColor');
                    // return dict;
                    return new (NSDictionary as any)([new Color('#3a3939').ios], ['backgroundColor']);
                  }
                }
              }),
              new TNSFancyAlertButton({
                label: labelOk,
                action: () => {
                  this._ngZone.run(() => {
                    this.reset();
                    resolve(true);
                  });
                },
                applyStyle: (btn: UIButton) => {
                  // apply nothing
                }
              })
            ];
            TNSFancyAlert.showCustomButtons(buttons,
              this.getAlertImage('question'),
              ColorService.Active.WHITE,
              title,
              msg
            );
          } else {
            if (isUsingCustomTitle) {
              // just combine on android since it displays better and with wrapped lines
              msg = title + msg;
              // now reset back to default title
              title = this._getDefaultTitle();
            }
            TNSFancyAlert.showColorDialog(
              title,
              msg,
              labelOk,
              labelCancel,
              ColorService.Active.PRIMARY,
              '#fff',
              '#fff'
            ).then(_ => {
              this.reset();
              resolve(true);
            }, err => {
              this.reset();
              resolve(false);
            });
          }
        }
      }
    });
  }

  public prompt(options: IPromptOptions) {
    return new Promise((resolve, reject) => {
      if (!this._isDialogOpen) {
        this._isDialogOpen = true;
        let title = this._getDefaultTitle();

        if (isIOS) {
          this._prepDialog();

          TNSFancyAlert.showTextField(
            options.placeholder,
            options.initialValue,
            new TNSFancyAlertButton({
              label: options.okButtonText,
              action: (value: any) => {
                this._isDialogOpen = false;
                if (value) {
                  console.log(`User entered ${value}`);
                  options.action(value);
                  this.reset();
                  resolve(value);
                } else {
                  this.reset();
                  reject();
                }
              }
            }),
            SCLAlertViewStyleKit.imageOfWarning(),
            '#fff',
            options.okButtonText || title,
            options.msg,
          );
        } else {    
          const opt: dialogs.PromptOptions = {
            title: options.okButtonText,
            message: options.msg,
            defaultText: options.initialValue || '',
            inputType: dialogs.inputType.text,
            okButtonText: options.okButtonText,
            cancelButtonText: options.cancelButtonText
          };
          dialogs.prompt(opt).then((result: any) => {
            this._isDialogOpen = false;
            if (result && result.text) {
              console.log(`User entered ${result.text}`);
              options.action(result.text);
              this.reset();
              resolve(result.text);
            } else {
              this.reset();
              reject();
            }
          }, () => {
            // canceled
            this.reset();
            reject();
          });
          
        }
      }
    });    
  }

  public action(arg: string | dialogs.AlertOptions): Promise<string> {
    if ( isAndroid ) {
      let options: dialogs.ActionOptions;

      const defaultOptions = {
        title : null,
        cancelButtonText : (<any>dialogs).CANCEL,
      };

      if ( arguments.length === 1 ) {
        if ( isString(arguments[0]) ) {
          options = defaultOptions;
          options.message = arguments[0];
        } else {
          options = arguments[0];
        }
      } else if ( arguments.length === 2 ) {
        if ( isString(arguments[0]) && isString(arguments[1]) ) {
          options = defaultOptions;
          options.message = arguments[0];
          options.cancelButtonText = arguments[1];
        }
      } else if ( arguments.length === 3 ) {
        if ( isString(arguments[0]) && isString(arguments[1]) && typeof arguments[2] !== 'undefined' ) {
          options = defaultOptions;
          options.message = arguments[0];
          options.cancelButtonText = arguments[1];
          options.actions = arguments[2];
        }
      }

      return new Promise<string>((
        resolve,
        reject,
      ) => {
        const labelColor = (<any>dialogs).getLabelColor();

        function showDialog(builder: android.app.AlertDialog.Builder) {
          const dlg = builder.show();
          const textViewId = dlg.getContext().getResources().getIdentifier('android:id/alertTitle', null, null);
          const messageTextViewId = dlg.getContext().getResources().getIdentifier('android:id/message', null, null);
          if ( textViewId ) {
            const tv = <android.widget.TextView>dlg.findViewById(textViewId);
            if ( tv ) {
              tv.setSingleLine(false);
              tv.setTypeface(tv.getTypeface(), android.graphics.Typeface.BOLD);
            }
          }
          if ( labelColor ) {
            if ( textViewId ) {
              const tv = <android.widget.TextView>dlg.findViewById(textViewId);
              if ( tv ) {
                tv.setTextColor(labelColor.android);
              }
            }
            if ( messageTextViewId ) {
              const messageTextView = <android.widget.TextView>dlg.findViewById(messageTextViewId);
              if ( messageTextView ) {
                messageTextView.setTextColor(labelColor.android);
              }
            }
          }

          const buttonColors: { color: Color; backgroundColor: Color } = (<any>dialogs).getButtonColors();
          if ( buttonColors && (buttonColors.color || buttonColors.backgroundColor) ) {
            const buttons: Array<android.widget.Button> = [];
            for ( let i = 0; i < 3; i++ ) {
              const id = dlg.getContext().getResources().getIdentifier('android:id/button' + i, null, null);
              buttons[i] = <android.widget.Button>dlg.findViewById(id);
            }

            buttons.forEach(
              button => {
                if ( button ) {
                  // pnp-red-dark
                  button.setTextColor(new Color('#AF1426').android);
                  // if ( buttonColor ) {
                  //   button.setTextColor(buttonColors.color.android);
                  // }
                  if ( buttonColors.backgroundColor ) {
                    button.setBackgroundColor(buttonColors.backgroundColor.android);
                  }
                }
              });
          }
        }

        try {
          const app = require('tns-core-modules/application');
          const activity = app.android.foregroundActivity || app.android.startActivity;
          const alert = new android.app.AlertDialog.Builder(activity);

          const message = options && isString(options.message) ? options.message : '';
          const title = options && isString(options.title) ? options.title : '';
          if ( options && options.cancelable === false ) {
            alert.setCancelable(false);
          }
          const textView = new android.widget.TextView(activity);
          if ( title ) {
            alert.setTitle(title);
            if ( !options.actions ) {
              alert.setMessage(message);
            }
          }
          else {
            alert.setTitle(message);
          }

          if ( options.actions ) {
            alert.setItems(options.actions, new android.content.DialogInterface.OnClickListener({
              onClick : function (
                dialog: android.content.DialogInterface,
                which: number,
              ) {
                resolve(options.actions[which]);
              },
            }));
          }

          if ( isString(options.cancelButtonText) ) {
            alert.setNegativeButton(options.cancelButtonText, new android.content.DialogInterface.OnClickListener({
              onClick : function (
                dialog: android.content.DialogInterface,
                id: number,
              ) {
                dialog.cancel();
                resolve(options.cancelButtonText);
              },
            }));
          }

          alert.setOnDismissListener(new android.content.DialogInterface.OnDismissListener({
            onDismiss : function () {
              if ( isString(options.cancelButtonText) ) {
                resolve(options.cancelButtonText);
              } else {
                resolve('');
              }
            },
          }));

          showDialog(alert);

        } catch ( ex ) {
          reject(ex);
        }
      });
    } else {
      return dialogs.action(<dialogs.AlertOptions>arg);
    }
  }

  public open(...args: Array<any>) {
    // might have this open a WebView modal
    return null;
  }

  public setTimeout(
    handler: (...args: Array<any>) => void,
    timeout?: number,
  ): number {
    return timer.setTimeout(handler, timeout);
  }

  public clearTimeout(timeoutId: number): void {
    timer.clearTimeout(timeoutId);
  }

  public setInterval(
    handler: (...args: Array<any>) => void,
    ms?: number,
    ...args: Array<any>
  ): number {
    return timer.setInterval(handler, ms);
  }

  public clearInterval(intervalId: number): void {
    timer.clearInterval(intervalId);
  }

  // stub for AoT
  public ga(
    command: string | Function,
    params?: any,
  ): void { }

  public reset() {
    this._isDialogOpen = false;
    this._isConfirmOpen = false;
  }

  private _getDefaultTitle() {
    return '✼✼✼';
  }

  private _prepDialog() {
    if (isIOS) {
      TNSFancyAlert.customViewColor = ColorService.Active.PRIMARY;
      TNSFancyAlert.backgroundViewColor = ColorService.Active.BASE;
      TNSFancyAlert.iconTintColor = ColorService.Active.WHITE;
      TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromTop;//.SlideInFromCenter;
      TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutToBottom;//SlideOutToCenter;
      TNSFancyAlert.textDisplayOptions = {
        bodySize: 17,
        titleSize: 14,
        buttonSize: 17
      };
    }
    if (!this._labelOk) {
      this._labelOk = this._injector.get(TranslateService).instant('reaction.ok-lbl');
    }
    if (!this._labelCancel) {
      this._labelCancel = this._injector.get(TranslateService).instant('general.cancel-lbl');
    }
  }

  private getAlertImage(image: string) {
    switch (image) {
      case 'edit':
        return SCLAlertViewStyleKit.imageOfEdit();
      case 'warning':
        return SCLAlertViewStyleKit.imageOfWarning();
      case 'question':
        return SCLAlertViewStyleKit.imageOfQuestion();
    }
  }
}
