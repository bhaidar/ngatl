import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// app
import { moreIcon, backIcon } from '../../helpers';
import { LogService, IAppState } from '@ngatl/core';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-profile-action-bar',
  templateUrl: 'profile-action-bar.component.html'
})
export class ProfileActionBarComponent implements OnInit {
  @Input() public title: string;
  @Output() public save: EventEmitter<boolean> = new EventEmitter();
  public searchInput: string;
  public backIcon: string;
  public moreIcon: string;

  constructor(
    private store: Store<IAppState>, 
    private router: RouterExtensions, 
    private log: LogService
  ) {}

  public back() {
    this.router.back();
  }

  public more() {
    this.log.info('more!');
  }

  ngOnInit() {
    this.backIcon = backIcon();
    this.moreIcon = moreIcon();
  }
}
