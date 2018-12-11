import { Injectable } from '@angular/core'
import { AdminUiService } from '@ngatl/admin/ui/src/lib/services/admin-ui.service'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { FormField } from '@ngatl/admin/ui'
import { BehaviorSubject, Observable } from 'rxjs'

enum actions {
  DELETE = 'DELETE',
  EDIT = 'EDIT'
}

class SystemUser {
  name: string
  email: string
  role: string
}

@Injectable({providedIn: 'root'})
export class SystemUsersService {
  public actions;
  public allItems: SystemUser[] = []
  public items: SystemUser[] = []
  public formFields: FormField[] = [
    FormField.input('name', {
      label: 'Name',
      required: true,
    }),
    FormField.email('email', {
      label: 'Email',
      required: true,
    }),
    FormField.select('role', {
      label: 'Role',
      required: true,
      options: [{
        key: 'admin',
        value: 'Admin',
      },{
        key: 'editor',
        value: 'Editor',
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
          name: 'Dummy User' + idx,
          email: `user-${idx}@email.com`,
          role: 'editor',
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

  filterItems(query: string): SystemUser[] {
    this.items = this.allItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))

    return this.items
  }

  get autocomplete(): Observable<any> {
    return this.query$
      .pipe(
        distinctUntilChanged(),
        map(query => this.filterItems(query)),
        map(items => items.map(item => item.name))
      )
  }

}
