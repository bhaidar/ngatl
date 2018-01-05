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
  selector: 'ngatl-ns-community',
  templateUrl: 'community.component.html'
})
export class CommunityComponent {

  public communityState$: Observable<any>;
  private _community = [
    {
      name: 'AngularAir',
      logo: '~/assets/images/community/ng-air-logo-light.png',
      link: 'https://angularair.com/',
    },
    {
      name: 'ngGirls',
      logo: '~/assets/images/community/ngGirls.png',
      link: 'http://ng-girls.org/',
    },
    {
      name: 'Vets Who Code',
      logo: '~/assets/images/community/VetsWhoCode.jpg',
      link: 'http://vetswhocode.io/',
    },
    {
      name: 'Atlanta JavaScript Meetup',
      logo: '~/assets/images/community/AtlJS.png',
      link: 'https://www.meetup.com/AtlantaJavaScript/',
    },
    {
      name: 'Angular Academy',
      logo: '~/assets/images/community/AngularAcademy.png',
      link: 'https://www.angularacademy.ca',
    },
    {
      name: 'Women Who Code, Atlanta',
      logo: '~/assets/images/community/WomenWhoCode.jpg',
      link: 'https://www.meetup.com/Women-Who-Code-Atlanta/',
    },
    {
      name: 'ATL-Angular',
      logo: '~/assets/images/community/AtlAngular.jpg',
      link: 'https://www.meetup.com/ATL-Angular/',
    },
    {
      name: 'Front End Happy Hour',
      logo: '~/assets/images/community/front-end-happy-hour.png',
      link: 'http://frontendhappyhour.com/',
    },
    {
      name: 'Women Techmakers Atlanta',
      logo: '~/assets/images/community/wtm-logo.png',
      link: 'https://www.womentechmakers.com/',
    },
    {
      name: 'Google Developer Group Atlanta',
      logo: '~/assets/images/community/gdg-atl-logo.png',
      link: 'https://www.meetup.com/gdg-atlanta/',
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
    this.communityState$ = Observable.of(this._community);
  }

  public viewSite(url: string, title: string) {
    this.appService.openWebView({
      vcRef: this.vcRef,
      context: {
        url,
        title
      }
    })
  }
}