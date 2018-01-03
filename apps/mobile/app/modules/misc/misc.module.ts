import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { MISC_COMPONENTS, AboutComponent, ConductComponent } from './components';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'conduct',
    component: ConductComponent
  }
];

@NgModule({
  imports: [SharedModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...MISC_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MiscModule {}
