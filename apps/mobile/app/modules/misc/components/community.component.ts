import { Component, ViewContainerRef } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import * as utils from 'tns-core-modules/utils/utils';
import * as socialShare from 'nativescript-social-share';
import { compose as composeEmail, available as emailAvailable } from 'nativescript-email';
import * as tnsHttp from 'tns-core-modules/http';

// app
import { ModalActions, LogService, WindowService } from '@ngatl/core';
import { NSAppService } from '../../core/services/ns-app.service';
import { sortAlpha } from '../../../helpers';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-community',
  templateUrl: 'community.component.html'
})
export class CommunityComponent {

  public renderView = false;
  public communityState$: Observable<any>;
  private _community = [  
    {  
       "link-to-website":"https://www.meetup.com/AngularJS-Beers/",
       "_archived":false,
       "_draft":false,
       "name":"Angular Beers",
       "logo":{  
          "fileId":"5a57b30371150700014a2db3",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a57b30371150700014a2db3_beers.png"
       },
       "slug":"angular-beers",
       "updated-on":"2018-01-11T18:55:01.582Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2018-01-11T18:55:01.582Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2018-01-11T18:55:04.757Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a57b3058d4d330001af58ac"
    },
    {  
       "link-to-website":"https://www.techtalentsouth.com/locations/atlanta/",
       "_archived":false,
       "_draft":false,
       "name":"Tech Talent South",
       "logo":{  
          "fileId":"5a4e9ce0832dd5000175cba3",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a4e9ce0832dd5000175cba3_techtalent.png"
       },
       "slug":"tech-talent-south",
       "updated-on":"2018-01-04T21:30:14.340Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2018-01-04T21:30:14.340Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2018-01-04T21:30:17.547Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a4e9ce684102100014b8fb4"
    },
    {  
       "link-to-website":"https://www.angularacademy.ca/",
       "_archived":false,
       "_draft":false,
       "name":"Angular Academy",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744430",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a1b6a9f90e70f000124a3aa_AngularAcademy.png"
       },
       "slug":"angular-academy",
       "updated-on":"2017-11-27T01:30:26.246Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-27T01:30:26.246Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a00017443b5"
    },
    {  
       "link-to-website":"https://thoughtram.io",
       "_archived":false,
       "_draft":false,
       "name":"Thoughtram",
       "slug":"thoughtram",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744385",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a13313960b93f00019b2bb9_logo.svg"
       },
       "updated-on":"2017-11-20T19:47:10.833Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-20T19:47:10.833Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a000174439e"
    },
    {  
       "link-to-website":"http://www.techsofcolor.org/",
       "_archived":false,
       "_draft":false,
       "name":"Technologists of Color",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443a7",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c692b25bfc9000190ad7a_Toc.png"
       },
       "slug":"technologists-of-color",
       "updated-on":"2017-11-15T16:19:58.580Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-15T16:19:58.580Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a00017443b1"
    },
    {  
       "link-to-website":"https://www.meetup.com/Latino-a-Developers-of-Atlanta/",
       "_archived":false,
       "_draft":false,
       "name":"Latinos In Tech",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744423",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c60e1f16f8200016b656b_lit-atl-logo.png"
       },
       "slug":"latinos-in-tech",
       "updated-on":"2017-11-15T15:45:08.363Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-15T15:45:08.363Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a00017443b3"
    },
    {  
       "link-to-website":"https://www.womentechmakers.com",
       "_archived":false,
       "_draft":false,
       "name":"Women Techmakers, Atlanta",
       "slug":"women-techmakers-atlanta",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744409",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc8f73b6086d0001493976_wtm-logo.png"
       },
       "updated-on":"2017-11-15T16:17:46.146Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-03T15:47:05.905Z",
       "created-by":"Collaborator_59fb40d65a1f1a00019b0b02",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a0001744357"
    },
    {  
       "_archived":false,
       "_draft":false,
       "name":"Women Who Code, Atlanta",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443d4",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9c2daea359e000107acc6_womens-who-code.png"
       },
       "slug":"women-who-code-atlanta",
       "updated-on":"2017-11-03T15:46:17.947Z",
       "updated-by":"Collaborator_59fb40d65a1f1a00019b0b02",
       "created-on":"2017-11-01T12:49:33.208Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-website":"https://www.meetup.com/Women-Who-Code-Atlanta/",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a0001744359"
    },
    {  
       "_archived":false,
       "_draft":false,
       "name":"Vets Who Code",
       "slug":"vets-who-code",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443d6",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9c2c2ea359e000107acc4_vets-who-code.png"
       },
       "updated-on":"2017-11-03T15:46:09.860Z",
       "updated-by":"Collaborator_59fb40d65a1f1a00019b0b02",
       "created-on":"2017-11-01T12:49:18.736Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-website":"http://vetswhocode.io",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a000174435b"
    },
    {  
       "_archived":false,
       "_draft":false,
       "name":"ngGirls",
       "slug":"nggirls",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443d3",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9c2b53b3286000183a08f_ng-girls.png"
       },
       "updated-on":"2017-11-03T15:45:56.479Z",
       "updated-by":"Collaborator_59fb40d65a1f1a00019b0b02",
       "created-on":"2017-11-01T12:48:55.354Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-website":"http://ng-girls.org",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a0001744369"
    },
    {  
       "_archived":false,
       "_draft":false,
       "name":"Google Developer Group, Atlanta",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443d7",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9c2a93b3286000183a088_google-dev-group-atl.png"
       },
       "slug":"google-developer-group-atlanta",
       "updated-on":"2017-11-15T16:17:52.324Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-01T12:48:43.765Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-website":"https://www.meetup.com/gdg-atlanta/",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a000174436d"
    },
    {  
       "_archived":false,
       "_draft":false,
       "name":"Front End Happy Hour",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443d5",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9c297269fd6000139bef2_front-end-happy-hour.png"
       },
       "slug":"front-end-happy-hour",
       "updated-on":"2017-11-03T15:45:48.919Z",
       "updated-by":"Collaborator_59fb40d65a1f1a00019b0b02",
       "created-on":"2017-11-01T12:48:27.262Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-website":"http://frontendhappyhour.com",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a0001744331"
    },
    {  
       "_archived":false,
       "_draft":false,
       "name":"Atlanta JavaScript Meetup",
       "slug":"atlanta-javascript-meetup",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443d2",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9c28901b9500001e84c5e_atl-js-meetup.png"
       },
       "updated-on":"2017-11-03T15:44:07.246Z",
       "updated-by":"Collaborator_59fb40d65a1f1a00019b0b02",
       "created-on":"2017-11-01T12:48:13.263Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-website":"https://www.meetup.com/AtlantaJavaScript/?_cookie-check=4acKDDSV0tsokl-T",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a0001744360"
    },
    {  
       "_archived":false,
       "_draft":false,
       "name":"ATL-Angular",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443da",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9a83bc9a5280001e4e806_atl-angular.png"
       },
       "slug":"atl-angular",
       "updated-on":"2017-11-15T16:17:39.363Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-01T10:55:58.206Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-website":"https://www.meetup.com/ATL-Angular/",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a000174436c"
    },
    {  
       "link-to-website":"https://angularair.com/",
       "_archived":false,
       "_draft":false,
       "name":"Angular Air",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443db",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9a6a8c9a5280001e4e77e_ang-air.png"
       },
       "slug":"angular-air",
       "updated-on":"2017-11-01T10:49:39.226Z",
       "updated-by":"Person_583abc2db333a5214d324efb",
       "created-on":"2017-11-01T10:49:39.226Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a000174431d",
       "_id":"5a2fc7cd99408a000174436f"
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
    const list = this._adjustImage(this._community).sort(sortAlpha);
    this.communityState$ = Observable.of(list);
  }

  private _adjustImage(list: Array<any>) {
    if (list) {
      list.forEach(i => {
        i.imageUrl$ = Observable.create(observer => {
          observer.next('~/assets/images/loading.png');
          if (i.logo && i.logo.url) {
            tnsHttp.getImage(i.logo.url).then(img => {
              observer.next(img);
              observer.complete();
            }, err => {
              observer.complete();
            });
          } else {
            observer.complete();
          }
        });
      });
      return list;
    }
    return [];
  }

  ngOnInit() {
    this.renderView = true;
  }

  public viewSite(item: any) {
    this.appService.openWebView({
      vcRef: this.vcRef,
      context: {
        url: item["link-to-website"],
        title: item.name
      }
    })
  }
}