import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { DrawerService } from '../../../core/services/drawer.service';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-action-bar',
  templateUrl: 'action-bar.component.html'
})
export class ActionBarComponent {
  @Input() title: string;
  @Input() ready: boolean = true;
  @Input() intro: boolean = false;

  constructor(private router: RouterExtensions, private drawer: DrawerService) {}

  public toggleDrawer() {
    this.drawer.toggle();
  }

  public openSearch() {
    this.router.navigate(['/search']);
  }
}
