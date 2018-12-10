import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ModalFormData {
  fields: any[];
  model: any;
}

@Component({
  template: `    
    <div mat-dialog-content>
      <pre>fields {{ fields | json }} </pre>
      <pre>model {{ model | json }} </pre>
    </div>
    <div mat-dialog-actions  fxLayoutAlign="end">
      <button mat-button (click)="close()">
        Close
      </button>
      <button  mat-button [mat-dialog-close]="model" color="primary" cdkFocusInitial>
        Save
      </button>
    </div>
  `,
})
export class ModalFormComponent {
  @Input() public fields: any[];
  @Input() public form = new FormGroup({});
  @Input() public model: any;
  @Output() public action = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalFormData
  ) {
    this.fields = this.data.fields;
    this.model = this.data.model;
  }

  public close() {
    this.dialogRef.close();
  }
}
