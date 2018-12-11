import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { CrudService } from '@ngatl/admin/ui'

class ConferenceSpeaker {
  name: string
  bio: string
  avatar?: string
}

@Injectable({providedIn: 'root'})
export class ConferenceSpeakersService extends CrudService<ConferenceSpeaker> {

  constructor(ui: AdminUiService) {
    super(ui)
    this.allItems = this.items = Array(100)
      .fill(0)
      .map((_, idx) => {
        return {
          name: 'Speaker name ' + idx,
          bio: 'Speaker description ' + idx,
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

  getTitleProp(item: ConferenceSpeaker) {
    return item.name
  }

  getSubtitleProp(item: ConferenceSpeaker) {
    return item.bio
  }

}
