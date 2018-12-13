import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MediaChange, ObservableMedia } from '@angular/flex-layout'
import { filter } from 'rxjs/operators';

import { ModalConfirmComponent } from '../components/modal-confirm/modal-confirm.component';
import { ModalFormComponent } from '../components/modal-form/modal-form.component';

const gridColsDefaults = {
  xl: 4,
  lg: 3,
  md: 2,
  sm: 1,
  xs: 1
};

const gridRowHeightDefaults = {
  xl: 150,
  lg: 150,
  md: 150,
  sm: 150,
  xs: 150
};

@Injectable({ providedIn: 'root' })
export class AdminUiService {
  public breakpoint = 'xl';
  public gridCols = gridColsDefaults.xl;
  public gridRowHeight = gridRowHeightDefaults.xl;

  constructor(
    public dialog: MatDialog,
    observableMedia: ObservableMedia
  ) {
    observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.breakpoint = change.mqAlias;
      this.gridCols = gridColsDefaults[this.breakpoint];
      this.gridRowHeight = gridRowHeightDefaults[this.breakpoint];
    });
  }

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
