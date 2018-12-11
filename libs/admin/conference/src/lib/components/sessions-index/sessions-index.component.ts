import { Component } from '@angular/core'
import { ConferenceSessionsService } from '../../services/conference-sessions.service'

@Component({
  template: `
    <ui-crud-grid [service]="crud"></ui-crud-grid>
  `,
})
export class SessionsIndexComponent {
  constructor(public crud: ConferenceSessionsService ) {}
}
