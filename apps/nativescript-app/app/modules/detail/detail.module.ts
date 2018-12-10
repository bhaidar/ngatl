import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { SharedModule } from '../../features/shared/shared.module';
import { DETAIL_COMPONENTS, EventDetailComponent, SpeakerDetailComponent, SponsorDetailComponent } from './components';

const routes: Routes = [
  {
    path: 'speaker/:id',
    component: SpeakerDetailComponent
  },
  {
    path: 'event/:id',
    component: EventDetailComponent
  },
  {
    path: 'sponsor/:id',
    component: SponsorDetailComponent
  },
];

@NgModule({
  imports: [SharedModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...DETAIL_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DetailModule {}
