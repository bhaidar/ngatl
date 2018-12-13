import { Component } from '@angular/core'

import { SystemUsersService } from '../../services/system-users.service'

@Component({
  template: `
    <ui-crud-grid [showButton]="false" [service]="crud"></ui-crud-grid>
  `,
})
export class UsersIndexComponent {
  constructor(public crud: SystemUsersService ) {}
}
