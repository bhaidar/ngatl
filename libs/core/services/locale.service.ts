import { Inject, Injectable, forwardRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { LogService } from './log.service';
import { safeSplit } from '@ngatl/utils';
import { ICoreState } from '../state/core.state';
import { PlatformLanguageToken } from './tokens';
import { Cache, StorageKeys, StorageService } from './storage.service';
import { LocaleState } from '../state/locale.state';

@Injectable()
export class LocaleService extends Cache {
  // used by http interceptor
  // since api calls are made frequently avoid roundtrips to persitence
  private _inMemoryLocale: LocaleState.Locale;

  private _zoneCode: string;

  constructor(
    @Inject(forwardRef(() => Store)) private _store: Store<ICoreState>,
    @Inject(forwardRef(() => PlatformLanguageToken))
    private _languageToken: string,
    @Inject(forwardRef(() => StorageService))
    private _storageService: StorageService,
    @Inject(forwardRef(() => LogService)) private _log: LogService
  ) {
    super(_storageService);
    this.isObjectCache = true;
    this.key = StorageKeys.LOCALE;

    if (this._languageToken) {
      this._languageToken = safeSplit(this._languageToken, '-')[0];
    }
    if (!Object.keys(LocaleState.Locale).includes(this._languageToken)) {
      this._languageToken = 'en';
    }
  }

  public get locale(): LocaleState.Locale {
    this._inMemoryLocale = this.cache ? this.cache.locale : this._languageToken;
    return this._inMemoryLocale;
  }

  public set locale(locale: LocaleState.Locale) {
    // store in persistence
    this.cache = { locale };
    // always update in-memory locale for rapid access elsewhere
    this._inMemoryLocale = locale;
  }

  public get inMemoryLocale(): LocaleState.Locale {
    return this._inMemoryLocale;
  }
}
