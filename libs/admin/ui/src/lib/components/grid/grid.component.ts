import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

import { GridTemplateDirective } from './grid-template.directive';
import { AdminUiService } from '@ngatl/admin/ui'

@Component({
  selector: 'ui-grid',
  template: `
    <div class="no-items"  *ngIf="!items.length">
      <ui-card>
        <h2 class="no-items-text">No items found...</h2>
      </ui-card>
    </div>

    <mat-grid-list [cols]="ui.gridCols" [rowHeight]="ui.gridRowHeight" [gutterSize]="gutterSize">
      <mat-grid-tile *ngFor="let item of items">
        <div class="grid-tile">
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
          ></ng-container>
        </div>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [
    `
      :host {
        padding: 20px;
      }
      mat-grid-list {
        margin: 0 20px;
      }
      .no-items {
        padding: 0 22px;
      }
      .no-items-text {
        margin: 20px;
        padding: 20px;
        text-align: center;
      }
      .grid-tile {
        width: 100%;
        height: 100%;
        padding: 0 0.1rem;
      }
    `
  ]
})
export class GridComponent {
  @Input() public gutterSize = 20;
  @Input() public rowHeight = '200px';
  @Input() public items: any[];

  @ContentChild(GridTemplateDirective, { read: TemplateRef })
  itemTemplate: TemplateRef<any>;

  constructor(public ui: AdminUiService) {

  }


  get cols() {
    return this.items.length ? 3 : 1
  }

  get rows() {
    return this.rowHeight ? this.rowHeight : '2:3'
  }
}
