import { Component, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import * as utils from 'tns-core-modules/utils/utils';
import * as socialShare from 'nativescript-social-share';
import { compose as composeEmail, available as emailAvailable } from 'nativescript-email';

// app
import { ModalActions, LogService, WindowService } from '@ngatl/core';
import { NSAppService } from '../../core/services/ns-app.service';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-media',
  templateUrl: 'media.component.html'
})
export class MediaComponent {

  public renderView = false;
  public mediaState$: Observable<any>;
  private _media = [
    {
      name: '31South',
      logo: '~/assets/images/media/31south.jpg',
      link: 'https://www.31south.io/',
    },
    {
      name: 'This Dot',
      logo: '~/assets/images/media/this-dot-logo.jpg',
      link: 'https://www.thisdot.co/',
    }
  ];

  constructor(
    private store: Store<any>, 
    private log: LogService,
    private translate: TranslateService,
    private vcRef: ViewContainerRef,
    private win: WindowService,
    private appService: NSAppService,
  ) {
    this.appService.currentVcRef = this.vcRef;
    this.mediaState$ = Observable.of(this._media);
  }

  ngOnInit() {
    this.renderView = true;
  }

  public emailUs() {
    emailAvailable().then((avail) => {
      if (avail) {
        composeEmail({
          to: ['info@ng-atl.org'],
        }).then(_ => {
          
        }, (err) => {
          this.win.alert(this.translate.instant('general.error'));
        });
      }
    });
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
