import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminUiModule } from '@ngatl/admin/ui'

import { ScheduleIndexComponent } from './components/schedule-index/schedule-index.component'
import { SessionsIndexComponent } from './components/sessions-index/sessions-index.component'
import { SpeakersIndexComponent } from './components/speakers-index/speakers-index.component'
import { SponsorsIndexComponent } from './components/sponsors-index/sponsors-index.component'

const routes = [
  {
    path: 'schedule',
    component: ScheduleIndexComponent,
  },
  {
    path: 'sessions',
    component: SessionsIndexComponent,
  },
  {
    path: 'speakers',
    component: SpeakersIndexComponent,
  },
  {
    path: 'sponsors',
    component: SponsorsIndexComponent,
  },
]
@NgModule({
  imports: [
    CommonModule,
    AdminUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ScheduleIndexComponent,
    SessionsIndexComponent,
    SpeakersIndexComponent,
    SponsorsIndexComponent,
  ]
})
export class AdminConferenceModule {}
