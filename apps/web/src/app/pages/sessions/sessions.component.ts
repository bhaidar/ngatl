import { Component } from '@angular/core';
import { SessionsService } from '../../core/services/sessions.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent {
  sessions: Array<any>;

  constructor(sessionsService: SessionsService) {
    this.sessions = sessionsService.sessions;
  }
}
