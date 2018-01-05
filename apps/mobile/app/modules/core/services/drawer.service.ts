import { Injectable,ViewContainerRef } from '@angular/core';
import { SideDrawerType } from 'nativescript-pro-ui/sidedrawer/angular';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DrawerService {
  public drawer: SideDrawerType;
  public openWeb$: Subject<{title: string; url: string;}> = new Subject();

  public toggle(force?: boolean) {
    if (this.drawer) {
      if (typeof force !== 'undefined') {
        if (force === false) {
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
