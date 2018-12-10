import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

import { ModalConfirmComponent } from '../components/modal-confirm/modal-confirm.component';
import { ModalFormComponent } from '../components/modal-form/modal-form.component';

@Injectable({ providedIn: 'root' })
export class AdminUiService {
  constructor(public dialog: MatDialog) {}

  openModalConfirm(data: { title?: string; text?: string } = {}) {
    const title = data.title || 'Are you sure?';
    const text = data.text;
    return this.openModal('confirm', { title, text });
  }

  openModalForm(fields: any[], model: any) {
    return this.openModal('form', { fields, model });
  }

  openModal(type: 'confirm' | 'form', data) {
    return this.dialog
      .open(this.getModalType(type), {
        minWidth: 400,
        data
      })
      .afterClosed()
      .pipe(filter(Boolean));
  }

  getModalType(type: string): any {
    switch (type) {
      case 'confirm':
        return ModalConfirmComponent;
      case 'form':
        return ModalFormComponent;
    }
  }
}
