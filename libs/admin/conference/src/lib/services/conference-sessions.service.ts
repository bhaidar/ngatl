import { Injectable } from '@angular/core';
import { AdminUiService } from '@ngatl/admin/ui/src/lib/services/admin-ui.service';
import { map } from 'rxjs/operators'

enum actions {
  DELETE = 'DELETE',
  EDIT = 'EDIT'
}

@Injectable({ providedIn: 'root' })
export class ConferenceSessionsService {
  public items = [];

  constructor(private ui: AdminUiService) {
    this.items = Array(100)
      .fill(0)
      .map((_, idx) => {
        return {
          title: 'Session title ' + idx,
          subtitle: 'Session subtitle ' + idx,
          editAction: actions.EDIT,
          deleteAction: actions.DELETE
        };
      });
  }

  handleAction({ type, payload }) {
    switch (type) {
      case actions.DELETE: {
        return this.ui.openModalConfirm()
          .pipe(map(() => this.deleteItem(payload)))
          .subscribe();
      }
      case actions.EDIT: {
        return this.ui.openModalForm([], payload)
          .pipe(map(res => this.saveItem(res)))
          .subscribe();
      }
    }
  }

  addItem() {
    this.handleAction({ type: actions.EDIT, payload: {} });
  }

  deleteItem(payload) {
    console.log('Delete item', payload);
  }

  saveItem(payload) {
    console.log('Saving item', payload);
  }
}
