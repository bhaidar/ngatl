import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui/src/lib/services/admin-ui.service'
import { map } from 'rxjs/operators'
import { FormField } from '@ngatl/admin/ui'

enum actions {
  DELETE = 'DELETE',
  EDIT = 'EDIT'
}

@Injectable({providedIn: 'root'})
export class ConferenceSessionsService {
  public items = []
  public formFields: FormField[] = [
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
      },{
        key: 'workshop',
        value: 'Workshop',
      },]
    })
  ]

  constructor(private ui: AdminUiService) {
    this.items = Array(100)
      .fill(0)
      .map((_, idx) => {
        return {
          title: 'Session title ' + idx,
          description: 'Session description ' + idx,
          editAction: actions.EDIT,
          deleteAction: actions.DELETE
        }
      })
  }

  handleAction({type, payload}) {
    switch (type) {
      case actions.DELETE: {
        return this.ui
          .openModalConfirm()
          .pipe(map(() => this.deleteItem(payload)))
          .subscribe()
      }
      case actions.EDIT: {
        return this.ui
          .openModalForm(this.formFields, payload)
          .pipe(map(res => this.saveItem(res)))
          .subscribe()
      }
    }
  }

  addItem() {
    this.handleAction({type: actions.EDIT, payload: {}})
  }

  deleteItem(payload) {
    console.log('Delete item', payload)
  }

  saveItem(payload) {
    console.log('Saving item', payload)
  }
}
