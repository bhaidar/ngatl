import { Component } from '@angular/core'

import { SystemUsersService } from '../../services/system-users.service'

@Component({
  template: `
    <ui-autocomplete [options]="crud.autocomplete | async" (action)="crud.handleAction($event)"></ui-autocomplete>
    <div class="add-button">
      <button mat-fab color="primary" (click)="crud.addItem()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
    <ui-grid [items]="crud.items">
      <ng-container *uiGridTemplate="let item">
        <ui-card
          (action)="crud.handleAction($event)"
          [deleteAction]="crud.actions.DELETE"
          [editAction]="crud.actions.EDIT"
          [payload]="item"
          [title]="item.name"
          [subtitle]="item.email">
        </ui-card>
      </ng-container>
    </ui-grid>
  `,
  styles: [`
    .add-button {
      z-index: 10;
      position: fixed;
      bottom: 30px;
      right: 40px;
      display : flex;
      align-self : flex-end;
    }
  `]
})
export class UsersIndexComponent {
  constructor(public crud: SystemUsersService ) {}
}
