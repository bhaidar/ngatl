import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { CrudService } from '@ngatl/admin/ui'
import { AngularFirestore } from '@angular/fire/firestore'
import { ConferenceSchedule } from '../types'

@Injectable({providedIn: 'root'})
export class ConferenceScheduleService extends CrudService<ConferenceSchedule> {

  constructor(ui: AdminUiService, db: AngularFirestore) {
    super(ui, db)
    this.init('schedule')
    this.formFields = [
      FormField.input('name', {
        label: 'Name',
        required: true,
      }),
    ]
  }

  getTitleProp(item: ConferenceSchedule) {
    return item.name
  }

  getSubtitleProp(item: ConferenceSchedule) {
    return item.name
  }

}
