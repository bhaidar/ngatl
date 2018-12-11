import { Component } from '@angular/core'
import { ConferenceSpeakersService } from '../../services/conference-speakers.service'

@Component({
  template: `
    <ui-crud-grid [service]="crud"></ui-crud-grid>
  `
})
export class SpeakersIndexComponent {
  constructor(public crud: ConferenceSpeakersService ) {}
}
