import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { SharedModule } from '../../features/shared/shared.module';
import { HOME_COMPONENTS, DashboardComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'speakers',
    loadChildren: '~/modules/speakers/speaker.module#SpeakerModule'
  },
  {
    path: 'sponsors',
    loadChildren: '~/modules/sponsors/sponsor.module#SponsorModule'
  },
  {
    path: 'events',
    loadChildren: '~/modules/events/events.module#EventsModule',
  },
  {
    path: 'misc',
    loadChildren: '~/modules/misc/misc.module#MiscModule'
  },
];

@NgModule({
  imports: [SharedModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...HOME_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}
