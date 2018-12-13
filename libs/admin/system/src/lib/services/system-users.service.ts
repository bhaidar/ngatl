import { Injectable, OnDestroy } from '@angular/core'
import { AdminUiService, CrudService } from '@ngatl/admin/ui'
import { FormField } from '@ngatl/admin/ui'
import { Observable, Subscription } from 'rxjs'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { map, tap } from 'rxjs/operators'

class FbUser {
  uid: string
  displayName: string
  email: string
  photoURL: string
}

class SystemUser {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

const convertFbUser = (user: FbUser): SystemUser => ({
  id: user.uid,
  name: user.displayName,
  email: user.email,
  avatar: user.photoURL,
})

const convertSystemUser = (user: SystemUser): FbUser => ({
  uid: user.id,
  displayName: user.name,
  email: user.email,
  photoURL: user.avatar,
})

@Injectable({providedIn: 'root'})
export class SystemUsersService extends CrudService<SystemUser> implements OnDestroy {
  sub: Subscription;
  collection: AngularFirestoreCollection<FbUser>;

  get items$(): Observable<SystemUser[]> {
    return this.collection.valueChanges()
      .pipe(
        map(users => users.map((user => convertFbUser(user))))
      )
  }

  constructor(ui: AdminUiService, db: AngularFirestore) {
    super(ui)
    this.collection = db.collection<FbUser>('users');

    this.sub = this.items$
      .subscribe(res => this.setItems(res))

    this.formFields = [
      FormField.input('name', {
        label: 'Name',
        required: true,
        disabled: true,
      }),
      FormField.email('email', {
        label: 'Email',
        required: true,
        disabled: true,
      }),
      FormField.select('role', {
        label: 'Role',
        required: true,
        options: [{
          key: 'admin',
          value: 'Admin',
        }, {
          key: 'editor',
          value: 'Editor',
        },]
      })
    ]
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteItem(payload) {
    console.log('Delete item', payload)
  }

  saveItem(payload) {
    console.log('Saving item', payload)
    this.collection.doc(payload.id).update(convertSystemUser(payload))
  }

  getTitleProp(item: SystemUser) {
    return item.name
  }

  getSubtitleProp(item: SystemUser) {
    return item.email
  }

  private setItems(res: SystemUser[]) {
    this.allItems = this.items = res;
  }
}
