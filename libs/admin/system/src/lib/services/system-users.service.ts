import { Injectable } from '@angular/core'
import { AdminUiService, CrudService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { AngularFirestore } from '@angular/fire/firestore'
import { SystemUser } from '../types'

@Injectable({providedIn: 'root'})
export class SystemUsersService extends CrudService<SystemUser> {

  constructor(ui: AdminUiService, db: AngularFirestore) {
    super(ui, db)
    this.init('users')
    this.items$.subscribe(res => this.setItems(res))

    this.formFields = [
      FormField.input('displayName', {
        label: 'Name',
        required: true,
        disabled: true,
      }),
      FormField.email('email', {
        label: 'Email',
        required: true,
        disabled: true,
      }),
      FormField.input('photoURL', {
        label: 'Photo URL',
        required: false,
      }),
      FormField.select('role', {
        label: 'Role',
        required: true,
        options: [{
          key: 'admin',
          value: 'Admin',
        }, {
          key: 'editor',
          value: 'Editor',
        },]
      })
    ]
  }

  getTitleProp(item: SystemUser) {
    return item.displayName
  }

  getSubtitleProp(item: SystemUser) {
    return item.email
  }
}
