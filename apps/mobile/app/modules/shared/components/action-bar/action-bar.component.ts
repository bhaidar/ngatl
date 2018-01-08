import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { DrawerService } from '../../../core/services/drawer.service';
import { IAppState, UserState } from '@ngatl/core';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-action-bar',
  templateUrl: 'action-bar.component.html'
})
export class ActionBarComponent {
  @Input() title: string;
  @Input() ready: boolean = true;
  @Input() intro: boolean = false;
  public currentUser: UserState.IRegisteredUser;

  constructor(
    private store: Store<IAppState>,
    private router: RouterExtensions, 
    private drawer: DrawerService
  ) {}

  ngOnInit() {
    this.store.select((s: IAppState) => s.user)
      .subscribe((s: UserState.IState) => {
        this.currentUser = s.current;
      })
  }

  public toggleDrawer() {
    this.drawer.toggle();
  }

  public openProfile() {
    this.router.navigate(['/profile']);
  }
}
