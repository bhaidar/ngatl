// angular
import { Injectable } from '@angular/core';

@Injectable()
export class WindowPlatformService {
  public navigator: any = {};
  public location: any = {};
  public alert( msg: any ) { };
  public confirm( msg: any ) { };
  public setTimeout( 
    handler: (...args: any[]) => void,
    timeout?: number
  ) { return 0; };
  public clearTimeout( timeoutId: number ) { };
  public setInterval( 
    handler: (...args: any[]) => void,
    ms?: number,
    ...args: any[]
  ) { return 0; };
  public clearInterval( intervalId: number ) { };
}

@Injectable()
export class WindowService {

  constructor(
    private _platformWindow: WindowPlatformService,
  ) {

  }

  public get navigator() {
    return this._platformWindow.navigator;
  }

  public get location() {
    return this._platformWindow.location;
  }

  public alert(msg: any): Promise<any> {
    return new Promise( ( resolve, reject ) => {
      const result: any = this._platformWindow.alert( msg );
      console.log('WindowService -- result instanceof Promise', result instanceof Promise);
      if (result) {
        console.log('WindowService -- result.constructor.name', result.constructor.name);
      }
      if (result && result instanceof Promise) {
        result.then(resolve, reject);
      } else {
        resolve();
      }
    });
  }

  public confirm(msg: any): Promise<any> {
    return new Promise( ( resolve, reject ) => {
      const result: any = this._platformWindow.confirm( msg );
      if (result instanceof Promise) {
        result.then(resolve, reject);
      } else if (result) {
        resolve();
      } else {
        reject();
      }
    });
  }

  public btoa(msg: string): string {
    return null;
  }

  public scrollTo(
    a: number,
    b: number,
  ) {
    return null;
  }

  public open(...args: Array<any>): any {
    return null;
  }

  public setTimeout(
    handler: (...args: any[]) => void,
    timeout?: number,
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
  public ga(
    command: string | Function,
    params?: any,
    extra?: any,
  ): void {}
}
