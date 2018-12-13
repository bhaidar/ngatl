import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { CrudService } from '@ngatl/admin/ui'
import { AngularFirestore } from '@angular/fire/firestore'
import { ConferenceSpeaker } from '../types'

@Injectable({providedIn: 'root'})
export class ConferenceSpeakersService extends CrudService<ConferenceSpeaker> {

  constructor(ui: AdminUiService, db: AngularFirestore) {
    super(ui, db)
    this.init('speakers')
    this.formFields = [
      FormField.input('name', {
        label: 'Name',
        required: true,
      }),
      FormField.textarea('bio', {
        label: 'Bio',
        required: true,
      }),
      FormField.input('avatar', {
        label: 'Avatar',
        required: false,
      }),
    ]
  }

  getTitleProp(item: ConferenceSpeaker) {
    return item.name
  }

  getSubtitleProp(item: ConferenceSpeaker) {
    return item.bio
  }

}
