import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'ui-card',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <ng-container *ngIf="editAction">
            <a href="" (click)="emit($event, editAction)">{{ title }}</a>
          </ng-container>
          <ng-container *ngIf="titleLink">
            <a href="" [routerLink]="titleLink">{{ title }}</a>
          </ng-container>
          <ng-container *ngIf="!editAction && !titleLink">
            {{ title }}
          </ng-container>
        </mat-card-title>
        <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
      </mat-card-header>
      <ng-container *ngIf="image">
        <img mat-card-image class="card-image" [attr.src]="image" [attr.alt]="title">
      </ng-container>
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      <mat-card-actions  fxLayoutAlign="end">
        <ng-container *ngIf="editAction">
          <button mat-button (click)="emit($event, editAction)">
            <mat-icon>edit</mat-icon>
          </button>
        </ng-container>
        <ng-container *ngIf="deleteAction">
          <button mat-button (click)="emit($event, deleteAction)">
            <mat-icon>delete_forever</mat-icon>
          </button>
        </ng-container>
      </mat-card-actions>
    </mat-card>
  `,
})
export class CardComponent {
  @Input() public image: string;
  @Input() public payload: any;
  @Input() public title: string;
  @Input() public titleLink: string | string[];
  @Input() public editAction: string;
  @Input() public deleteAction: string;
  @Input() public subtitle: string;
  @Output() public action = new EventEmitter();

  emit($event, action) {
    $event.preventDefault();
    $event.stopPropagation();
    this.action.emit({ type: action, payload: this.payload });
  }
}
