import { Component, Input } from '@angular/core';

import { CrudService } from '../../services/crud.service'

@Component({
  selector: 'ui-crud-grid',
  template: `
    <ng-container *ngIf="service">
      <ui-search [options]="service.options | async" (action)="service.handleAction($event)"></ui-search>
      <div class="add-button">
        <button mat-fab color="primary" (click)="service.addItem()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <ui-grid [items]="service.items" [rowHeight]="150">
        <ng-container *uiGridTemplate="let item">
          <ui-card
            (action)="service.handleAction($event)"
            [deleteAction]="service.actions.DELETE"
            [editAction]="service.actions.EDIT"
            [payload]="item"
            [title]="service.getTitleProp(item)"
            [subtitle]="service.getSubtitleProp(item)">
          </ui-card>
        </ng-container>
      </ui-grid>
    </ng-container>
  `,
  styles: [
    `
      .add-button {
        z-index: 10;
        position: fixed;
        bottom: 30px;
        right: 40px;
        display : flex;
        align-self : flex-end;
      }

      mat-toolbar {
        height: 128px;
      }
      form,
      mat-form-field {
        width: 100%;
      }
    `
  ]
})
export class CrudGridComponent {
  @Input() public service: CrudService<any>;
}
