import { Injectable } from '@angular/core'
import { AdminUiService } from './admin-ui.service'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { FormField } from '../helpers'
import { BehaviorSubject, Observable } from 'rxjs'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { ConferenceSpeaker } from '@ngatl/admin/conference/src/lib/types'

enum actions {
  DELETE = 'DELETE',
  EDIT = 'EDIT'
}

@Injectable()
export class CrudService<T> {
  public readonly db: AngularFirestore
  public readonly ui: AdminUiService;
  public collection: AngularFirestoreCollection<T>;
  public actions;
  public allItems: T[] = []
  public items: T[] = []
  public formFields: FormField[] = []
  public query = new BehaviorSubject<string>('');

  constructor(ui: AdminUiService, db: AngularFirestore) {
    this.ui = ui;
    this.db = db;
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

  init(path: string) {
    this.collection = this.db.collection<T>(path);
    this.items$.subscribe(res => this.setItems(res))
  }

  get items$(): Observable<T[]> {
    return this.collection.valueChanges()
  }

  setItems(items: T[]) {
    this.allItems = this.items = items;
  }

  addItem() {
    this.handleAction({type: actions.EDIT, payload: {}})
  }

  async deleteItem(payload) {
    await this.collection.doc(payload.id).delete()
  }

  async saveItem(payload: any) {
    if (!payload.id || !payload.uid) {
      payload.uid = payload.id = this.db.createId()
      await this.collection.doc(payload.id).set(payload)
    } else {
      await this.collection.doc(payload.id).update(payload)
    }
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
