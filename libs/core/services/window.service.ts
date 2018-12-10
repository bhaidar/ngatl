// angular
import { Injectable, ViewContainerRef } from '@angular/core';

// app
import { isObject, isNativeScript } from '@ngatl/utils';

export interface IPromptOptions {
  placeholder: string;
  initialValue: string;
  action: Function;
  msg?: string;
  okButtonText?: string;
  cancelButtonText?: string;
}

@Injectable()
export class WindowPlatformService {
  public navigator: any = {};
  public location: any = {};
  public localStorage: any;
  public process: any;
  public require: any;
  public alert(msg: any) {}
  public alertOldStyle(msg: any) {
    /* used with {N} standard alerts where needed */
  }
  public confirm(msg: any) {}
  public prompt( options: any ) {}
  public reset() {} /* reset state of window (often used with dialogs) */
  public setTimeout(handler: (...args: any[]) => void, timeout?: number) {
    return 0;
  }
  public clearTimeout(timeoutId: number) {}
  public setInterval(
    handler: (...args: any[]) => void,
    ms?: number,
    ...args: any[]
  ) {
    return 0;
  }
  public clearInterval(intervalId: number) {}

  // ...You can expand support for more window methods as you need them here...
}

@Injectable()
export class WindowService {
  private _authToken: string;

  constructor(private _platformWindow: WindowPlatformService) {}

  public get navigator() {
    return this._platformWindow.navigator;
  }

  public get location() {
    return this._platformWindow.location;
  }

  public get process() {
    return this._platformWindow.process;
  }

  public get require() {
    return this._platformWindow.require;
  }

  public get authToken() {
    return this._authToken;
  }

  public set authToken(value: string) {
    this._authToken = value;
  }

  public alert(msg: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const result: any = this._platformWindow.alert(msg);
      if (isObject(result) && result.then) {
        // console.log('WindowService -- using result.then promise');
        result.then(resolve, reject);
      } else {
        resolve();
      }
    });
  }

  public alertOldStyle(msg: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const result: any = this._platformWindow.alertOldStyle(msg);
      if (isObject(result) && result.then) {
        // console.log('WindowService -- using result.then promise');
        result.then(resolve, reject);
      } else {
        resolve();
      }
    });
  }

  public confirm(
    msg: any,
    action?: Function /* used for fancyalerts on mobile*/
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const result: any = (<any>this._platformWindow).confirm(
        msg,
        isNativeScript() ? action : undefined
      );
      if (isObject(result) && result.then) {
        result.then(resolve, reject);
      } else if (result) {
        resolve();
      } else {
        reject();
      }
    });
  }

  public prompt(options: IPromptOptions) {
    return new Promise( ( resolve, reject ) => {
      const result: any = (<any>this._platformWindow).prompt(options);
      if (isObject(result) && result.then) {
        result.then(resolve, reject);
      } else if (result) {
        resolve();
      } else {
        reject();
      }
    });
  }

  public reset() {
    if (this._platformWindow.reset) {
      // often used by {N} to reset dialog state helpers
      this._platformWindow.reset();
    }
  }

  public setTimeout(
    handler: (...args: any[]) => void,
    timeout?: number
  ): number {
    return this._platformWindow.setTimeout(handler, timeout);
  }

  public clearTimeout(timeoutId: number): void {
    return this._platformWindow.clearTimeout(timeoutId);
  }

  public setInterval(
    handler: (...args: any[]) => void,
    ms?: number,
    ...args: any[]
  ): number {
    return this._platformWindow.setInterval(handler, ms, args);
  }

  public clearInterval(intervalId: number): void {
    return this._platformWindow.clearInterval(intervalId);
  }

  // google analytics stub for web
  public ga(command: string | Function, params?: any, extra?: any): void {}
}
