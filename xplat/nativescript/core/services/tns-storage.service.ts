import { Injectable } from '@angular/core';
import {
  StorageService,
  WindowService,
} from '@ngatl/core';
import * as TNSApplicationSettings from 'tns-core-modules/application-settings';

@Injectable()
export class TNSStorageService implements StorageService {
  public storageType: any; // AoT

  constructor(public win: WindowService) {
    // not used however AoT needs same args
  }

  public setItem(
    key: string,
    data: any,
  ): void {
    if (key) {
      if ( typeof data === 'undefined' ) {
        data = null;
      } else {
        data = JSON.stringify(data);
      }
      TNSApplicationSettings.setString(key, data);
    } else {
      console.log('TNSStorageService setItem problem, key:', key);
    }
  }

  public getItem(key: string): any {
    if (key) {
      const item = TNSApplicationSettings.getString(key);
      if ( !item || item === 'null' ) {
        return null;
      }

      try {
        return JSON.parse(item);
      } catch ( e ) {
        console.log(e);


      }
    } else {
      console.log('TNSStorageService getItem problem, key:', key);
    }
    return null;
  }

  public removeItem(key: string): void {
    if (key) {
      TNSApplicationSettings.remove(key);
    } else {
      console.log('TNSStorageService removeItem problem, key:', key);
    }
  }

  public clearAll(): void {
    TNSApplicationSettings.clear();
  }

  public isAvailable(): boolean {
    return true; // mirrored here since shared web implementation might use this
  }

  public key(index: number): string {
    return null;
  }


}
