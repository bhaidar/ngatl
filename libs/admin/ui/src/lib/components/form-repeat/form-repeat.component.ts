import { Component } from '@angular/core';
import { FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';

@Component({
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index">
      <formly-group [field]="field">
        <div class="flex-1" style="align-self: center">
          <button
            class="mat-button mat-button btn-block"
            type="button"
            (click)="remove(i)"
          >
            {{ btnTextRemove }}
          </button>
        </div>
      </formly-group>
    </div>
    <div
      style="text-align: right; margin-right: 10px; margin-bottom: 10px;"
      *ngIf="btnText"
    >
      <button class="mat-button mat-accent" type="button" (click)="add()">
        {{ btnText }}
      </button>
    </div>
  `
})
export class FormRepeatComponent extends FieldArrayType {
  constructor(builder: FormlyFormBuilder) {
    super(builder);
  }

  get btnText() {
    return this.to.btnText || 'Add';
  }

  get btnTextRemove() {
    return this.to.btnTextRemove || 'Remove';
  }
}
