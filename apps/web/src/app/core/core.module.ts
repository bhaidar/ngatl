import { NgModule } from '@angular/core';

// singleton services
import { SessionsService } from './services/sessions.service';
import { SpeakersService } from './services/speakers.service';
import { WorkshopsService } from './services/workshops.service';

@NgModule({
  providers: [SessionsService, SpeakersService, WorkshopsService]
})
export class CoreModule {}
