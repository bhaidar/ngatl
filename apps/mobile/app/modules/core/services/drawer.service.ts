import { Injectable,ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SideDrawerType } from 'nativescript-pro-ui/sidedrawer/angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DrawerService {
  public drawer: SideDrawerType;
  public activeRoute$: BehaviorSubject<string> = new BehaviorSubject(null);
  public openWeb$: Subject<{title: string; url: string;}> = new Subject();

  constructor(
    private _router: Router,
  ) {
    this._router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.toggle(false);
        this.activeRoute$.next(e.url);
      }
    });
  }

  public toggle(force?: boolean) {
    if (this.drawer) {
      if (typeof force !== 'undefined') {
        if (force === false && this.drawer.getIsOpen()) {
          this.drawer.closeDrawer();
        } else {
        }
      } else {
        // console.log(`calling toggleDrawerState`);
        this.drawer.toggleDrawerState();
      }
    }
  }
}
