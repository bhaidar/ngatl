import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui/src/lib/services/admin-ui.service'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { FormField } from '@ngatl/admin/ui'
import { BehaviorSubject, Observable } from 'rxjs'

enum actions {
  DELETE = 'DELETE',
  EDIT = 'EDIT'
}

class ConferenceSession {
  title: string
  description: string
  date?: Date
  time?: Date
  duration?: number
  type: string
}

@Injectable({providedIn: 'root'})
export class ConferenceSessionsService {
  public actions;
  public allItems: ConferenceSession[] = []
  public items: ConferenceSession[] = []
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
  public query = new BehaviorSubject<string>('');

  constructor(private ui: AdminUiService) {
    this.actions = actions
    this.allItems = this.items = Array(100)
      .fill(0)
      .map((_, idx) => {
        return {
          title: 'Session title ' + idx,
          description: 'Session description ' + idx,
          type: 'talk',
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
      case 'SEARCH': {
        return this.query.next(payload);
      }
      default: {
        console.log('Unhandled action', { type, payload })
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

  public get query$(): Observable<string> {
    return this.query.asObservable()
  }

  filterItems(query: string): ConferenceSession[] {
    this.items = this.allItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))

    return this.items
  }

  get options(): Observable<any> {
    return this.query$
      .pipe(
        distinctUntilChanged(),
        map(query => this.filterItems(query)),
        map(items => items.map(item => item.title))
      )
  }

}
