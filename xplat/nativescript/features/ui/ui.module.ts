import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { UISharedModule } from '@ngatl/features';
import { UI_COMPONENTS, UI_ENTRY_COMPONENTS } from './components';
import { UI_DIRECTIVES } from './directives';

const MODULES = [
  NativeScriptCommonModule,
  NativeScriptFormsModule,
  NativeScriptRouterModule,
  NativeScriptUISideDrawerModule,
  NativeScriptUIListViewModule,
  TNSFontIconModule,
  TNSCheckBoxModule,
  UISharedModule
];

@NgModule({
  imports: [...MODULES],
  declarations: [...UI_COMPONENTS, ...UI_ENTRY_COMPONENTS, ...UI_DIRECTIVES],
  entryComponents: [...UI_ENTRY_COMPONENTS],
  exports: [...MODULES, ...UI_COMPONENTS, ...UI_ENTRY_COMPONENTS, ...UI_DIRECTIVES],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UIModule {}
