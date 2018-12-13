import { Component, ContentChild, Input, TemplateRef } from '@angular/core'

import { CrudService } from '../../services/crud.service'
import { GridTemplateDirective } from '@ngatl/admin/ui/src/lib/components/grid/grid-template.directive'

@Component({
  selector: 'ui-crud-grid',
  template: `
    <ng-container *ngIf="service">
      <ui-search [options]="service.options | async" (action)="service.handleAction($event)"></ui-search>
      <div class="add-button" *ngIf="showButton">
        <button mat-fab color="primary" (click)="service.addItem()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <ui-grid [items]="service.items" [rowHeight]="rowHeight">
        <ng-container *uiGridTemplate="let item">
          <ui-card
            (action)="service.handleAction($event)"
            [deleteAction]="service.actions.DELETE"
            [editAction]="service.actions.EDIT"
            [payload]="item"
            [image]="service.getImageProp(item)"
            [title]="service.getTitleProp(item)"
            [subtitle]="service.getSubtitleProp(item)">
            <ng-container
              *ngTemplateOutlet="itemTemplate; context: { $implicit: item }">
            </ng-container>
          </ui-card>
        </ng-container>
      </ui-grid>
    </ng-container>
  `,
  styles: [
      `
      :host {
        height: 100%;
      }
      .add-button {
        z-index: 10;
        position: fixed;
        bottom: 30px;
        right: 40px;
        display: flex;
        align-self: flex-end;
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
  @Input() public showButton = true
  @Input() public rowHeight = 150
  @Input() public service: CrudService<any>

  @ContentChild(GridTemplateDirective, {read: TemplateRef})
  itemTemplate: TemplateRef<any>
}
