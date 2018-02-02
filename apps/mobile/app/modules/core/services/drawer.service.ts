import { Injectable,ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { SideDrawerType } from 'nativescript-pro-ui/sidedrawer/angular';
import { isAndroid } from 'tns-core-modules/platform';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { ProgressService, WindowService } from '@ngatl/core';

@Injectable()
export class DrawerService {
  public drawer: SideDrawerType;
  public activeRoute$: BehaviorSubject<string> = new BehaviorSubject(null);
  public openWeb$: Subject<{title: string; url: string;}> = new Subject();

  constructor(
    private _router: Router,
    private _progress: ProgressService,
    private _win: WindowService,
  ) {
    this._router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        // if (isAndroid) {
        //   this._progress.toggleSpinner(true);
        // }
      } if (e instanceof NavigationEnd) {
        this.toggle(false);
        console.log(e.url);
        this.activeRoute$.next(e.url);
        if (isAndroid) {
          this._win.setTimeout(_ => {
            this._progress.toggleSpinner(false);
          }, 400);
        }

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
