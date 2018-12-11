import { Component } from '@angular/core';
import { sidebarGroups } from '@ngatl/admin/ui/src/lib/config/navigation'

@Component({
  template: `
    <ng-container *ngFor="let item of items">
      <ui-grid [items]="item.links" [rowHeight]="100">
        <ng-container *uiGridTemplate="let item">
          <ui-card [title]="item.label" [titleLink]="item.path" [subtitle]="'Manage ' + item.label"></ui-card>
        </ng-container>
      </ui-grid>
    </ng-container>
  `
})
export class DashboardComponent {
  public items = sidebarGroups
}
