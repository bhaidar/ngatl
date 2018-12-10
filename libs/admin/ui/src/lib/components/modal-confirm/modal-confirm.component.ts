import { Component, Inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ModalFormData {
  title: any[];
  text: any;
}

@Component({
  template: `    
    <h1 mat-dialog-title *ngIf="data.title">{{ data.title }}</h1>
    <div mat-dialog-content *ngIf="data.text">
      <p>{{ data.text }}</p>
    </div>
    <div mat-dialog-actions  fxLayoutAlign="end">
      <button mat-button (click)="close()">
        No
      </button>
      <button  mat-button [mat-dialog-close]="true" color="primary" cdkFocusInitial>
        Yes
      </button>
    </div>
  `,
})
export class ModalConfirmComponent {
  @Input() public form = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalFormData
  ) {}

  public close() {
    this.dialogRef.close();
  }
}
