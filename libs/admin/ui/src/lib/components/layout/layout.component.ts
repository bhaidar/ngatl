import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Link, LinkGroup, sidebarGroups, sidebarTopLinks } from '../../config/navigation'
import { AuthProcessService } from 'ngx-auth-firebaseui'
import { User } from 'firebase/app';

@Component({
  selector: 'ui-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  public topLinks: Link[] = sidebarTopLinks
  public groups: LinkGroup[] = sidebarGroups

  get user$(): Observable<User | null> {
    return this.auth.afa.user
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    public auth: AuthProcessService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  logout() {
    console.log('Logout not implemented yet');
  }
}
