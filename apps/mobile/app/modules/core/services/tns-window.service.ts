import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

// nativescript
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { device, isIOS } from 'tns-core-modules/platform';
import * as timer from 'tns-core-modules/timer';

// app
import { isString } from '@ngatl/core';

declare var SCLAlertViewStyleKit;

var TNSFancyAlert, TNSFancyAlertButton;

if (isIOS) {
  var fAlerts = require('nativescript-fancyalert');
  TNSFancyAlert = fAlerts.TNSFancyAlert;
  TNSFancyAlertButton = fAlerts.TNSFancyAlertButton;
} else {
  // android
  TNSFancyAlertButton = (function () {
    function TNSFancyAlertButton(model) {
        if (model) {
            this.label = model.label;
            this.action = model.action;
        }
    }
    return TNSFancyAlertButton;
  }());
}

@Injectable()
export class MobileWindowPlatformService {
  private _dialogOpened = false;

  constructor() {
    if (isIOS) {
      TNSFancyAlert.titleColor = '#fff';
      TNSFancyAlert.bodyTextColor = '#fff';
      TNSFancyAlert.shouldDismissOnTapOutside = true;
    } else {
      // android
    }
  }

  public get navigator(): any {
    return {
      language: device.language,
      userAgent: 'nativescript'
    };
  }
  public get location(): any {
    return {
      host: 'nativescript'
    };
  }
  public btoa() {
    return ''; // stub
  }
  public scrollTo(x?: number, y?: number) {}
  public alert(msg: string | dialogs.AlertOptions): Promise<any> {
    return new Promise(resolve => {
      if (!this._dialogOpened && msg) {
        this._dialogOpened = true;
        console.log('typeof msg:', typeof msg);
        if (msg instanceof Response) {
          try {
            msg = msg.json();
            msg = (<any>msg).message;
          } catch (err) {
            msg = msg.text();
          }
        }

        if (isIOS) {
          TNSFancyAlert.customViewColor = '#b52d31';
          TNSFancyAlert.backgroundViewColor = '#151F2F';
          TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromTop;
          TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutToBottom;
    
          TNSFancyAlert.showInfo(null, msg);
          this._dialogOpened = false;
          resolve();
        } else {
          if (typeof msg === 'string') {
            const options: dialogs.AlertOptions = {
              message: <string>msg,
              okButtonText: 'Ok'
            };
            dialogs.alert(options).then(ok => {
              this._dialogOpened = false;
              resolve();
            });
          }
        }
      }
    });
  }
  public confirm(msg: any, action?: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._dialogOpened) {
        this._dialogOpened = true;
        let options: dialogs.ConfirmOptions = {
          title: 'Confirm',
          okButtonText: 'Ok',
          cancelButtonText: 'Cancel'
        };
        if (typeof msg === 'string') {
          options.message = msg;
        } else {
          options = msg;
        }

        if (isIOS) {
          TNSFancyAlert.customViewColor = '#b52d31';
          TNSFancyAlert.backgroundViewColor = '#151F2F';
          TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromTop;
          TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutToBottom;
          TNSFancyAlert.showCustomButtons([
            new TNSFancyAlertButton({
              label: options.cancelButtonText,
              action: () => {
                this._dialogOpened = false;
                reject();
              }
            }),
            new TNSFancyAlertButton({
              label: options.okButtonText,
              action: () => {
                this._dialogOpened = false;
                action();
                resolve();
              }
            })
          ],
            SCLAlertViewStyleKit.imageOfQuestion(),
            '#fff',
            options.title,
            options.message,  
            options.cancelButtonText, 
          );
        } else {
          dialogs.confirm(options).then(ok => {
            this._dialogOpened = false;
            if (ok) {
              resolve();
            } else {
              reject();
            }
          });
        }
      }
    });
  }
  public open(...args: Array<any>) {
    // might have this open a WebView modal
    return null;
  }
  public setTimeout(handler: (...args: any[]) => void, timeout?: number): number {
    return timer.setTimeout(handler, timeout);
  }
  public clearTimeout(timeoutId: number): void {
    timer.clearTimeout(timeoutId);
  }
  public setInterval(handler: (...args: any[]) => void, ms?: number, ...args: any[]): number {
    return timer.setInterval(handler, ms);
  }
  public clearInterval(intervalId: number): void {
    timer.clearInterval(intervalId);
  }
}
