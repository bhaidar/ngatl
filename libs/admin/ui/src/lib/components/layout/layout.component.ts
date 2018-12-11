import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Link, LinkGroup, sidebarGroups, sidebarTopLinks } from '../../config/navigation'

@Component({
  selector: 'ui-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  public title = 'NG-ATL 2019';
  public topLinks: Link[] = sidebarTopLinks
  public groups: LinkGroup[] = sidebarGroups

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}

  logout() {
    console.log('Logout not implemented yet');
  }
}
