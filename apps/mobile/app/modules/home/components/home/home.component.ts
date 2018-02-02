import {
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  Inject,
  OnInit
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SystemUser } from '@ngatl/api';
import { UserState, IAppState, BaseComponent, WindowService } from '@ngatl/core';

// nativescript
import { Page } from 'tns-core-modules/ui/page';
import { RadSideDrawerComponent } from 'nativescript-pro-ui/sidedrawer/angular';
import { PushTransition, DrawerTransitionBase, SlideInOnTopTransition, ScaleDownPusherTransition, ReverseSlideOutTransition, SlideAlongTransition } from 'nativescript-pro-ui/sidedrawer';
import { RouterExtensions } from 'nativescript-angular/router';
import { isAndroid } from 'tns-core-modules/platform';

// app
import { NSAppService } from '../../../core/services/ns-app.service';
import { DrawerService } from '../../../core/services/drawer.service';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent extends BaseComponent implements OnInit {
  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  public user: UserState.IRegisteredUser;// SystemUser;
  public activeUrl: string = '/landing/home';
  private _sideDrawerTransition: DrawerTransitionBase;

  constructor(
    @Inject(Page) private page: Page,
    private cdRef: ChangeDetectorRef,
    private vcRef: ViewContainerRef,
    private router: Router,
    private store: Store<any>,
    private translate: TranslateService,
    private appService: NSAppService,
    private routerExt: RouterExtensions,
    private win: WindowService,
    public drawerService: DrawerService
  ) {
    super();
    // this.page.on('loaded', this.onLoaded, this);
    this._sideDrawerTransition = new SlideInOnTopTransition();
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  public changeNav(route) {
    if (this.activeUrl !== route) {
      this.appService.toggleSpinner(true);
      this.win.setTimeout(_ => {
        this.routerExt.navigate(route);
      }, 400);
    } else {
      this.drawerService.toggle(false);
    }
  }

  // public onLoaded(args) {
  // }

  public logout() {
    this.drawerService.toggle(false);
  }

  public openWeb(url: string, title: string) {
    this.drawerService.toggle(false);
    this.drawerService.openWeb$.next({
      url, 
      title
    });
  }

  ngOnInit() {
    // this.log.debug(`HomeComponent ngOnInit`);

    // react to user state
    this.store.select((s: IAppState) => s.user).subscribe((state: UserState.IState) => {
      this.user = state.current;
    });

    this.drawerService.activeRoute$
        .takeUntil(this.destroy$)
        .subscribe(urlPath => {
          this.activeUrl = urlPath;
          if (isAndroid) {
            this.win.setTimeout(_ => {
              this.appService.toggleSpinner(false);
            }, 600);
          }
        });
  }

  ngAfterViewInit() {
    // this.log.debug(`HomeComponent ngAfterViewInit`);
    this.drawerService.drawer = this.drawerComponent.sideDrawer;
    this.cdRef.detectChanges();
  }
}
