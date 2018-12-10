import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ModalFormData {
  fields: any[];
  model: any;
}

@Component({
  template: `    
    <div mat-dialog-content>
      <ui-form [model]="data.model" [fields]="data.fields"></ui-form>
    </div>
    <div mat-dialog-actions  fxLayoutAlign="end">
      <button mat-button (click)="close()">
        Close
      </button>
      <button  mat-button [mat-dialog-close]="data.model" color="primary" cdkFocusInitial>
        Save
      </button>
    </div>
  `,
})
export class ModalFormComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalFormData
  ) {}

  public close() {
    this.dialogRef.close();
  }
}
