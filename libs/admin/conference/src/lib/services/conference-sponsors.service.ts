import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { CrudService } from '@ngatl/admin/ui'
import { AngularFirestore } from '@angular/fire/firestore'
import { ConferenceSponsor } from '../types'

@Injectable({providedIn: 'root'})
export class ConferenceSponsorsService extends CrudService<ConferenceSponsor> {

  constructor(ui: AdminUiService, db: AngularFirestore) {
    super(ui, db)
    this.init('sponsors')
    this.formFields = [
      FormField.input('name', {
        label: 'Name',
        required: true,
      }),
      FormField.textarea('description', {
        label: 'Description',
        required: true,
      }),
    ]
  }

  getTitleProp(item: ConferenceSponsor) {
    return item.name
  }

  getSubtitleProp(item: ConferenceSponsor) {
    return item.description
  }

}
