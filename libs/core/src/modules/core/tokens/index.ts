import {
  InjectionToken,
  Type,
} from '@angular/core';

/**
 * Various InjectionTokens shared across all platforms
 * Always suffix with 'Token' for clarity and consistency
 */

export const FirebasePlatformToken = new InjectionToken<any>('FirebasePlatform');
export const PlatformLanguageToken = new InjectionToken<string>('PlatformLanguageToken');
export const PlatformAudioToken = new InjectionToken<string>('PlatformAudioToken');
export const PusherPlatformToken = new InjectionToken<any>('PusherPlatform');
