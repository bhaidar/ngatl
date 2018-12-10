// angular
import { Component, Input, Output, EventEmitter } from '@angular/core';

// nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { moreIcon, backIcon } from '@ngatl/nativescript/utils';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-action-bar-back',
  templateUrl: 'action-bar-back.component.html'
})
export class ActionBarBackComponent {
  @Input() title: string;
  @Input() backIcon: string;
  @Input() showMoreIcon: boolean;
  @Input() backGuard: Function;
  @Input() rightButtonLabel: string;
  @Output() rightButtonTap: EventEmitter<any> = new EventEmitter();

  public moreIcon: string;

  constructor(private _router: RouterExtensions) {}

  ngOnInit() {
    if (!this.backIcon) {
      this.backIcon = backIcon();
    }
    this.moreIcon = moreIcon();
  }

  public back() {
    if ( this.backGuard ) {
      if ( this.backGuard() ) {
        // only nav back if guard allows
        this._router.back();
      }
    } else {
      this._router.back();
    }
  }
}
