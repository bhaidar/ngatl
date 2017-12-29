// angular
import { Injectable } from '@angular/core';

@Injectable()
export class WindowPlatformService {
  public navigator: any = {};
  public location: any = {};
  public alert( msg: string ) { };
}

@Injectable()
export class WindowService {

  constructor(
    private _platformWindowService: WindowPlatformService,
  ) {

  }

  public get navigator() {
    return this._platformWindowService.navigator;
  }

  public get location() {
    return this._platformWindowService.location;
  }

  public alert(msg: string) {
    return new Promise( ( resolve ) => {
      this._platformWindowService.alert( msg );
      resolve();
    });
  }

  public confirm(msg: string) {
    return;
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
    return 0;
  }

  public clearTimeout(timeoutId: number): void {}

  public setInterval(
    handler: (...args: any[]) => void,
    ms?: number,
    ...args: any[]
  ): number {
    return 0;
  }

  public clearInterval(intervalId: number): void {}

  // google analytics stub for web
  public ga(
    command: string | Function,
    params?: any,
    extra?: any,
  ): void {}
}
