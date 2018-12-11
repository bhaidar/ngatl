import { Component, Input } from '@angular/core'
import { Link, LinkGroup } from '../../config/navigation'

@Component({
  selector: 'ui-sidebar',
  template: `
    <mat-nav-list>
      <a mat-list-item [routerLink]="link.path" *ngFor="let link of topLinks" routerLinkActive="mat-list-item-active">
        <mat-icon *ngIf="link.icon">{{link.icon}}</mat-icon>
        {{link.label}}
      </a>
    </mat-nav-list>
    <mat-accordion [multi]="true">
      <mat-expansion-panel *ngFor="let group of groups" [expanded]="group.open">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon *ngIf="group.icon">{{group.icon}}</mat-icon>
            <span>{{ group.label }}</span>
          </mat-panel-title>
        </mat-expansion-panel-header>
        <mat-nav-list>
          <a mat-list-item [routerLink]="link.path" *ngFor="let link of group.links" routerLinkActive="mat-list-item-active">
            <mat-icon *ngIf="link.icon">{{link.icon}}</mat-icon>
            {{link.label}}
          </a>
        </mat-nav-list>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [`
    mat-icon {
      margin-right: 16px;
    }
    mat-panel-title span {
      padding-top: 4px;
    }
    mat-expansion-panel-header {
      padding: 0 16px;
    }
    :host ::ng-deep .mat-expansion-panel-body {
      padding: 0 0 16px;
    }
    :host ::ng-deep .mat-expansion-panel-body mat-icon {
      margin-left: 24px;
    }
  `]
})
export class SidebarComponent {
  @Input() public groups: LinkGroup[] = []
  @Input() public topLinks: Link[] = []
}
