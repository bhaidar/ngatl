import { Component } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Component({
  selector: 'ngatl-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  public title = 'NG-ATL 2019'
  public links = [{
    label: 'Speakers',
    path: '/conference/speakers',
  }, {
    label: 'Sessions',
    path: '/conference/sessions',
  }, {
    label: 'Schedule',
    path: '/conference/schedule',
  }, {
    label: 'Sponsors',
    path: '/conference/sponsors',
  }];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    )

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  logout() {
    console.log('Logout not implemented yet');
  }
}
