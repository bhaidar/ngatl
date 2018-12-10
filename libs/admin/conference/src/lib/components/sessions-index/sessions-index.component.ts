import { Component } from '@angular/core'

import { ConferenceSessionsService } from '../../services/conference-sessions.service'

@Component({
  template: `
    <div class="add-button">
      <button mat-fab color="primary" (click)="crud.addItem()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
    <ui-grid [items]="crud.items">
      <ng-container *uiGridTemplate="let item">
        <ui-card
          (action)="crud.handleAction($event)"
          [deleteAction]="item.deleteAction"
          [payload]="item"
          [title]="item.title"
          [editAction]="item.editAction"
          [subtitle]="item.subtitle">
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
export class SessionsIndexComponent {
  constructor(public crud: ConferenceSessionsService ) {}
}
