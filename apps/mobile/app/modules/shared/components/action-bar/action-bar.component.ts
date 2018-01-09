import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { IAppState, UserState, ModalActions } from '@ngatl/core';
import { NSAppService } from '../../../core/services/ns-app.service';
import { DrawerService } from '../../../core/services/drawer.service';
import { HelpComponent } from '../help/help.component';

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
    private drawer: DrawerService,
    private appService: NSAppService,
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

  public openHelpOrProfile() {
    if (this.currentUser) {
      this.router.navigate(['/profile']);
    } else {
      this.store.dispatch(new ModalActions.OpenAction({
        cmpType: HelpComponent,
        modalOptions: {
          viewContainerRef: this.appService.currentVcRef,
        }
      }))
    }
  }
}
