import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { CrudService } from '@ngatl/admin/ui'

class ConferenceSession {
  title: string
  description: string
  date?: Date
  time?: Date
  duration?: number
  type: string
}

@Injectable({providedIn: 'root'})
export class ConferenceSessionsService extends CrudService<ConferenceSession> {

  constructor(ui: AdminUiService) {
    super(ui)
    this.allItems = this.items = Array(100)
      .fill(0)
      .map((_, idx) => {
        return {
          title: 'Session title ' + idx,
          description: 'Session description ' + idx,
          type: 'talk',
        }
      })

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

  deleteItem(payload) {
    console.log('Delete item', payload)
  }

  saveItem(payload) {
    console.log('Saving item', payload)
  }

  getTitleProp(item: ConferenceSession) {
    return item.title
  }

  getSubtitleProp(item: ConferenceSession) {
    return item.description
  }
}
