import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

import { GridTemplateDirective } from './grid-template.directive';

@Component({
  selector: 'ui-grid',
  template: `
    <mat-grid-list [cols]="cols" [rowHeight]="rowHeight" [gutterSize]="gutterSize">
      <mat-grid-tile *ngIf="!items.length">
        <div class="grid-tile">
          
          <ui-card>
            <h2 style="margin: 20px; padding: 20px;">No items found...</h2>
          </ui-card>
          
        </div>
      </mat-grid-tile>
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

  get cols() {
    return this.items.length ? 2 : 1
  }
}
