import { Injectable } from '@angular/core';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { LogService, ProgressService, WindowService } from '@ngatl/core/services';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as TnsApp from 'tns-core-modules/application';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class DrawerService {
  private _drawer: RadSideDrawer;
  private _init = false;
  private _gesturesEnabled = true;
  public activeRoute$: BehaviorSubject<string> = new BehaviorSubject(null);
  public openWeb$: Subject<{title: string; url: string;}> = new Subject();

  constructor(
    private _log: LogService,
    private _progress: ProgressService,
    private _win: WindowService,
    private _router: Router,
  ) {
    this._router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.toggle(false);
        console.log(e.url);
        this.activeRoute$.next(e.url);
      }
    });
  }

  get drawer() {
    return this._drawer;
  }

  set drawer(value: RadSideDrawer) {
    this._drawer = value;

    // setup drawer event handling
    if (!this._init && this._drawer) {
      this._init = true;
      this._addShadow();

      this._drawer.on('drawerOpened', () => {
        if (!this._gesturesEnabled) {
          // ensure gestures are turned back on always when opening (ignoring internal state)
          this.toggleGestures(true, false);
        }
      });
      this._drawer.on('drawerClosed', () => {
        if (!this._gesturesEnabled) {
          // ensure gestures are turned back off
          this.toggleGestures(false);
        }
      });
      if (!this._gesturesEnabled) {
        this.drawer.gesturesEnabled = false;
      }
    }
  }

  toggle(force?: boolean) {
    if (!this.drawer) {
      this.drawer = <RadSideDrawer>TnsApp.getRootView();
    }
    console.log('this.drawer:', typeof this.drawer);
    if (this.drawer) {
      if (typeof force !== 'undefined') {
        if (force === false && this.drawer.getIsOpen()) {
          this.drawer.closeDrawer();
        }
      } else {
        console.log(
          'this.drawer.toggleDrawerState:',
          this.drawer.toggleDrawerState
        );
        this.drawer.toggleDrawerState();
      }
    }
  }

  toggleGestures(value: boolean, trackInternally: boolean = true) {
    if (!this.drawer) {
      this.drawer = <RadSideDrawer>TnsApp.getRootView();
    }
    if (this.drawer) {
      this.drawer.gesturesEnabled = value;
    }
    // used to help control gestures when opening drawer via button even if gestures were initially off
    if (trackInternally) {
      this._gesturesEnabled = value;
    }
  }

  private _addShadow() {
    if (isIOS && this._drawer.ios) {
      // if your menu is drawn 'below' the hostview, do this:
      this._drawer.ios.defaultSideDrawer.style.shadowMode = 2; // TKSideDrawerShadowMode.Hostview;
      // .. but if the menu is drawn 'above' the hostview, do this:
      // drawer.ios.defaultSideDrawer.style.shadowMode = 2; // TKSideDrawerShadowMode.SideDrawer;
      // if you have shadowMode = 2, then you can add a little dim to the lower layer to add some depth. Keep it subtle though:
      this._drawer.ios.defaultSideDrawer.style.dimOpacity = 0.15;

      // then tweak the shadow to your liking:
      this._drawer.ios.defaultSideDrawer.style.shadowOpacity = 0.6; // 0-1, higher is darker
      this._drawer.ios.defaultSideDrawer.style.shadowRadius = 5; // higher is more spread
      // bonus feature: control the menu animation speed (in seconds)
      this._drawer.ios.defaultSideDrawer.transitionDuration = 0.25;
    }
  }
}
