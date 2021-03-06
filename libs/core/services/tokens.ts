import { InjectionToken, Type } from '@angular/core';

/**
 * Various InjectionTokens shared across all platforms
 * Always suffix with 'Token' for clarity and consistency
 */

export const PlatformLanguageToken = new InjectionToken<string>(
  'PlatformLanguageToken'
);
export const PlatformFirebaseToken = new InjectionToken<any>('PlatformFirebaseToken');
export const PlatformRouterToken = new InjectionToken<any>('PlatformRouterToken');
