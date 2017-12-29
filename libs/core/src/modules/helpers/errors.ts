import { TranslateService } from '@ngx-translate/core';
import { isObject } from './equals';
import { capitalize, safeSplit } from './strings';

export interface ILocalizedOfflineErrors {
  oopsies?: string;
  error?: string;
  tryAgain?: string;
  offline?: string;
}

export const LocaleOfflineErrorKeys: ILocalizedOfflineErrors = {
  oopsies : 'general.oopsies-lbl',
  error : 'alert.error-occurred-txt',
  tryAgain : 'alert.try-txt',
  offline : 'alert.offline-txt',
};

export interface ILocalizedFormErrors {
  field?: string;
  contains?: string;
  value?: string;
}

export const LocaleFormErrorKeys: ILocalizedFormErrors = {
  field : 'alert.field-for-txt',
  contains : 'alert.contains-error-txt',
  value : 'alert.problem-value-txt',
};

/**
 * Utility to try and parse an error from various error formats
 * Http Responses will return an object { status: number; message: string }
 * @param err any error object
 */
export function getError(err?: any) {
  if ( typeof err === 'string' ) {
    return err;
  } else if ( isObject(err) ) {
    if ( err.json ) {
      // Angular 'Response' Type
      const status = err.status; // from original response
      const errorJson = err.json();
      if ( errorJson ) {
        // parse message
        const message = errorJson.message || errorJson;
        return {
          status,
          message,
        };
      }
    }
    return err.message || err;
  }
  return err;
}

/**
 * Utility to get error status from a potential Http Response error
 * @param err any error object
 */
export function getErrorStatus(err?: any): number {
  if ( isObject(err) ) {
    if ( err.json ) {
      return getError(err).status;
    }
  }
  return 0;
}
