import { Injectable } from '@angular/core';
// nativescript
import { Cache } from 'tns-core-modules/ui/image-cache';
import {
  ImageSource,
  fromNativeSource,
  fromUrl,
  fromResource
} from 'tns-core-modules/image-source';
// libs
import { Observable } from 'rxjs';
import { LogService } from '@ngatl/core';

/**
 * Since Android uses fresco, this is for iOS only at the moment
 */
@Injectable()
export class ImageCacheService {

  private _cache: Cache;

  constructor(
    private _log: LogService,
  ) {
    this._cache = new Cache();
  }

  public cache(
    url: string,
    fallback?: string,
  ): Observable<ImageSource> {
    return Observable.create(
      observer => {
        if (this._isValidUrl(url)) {
          // only cache valid urls
          const image = this._cache.get(url);
          if ( image ) {
            // if present, use it
            // this._log.debug('using cached image:', url);
            observer.next(fromNativeSource(image));
            observer.complete();
          } else {
            this._cache.push({
              key : url,
              url : url,
              completed : (
                image: any,
                key: string,
              ) => {
                if ( url === key ) {
                  // this._log.debug('image loaded and cached:', url);
                  observer.next(fromNativeSource(image));
                  observer.complete();
                }
              },
            });
          }
        } else if (this._isLocalRef(url)) {
          observer.next(url);
          observer.complete();
        } else if (fallback) {
          observer.next(fallback);
          observer.complete();
        }
      });
  }

  public enable(value: boolean) {
    if ( value ) {
      this._cache.enableDownload();
    } else {
      this._cache.disableDownload();
    }
  }

  private _isValidUrl(url: string) {
    return url && url.indexOf('http') === 0;
  }

  private _isLocalRef(url: string) {
    return url && url.indexOf('res') === 0;
  }
}
