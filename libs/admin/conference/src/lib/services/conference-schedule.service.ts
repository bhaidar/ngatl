import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { CrudService } from '@ngatl/admin/ui'

class ConferenceSchedule {
  name: string
  bio: string
  avatar?: string
}

@Injectable({providedIn: 'root'})
export class ConferenceScheduleService extends CrudService<ConferenceSchedule> {
  constructor(ui: AdminUiService) {
    super(ui)
    this.allItems = this.items = Array(100)
      .fill(0)
      .map((_, idx) => {
        return {
          name: 'Schedule name ' + idx,
          bio: 'Schedule description ' + idx,
          avatar: `https://randomuser.me/api/portraits/women/${idx}.jpg`,
        }
      })
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

  deleteItem(payload) {
    console.log('Delete item', payload)
  }

  saveItem(payload) {
    console.log('Saving item', payload)
  }

  getTitleProp(item: ConferenceSchedule) {
    return item.name
  }

  getSubtitleProp(item: ConferenceSchedule) {
    return item.bio
  }

}
