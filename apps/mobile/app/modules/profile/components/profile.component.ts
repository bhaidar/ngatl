import { Component, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// app
// import { LoggerService } from '@ngatl/api';
import { LogService, IAppState, UserState, BaseComponent, UserActions, WindowService, UserService } from '@ngatl/core';
import { NSAppService } from '../../core/services/ns-app.service';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent extends BaseComponent implements AfterViewInit, OnInit {

  public currentUser: UserState.IRegisteredUser;

  constructor(
    private store: Store<any>, 
    private router: RouterExtensions, 
    private log: LogService,
    private win: WindowService,
    private vcRef: ViewContainerRef,
    private userService: UserService,
    private appService: NSAppService,
  ) {
    super();
    this.appService.currentVcRef = this.vcRef;
  }

  public logout() {
    this.store.dispatch(new UserActions.LogoutAction());
    this.win.setTimeout(_ => {
      this.router.back();
    }, 300);
  }

  public unclaim() {
    this.store.dispatch(new UserActions.UnclaimUserAction(this.userService.badgeId));
    this.win.setTimeout(_ => {
      this.router.back();
    }, 300);
  }

  ngOnInit() {
    this.store.select((s: IAppState) => s.user)
      .takeUntil(this.destroy$)
      .subscribe((s: UserState.IState) => {
        // clone so user can make editing changes to bindings
        this.currentUser = new UserState.RegisteredUser(Object.assign({}, s.current));
      });
  }

  ngAfterViewInit() {}
}
