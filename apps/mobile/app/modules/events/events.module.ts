import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { EVENT_COMPONENTS, EventComponent } from './components';
import { EventDeactivateGuard } from './services/event-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    canDeactivate: [EventDeactivateGuard]
  }
];

@NgModule({
  imports: [SharedModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...EVENT_COMPONENTS],
  providers: [EventDeactivateGuard],
  schemas: [NO_ERRORS_SCHEMA]
})
export class EventsModule {}
