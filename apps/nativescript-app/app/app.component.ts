import { Component } from '@angular/core';
import { Router } from '@angular/router';

// libs
import { AppBaseComponent, AppService, DrawerService } from '@ngatl/nativescript';
import {
  DrawerTransitionBase,
  SlideInOnTopTransition
} from 'nativescript-ui-sidedrawer';
import { isAndroid } from 'tns-core-modules/platform';
import { RouterExtensions } from 'nativescript-angular/router';
import { registerElement } from 'nativescript-angular/element-registry';
registerElement('CameraPlus', () => require('@nstudio/nativescript-camera-plus').CameraPlus);

import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, map } from 'rxjs/operators';
import { SystemUser } from '@ngatl/api';
import { UserState, ICoreState, BaseComponent, WindowService } from '@ngatl/core';

@Component({
  selector: 'ngatl-root',
  templateUrl: 'app.component.html'
})
export class AppComponent extends AppBaseComponent {

  public user: UserState.IRegisteredUser;// SystemUser;
  public activeUrl = '/home';
  private _sideDrawerTransition: DrawerTransitionBase;

  constructor(
    private store: Store<any>,
    private translate: TranslateService,
    private win: WindowService,
    private _ngRouter: Router,
    private _router: RouterExtensions,
    private _drawer: DrawerService,
    appService: AppService
  ) {
    super(appService);
  }

  ngOnInit(): void {
    this._sideDrawerTransition = new SlideInOnTopTransition();
    this.store.select((s: ICoreState) => s.user).subscribe((state: UserState.IState) => {
      this.user = state.current;
    });

    this._drawer.activeRoute$
      .pipe(
        takeUntil(this.destroy$)
        ).subscribe(urlPath => {
          this.activeUrl = urlPath;
          if (isAndroid) {
            this.win.setTimeout(_ => {
              this.appService.toggleSpinner(false);
            }, 600);
          }
        });
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  public changeNav(route) {
    if (this.activeUrl !== route) {
      // this.appService.toggleSpinner(true);
      // this.win.setTimeout(_ => {
        this._router.navigate(route);
      // }, 400);
    } else {
      this._drawer.toggle(false);
    }
  }

  // public onLoaded(args) {
  // }

  public logout() {
    this._drawer.toggle(false);
  }

  public openWeb(url: string, title: string) {
    this._drawer.toggle(false);
    this._drawer.openWeb$.next({
      url, 
      title
    });
  }
}
