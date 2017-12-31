/**
 * CommonModule
 * Should contain *only* components, directives and pipes commonly shared across both web and mobile apps
 * IMPORTANT: No providers should ever appear here *UNLESS* they are used as providers in others here
 * This module can be imported into any other module (lazy-loaded or not).
 * However this is most commonly imported into each platform's SharedModule and exported there.
 * That way each platform (web/mobile) can have it's own shared components/directives/pipes
 * in addition to these common ones.
 */
import { NgModule, } from '@angular/core';
// import { COMMON_DIRECTIVES } from './directives';
// import { COMMON_PIPES } from './pipes';

@NgModule({
  // declarations : [
  //   ...COMMON_DIRECTIVES,
  //   ...COMMON_PIPES
  // ],
  // exports : [
  //   ...COMMON_DIRECTIVES,
  //   ...COMMON_PIPES
  // ],
})
export class CommonModule {}
