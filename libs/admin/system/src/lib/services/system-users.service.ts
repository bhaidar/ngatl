import { Injectable } from '@angular/core'
import { AdminUiService, CrudService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'

class SystemUser {
  name: string
  email: string
  role: string
}

@Injectable({providedIn: 'root'})
export class SystemUsersService extends CrudService<SystemUser> {

  constructor(ui: AdminUiService) {
    super(ui);
    this.allItems = this.items = Array(100)
      .fill(0)
      .map((_, idx) => {
        return {
          name: 'Dummy User' + idx,
          email: `user-${idx}@email.com`,
          role: 'editor',
        }
      })
    this.formFields = [
      FormField.input('name', {
        label: 'Name',
        required: true,
      }),
      FormField.email('email', {
        label: 'Email',
        required: true,
      }),
      FormField.select('role', {
        label: 'Role',
        required: true,
        options: [{
          key: 'admin',
          value: 'Admin',
        },{
          key: 'editor',
          value: 'Editor',
        },]
      })
    ]
  }

  deleteItem(payload) {
    console.log('Delete item', payload)
  }

  saveItem(payload) {
    console.log('Saving item', payload)
  }

  getTitleProp(item: SystemUser) {
    return item.name
  }

  getSubtitleProp(item: SystemUser) {
    return item.email
  }

}
