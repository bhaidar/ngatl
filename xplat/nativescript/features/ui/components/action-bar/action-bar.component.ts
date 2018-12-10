import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { ICoreState, UserState, ModalActions, UserActions, UserService, BaseComponent, LogService } from '@ngatl/core';
import { AppService } from '@ngatl/nativescript/core/services/app.service';
import { DrawerService } from '@ngatl/nativescript/core/services/drawer.service';
import { HelpComponent } from '../help/help.component';

@Component( {
  moduleId: module.id,
  selector: 'ngatl-ns-action-bar',
  templateUrl: 'action-bar.component.html'
} )
export class ActionBarComponent extends BaseComponent {
  @Input() title: string;
  @Input() ready: boolean = true;
  @Input() intro: boolean = false;
  @Output() tappedTop: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private store: Store<ICoreState>,
    private router: RouterExtensions,
    private drawer: DrawerService,
    private log: LogService,
    private userService: UserService,
    public appService: AppService,
  ) { 
    super();
  }

  public toggleDrawer() {
    this.drawer.toggle();
  }

  public refreshUser() {
    this.tappedTop.next(true);
    if (this.appService.currentUser) {
      // could optionally scroll the current notes list to the top by dispatching an event
      this.store.dispatch(new UserActions.RefreshUserAction( {id: this.userService.currentUserId, user: this.appService.currentUser} ));
    }
  }

  public openProfileOrHelp() {
    if (this.appService.currentUser) {
      this.router.navigate( ['/profile'] );
    } else {
      this.store.dispatch(new ModalActions.OpenAction({
        cmpType: HelpComponent,
        modalOptions: {
          viewContainerRef: this.appService.currentVcRef,
        }
      }));
    }
  }
}
