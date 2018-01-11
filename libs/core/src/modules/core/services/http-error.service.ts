import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import {
  ILocalizedOfflineErrors,
  LocaleOfflineErrorKeys,
} from '../../helpers/errors';

@Injectable()
export class HttpErrorService {
  // helps manage maintenance page navigation
  private _maintenanceActive = false;
  // the route path the error occurred (used if it cause a maintenance page to show)
  // https://ugroupmedia.atlassian.net/browse/PNP-15041
  private _errorFromRoutePath: string;

  public localizedErrors: ILocalizedOfflineErrors = {};

  constructor(public translateService: TranslateService) {
    // because locale file may have not loaded yet (async in browser and could be delay, need to use get api)
    this.translateService.onLangChange.subscribe(
      _ => {
        this.translateService
            .get([
              LocaleOfflineErrorKeys.oopsies,
              LocaleOfflineErrorKeys.error,
              LocaleOfflineErrorKeys.tryAgain,
              LocaleOfflineErrorKeys.offline,
            ])
            .subscribe((result: any) => {
              this.localizedErrors = {
                oopsies : result[LocaleOfflineErrorKeys.oopsies],
                error : result[LocaleOfflineErrorKeys.error],
                tryAgain : result[LocaleOfflineErrorKeys.tryAgain],
                offline : result[LocaleOfflineErrorKeys.offline],
              };
            });
      });
  }

  public errorHandler(response: HttpErrorResponse): boolean {
    // by default, allow error responses to flow further downstream
    // any implementation of this service can return false to prevent downstream catch from firing
    return true;
  }

  public set maintenanceActive(value: boolean) {
    this._maintenanceActive = value;
  }

  public set errorFromRoutePath(value: string) {
    this._errorFromRoutePath = value;
  }

  public get errorFromRoutePath() {
    return this._errorFromRoutePath;
  }
}
