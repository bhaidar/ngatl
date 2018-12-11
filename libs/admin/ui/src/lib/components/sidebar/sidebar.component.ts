import { Component, Input } from '@angular/core'

export class LinkGroup {
  label: string
  links: Link[]
  open?: boolean
  icon?: string
}

export class Link {
  label: string
  path: string
  icon?: string
}

@Component({
  selector: 'ui-sidebar',
  template: `
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
      margin-right: 10px;
    }
    mat-panel-title span {
      padding-top: 4px;
    }
  `]
})
export class SidebarComponent {
  @Input() public groups: LinkGroup[] = []
}
