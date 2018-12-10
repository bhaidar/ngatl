import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { SharedModule } from '../../features/shared/shared.module';
import { PROFILE_COMPONENTS, ProfileComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [SharedModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...PROFILE_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProfileModule {}
