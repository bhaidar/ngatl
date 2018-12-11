import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LinkGroup } from '../sidebar/sidebar.component';

@Component({
  selector: 'ui-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  public title = 'NG-ATL 2019';
  public groups: LinkGroup[] = [
    {
      label: 'Conference',
      icon: 'supervisor_account',
      open: true,
      links: [
        {
          label: 'Speakers',
          path: '/conference/speakers',
          icon: 'person_outline'
        },
        {
          label: 'Sessions',
          path: '/conference/sessions',
          icon: 'calendar_today'
        },
        {
          label: 'Schedule',
          path: '/conference/schedule',
          icon: 'calendar_view_day'
        },
        {
          label: 'Sponsors',
          path: '/conference/sponsors',
          icon: 'monetization_on '
        }
      ]
    },
    {
      label: 'System',
      icon: 'adjust',
      open: true,
      links: [
        {
          label: 'Users',
          path: '/system/users',
          icon: 'people'
        },
        {
          label: 'Settings',
          path: '/settings',
          icon: 'settings'
        }
      ]
    }
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}

  logout() {
    console.log('Logout not implemented yet');
  }
}
