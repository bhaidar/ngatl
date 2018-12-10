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
    path: 'speakers',
  }, {
    label: 'Sessions',
    path: 'sessions',
  }, {
    label: 'Schedule',
    path: 'schedule',
  }, {
    label: 'Sponsors',
    path: 'sponsors',
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
