import { Component, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as utils from 'tns-core-modules/utils/utils';
import * as socialShare from 'nativescript-social-share';
import { compose as composeEmail, available as emailAvailable } from 'nativescript-email';

// app
import { ModalActions, LogService, WindowService } from '@ngatl/core';
import { AppService } from '@ngatl/nativescript';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-conduct',
  templateUrl: 'conduct.component.html'
})
export class ConductComponent {

  public renderView = false;

  constructor(
    private store: Store<any>, 
    private log: LogService,
    private translate: TranslateService,
    private vcRef: ViewContainerRef,
    private win: WindowService,
    private appService: AppService,
  ) {
    this.appService.currentVcRef = this.vcRef;
  }

  ngOnInit() {
    this.renderView = true;
  }

  public emailUs() {
    this.appService.email('info@ng-atl.org');
  }

  public openWeb(url: string) {
    this.appService.openWebView({
      vcRef: this.vcRef,
      context: {
        url,
        title: this.translate.instant('conduct.title')
      }
    })
  }
}
