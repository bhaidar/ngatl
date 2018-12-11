import { Component } from '@angular/core'
import { ConferenceSponsorsService } from '../../services/conference-sponsors.service'

@Component({
  template: `
    <ui-crud-grid [service]="crud"></ui-crud-grid>
  `,
})
export class SponsorsIndexComponent {
  constructor(public crud: ConferenceSponsorsService ) {}
}
