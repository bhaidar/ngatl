import { Component } from '@angular/core'
import { ConferenceScheduleService } from '../../services/conference-schedule.service'

@Component({
  template: `
    <ui-crud-grid [service]="crud"></ui-crud-grid>
  `
})
export class ScheduleIndexComponent {
  constructor(public crud: ConferenceScheduleService ) {}
}
