import { Injectable } from '@angular/core'
import { AdminUiService } from './admin-ui.service'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { FormField } from '../helpers'
import { BehaviorSubject, Observable } from 'rxjs'

enum actions {
  DELETE = 'DELETE',
  EDIT = 'EDIT'
}

@Injectable()
export class CrudService<T> {
  public ui: AdminUiService;
  public actions;
  public allItems: T[] = []
  public items: T[] = []
  public formFields: FormField[] = []
  public query = new BehaviorSubject<string>('');

  constructor(ui: AdminUiService) {
    this.ui = ui;
    this.actions = actions
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

  filterItems(query: string): T[] {
    this.items = this.allItems.filter(item => this.getTitleProp(item).toLowerCase().includes(query.toLowerCase()))

    return this.items
  }

  public getImageProp(item: T): string|null {
    return null
  }

  public getTitleProp(item: T): string|null {
    return null
  }

  public getSubtitleProp(item: T): string|null {
    return null
  }

  getOptions(items: T[]) {
    return items.map(item => this.getTitleProp(item))
  }

  get options(): Observable<any> {
    return this.query$
      .pipe(
        distinctUntilChanged(),
        map(query => this.filterItems(query)),
        map(items => this.getOptions(items))
      )
  }

}
