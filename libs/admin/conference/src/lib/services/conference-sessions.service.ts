import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { CrudService } from '@ngatl/admin/ui'
import { AngularFirestore } from '@angular/fire/firestore'
import { ConferenceSession } from '../types'

@Injectable({providedIn: 'root'})
export class ConferenceSessionsService extends CrudService<ConferenceSession> {

  constructor(ui: AdminUiService, db: AngularFirestore) {
    super(ui, db)
    this.init('session')
    this.formFields = [
      FormField.input('title', {
        label: 'Title',
        required: true,
      }),
      FormField.textarea('description', {
        label: 'Description',
        required: true,
      }),
      FormField.date('date', {
        label: 'Date',
        required: true,
      }),
      FormField.date('time', {
        label: 'Time',
        required: true,
      }),
      FormField.number('duration', {
        label: 'Duration',
        required: true,
      }),
      FormField.select('type', {
        label: 'Type',
        required: true,
        options: [{
          key: 'talk',
          value: 'Talk',
        }, {
          key: 'workshop',
          value: 'Workshop',
        },]
      })
    ]
  }

  getTitleProp(item: ConferenceSession) {
    return item.title
  }

  getSubtitleProp(item: ConferenceSession) {
    return item.description
  }
}
