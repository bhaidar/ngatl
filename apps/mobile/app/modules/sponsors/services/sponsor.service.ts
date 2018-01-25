// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// lib
import { Observable } from 'rxjs/Observable';
import * as tnsHttp from 'tns-core-modules/http';
import { ConferenceSponsorApi } from '@ngatl/api';
import { Cache, StorageKeys, StorageService, NetworkCommonService } from '@ngatl/core';
import { SponsorState } from '../states';
import { sortAlpha } from '../../../helpers';

export interface ILevels {
  gold: string;
  silver: string;
  diversity: string;
  diversitySupporter: string;
  attendee: string;
}
@Injectable()
export class SponsorService extends Cache {

  public levels: ILevels = {
    gold: 'Gold',
    silver: 'Silver',
    diversity: 'Diversity Advocate',
    diversitySupporter: 'Diversity Supporter',
    attendee: 'Attendee Prizes'
  };
  private _sponsorList: Array<any> = [  
    {  
       "link-to-site":"https://auth0.com",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"33cd9f6aa3354bb41b219c23da5dfecc",
       "name":"Auth0",
       "logo":{  
          "fileId":"5a622c5115539d00010fd269",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a622c5115539d00010fd269_auth0.png"
       },
       "slug":"auth0",
       "updated-on":"2018-01-19T17:35:24.608Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2018-01-19T17:35:24.608Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2018-01-19T17:35:27.708Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a622c5c3d79080001808121"
    },
    {  
       "color":"#9498a2",
       "link-to-site":"https://www.equimedia.co.uk/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"Equimedia Limited",
       "logo":{  
          "fileId":"5a5e26e42c769a00019d3b68",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a5e26e42c769a00019d3b68_equimedia.png"
       },
       "slug":"equimedia-limited",
       "updated-on":"2018-01-16T16:23:03.092Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2018-01-16T16:23:03.092Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2018-01-16T16:23:07.262Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a5e26e72c769a00019d3b6b"
    },
    {  
       "link-to-site":"https://github.com/ngrx/platform",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"33cd9f6aa3354bb41b219c23da5dfecc",
       "name":"ngrx",
       "logo":{  
          "fileId":"5a556f83c7613e00012cfd01",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a556f83c7613e00012cfd01_ngrx.png"
       },
       "slug":"ngrx",
       "updated-on":"2018-01-10T01:44:08.148Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2018-01-10T01:44:08.148Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2018-01-10T01:44:12.187Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a556fe818a3290001c0342b"
    },
    {  
       "color":"#9498a2",
       "link-to-site":"https://www.themuse.com/companies/ultimatesoftware",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"Ultimate Software",
       "logo":{  
          "fileId":"5a43ccd10a44cf0001f7c528",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a43ccd10a44cf0001f7c528_company-cmyk.png"
       },
       "slug":"ultimate-software",
       "updated-on":"2017-12-27T16:40:06.865Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-12-27T16:40:06.865Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-27T16:46:55.168Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a43cce6c08a7d0001beb013"
    },
    {  
       "color":"#ffb720",
       "link-to-site":"https://nodesource.com/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"1dd549a26129258fbd64081d8ecb347b",
       "name":"Nodesource",
       "logo":{  
          "fileId":"5a349190f22ae30001cac86f",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a349190f22ae30001cac86f_wordmark-600.png"
       },
       "slug":"nodesource",
       "updated-on":"2018-01-19T17:56:59.238Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-12-16T03:24:23.895Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2018-01-19T17:59:19.303Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "one-more-type-of-sponsor":"8f56ffd6c44c1266d3eb4b32d1771ac9",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a3491e7893f240001b67b93"
    },
    {  
       "color":"#9498a2",
       "link-to-site":"https://www.slalom.com/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"Slalom",
       "logo":{  
          "fileId":"5a32d421678f4d000131716b",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a32d421678f4d000131716b_image001.png"
       },
       "slug":"slalom",
       "updated-on":"2017-12-14T19:44:00.532Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-12-14T19:44:00.532Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-14T19:44:03.508Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a32d480cc43080001106575"
    },
    {  
       "link-to-site":"https://www.google.com/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"69bfedb0c9a2f70faa74329bfa5e4c93",
       "name":"Google",
       "logo":{  
          "fileId":"5a31654cd7d1bd00010acd74",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a31654cd7d1bd00010acd74_google.png"
       },
       "slug":"google",
       "updated-on":"2017-12-13T17:37:17.829Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-12-13T14:58:16.518Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-13T17:37:20.644Z",
       "published-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "one-more-type-of-sponsor":"3fc248e2676f313ccaf1a0a63b72fff0",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a314008678f4d00013144f6"
    },
    {  
       "link-to-site":"https://www.infragistics.com/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"dfd550c1a6d41c9cd026f36a7d933cb5",
       "name":"Infragistics",
       "slug":"infragistics",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744433",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a2eccf889ff870001e04384_infragistics.jpg"
       },
       "updated-on":"2017-12-11T18:23:07.472Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-12-11T18:23:07.472Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a00017443c2"
    },
    {  
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"dfd550c1a6d41c9cd026f36a7d933cb5",
       "name":"Together With Google",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744432",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a2eccbe829f2400010b43c2_customLogo.png"
       },
       "slug":"together-with-google",
       "updated-on":"2017-12-11T18:23:32.790Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-12-11T18:22:01.756Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-site":"https://sites.google.com/site/togetherwithgdevelopers/home",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a000174431e"
    },
    {  
       "color":"#9498a2",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"Ionic",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744431",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a20a2fa3bc5300001dde00c_ionic.png"
       },
       "slug":"ionic",
       "updated-on":"2017-12-01T00:32:25.491Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-12-01T00:32:04.377Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-site":"http://ionicframework.com/",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a000174432a"
    },
    {  
       "color":"#9498a2",
       "link-to-site":"http://jobs.keysight.com/atl/#section-keysight-software-design-center",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"Keysight Technologies",
       "logo":{  
          "fileId":"5a2fc7cd99408a000174442a",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a1e22d268e933000102e148_keysight.png"
       },
       "slug":"keysight-technologies",
       "updated-on":"2017-11-30T12:44:14.144Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-29T03:01:15.744Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a00017443bd"
    },
    {  
       "color":"#9498a2",
       "link-to-site":"https://www.hirez.io/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"HiRez.io",
       "slug":"hirez-io",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744429",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a1329dda31b990001a9c115_hirez-logo.png"
       },
       "updated-on":"2017-11-20T19:15:43.059Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-20T17:49:57.474Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a0001744380"
    },
    {  
       "color":"#9498a2",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"GrapeCity",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443c9",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a1314fa2673270001ea22c9_GC-logo_purple_780x90.png"
       },
       "slug":"grapecity",
       "updated-on":"2017-11-20T17:47:09.575Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-20T17:46:50.888Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-site":"https://www.grapecity.com/en",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a0001744337"
    },
    {  
       "link-to-site":"https://number8.com/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"number8",
       "slug":"number8",
       "updated-on":"2017-11-18T19:19:36.135Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-18T19:18:20.925Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443c3",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a10879bf53f0400011b0d39_number8.png"
       },
       "color":"#9498a2",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a00017443af"
    },
    {  
       "link-to-site":"https://www.jetbrains.com/",
       "_archived":false,
       "_draft":false,
       "name":"Jet Brains",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744425",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c62d38d1e180001c38418_jetbrains.png"
       },
       "slug":"jet-brains",
       "updated-on":"2017-11-15T16:09:51.447Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-15T15:53:14.081Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "type-of-sponsor":"dfd550c1a6d41c9cd026f36a7d933cb5",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a0001744343"
    },
    {  
       "_archived":false,
       "_draft":false,
       "name":"The Weather Company",
       "slug":"the-weather-company",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744422",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c62268ecc2000012f22a3_weather.png"
       },
       "updated-on":"2017-11-15T16:16:42.655Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-15T15:50:22.783Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-site":"http://www.theweathercompany.com/",
       "type-of-sponsor":"fc89f29d224adebcb44396e8e8a38be8",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a000174434a"
    },
    {  
       "link-to-site":"http://webjunto.com/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"1dd549a26129258fbd64081d8ecb347b",
       "name":"Webjunto",
       "logo":{  
          "fileId":"5a2fc7cd99408a0001744424",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c6126f16f8200016b6579_webjunto.png"
       },
       "slug":"web-junto",
       "updated-on":"2017-11-27T01:30:44.673Z",
       "updated-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "created-on":"2017-11-15T15:48:53.451Z",
       "created-by":"Collaborator_5a009ab5cd54e70001a53c9b",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "one-more-type-of-sponsor":"8f56ffd6c44c1266d3eb4b32d1771ac9",
       "color":"#ffb720",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a000174434c"
    },
    {  
       "link-to-site":"http://valor-software.com/",
       "color":"#ffb720",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"1dd549a26129258fbd64081d8ecb347b",
       "name":"Valor Software",
       "slug":"valor-software",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443ca",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f99f07ea359e0001078a2d_valor.png"
       },
       "updated-on":"2017-11-06T13:06:54.671Z",
       "updated-by":"Person_583abc2db333a5214d324efb",
       "created-on":"2017-11-01T10:16:47.083Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a0001744333"
    },
    {  
       "link-to-site":"https://www.tsys.com/",
       "color":"#9498a2",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"TSYS",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443cd",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f99eea269fd60001399c95_tsys.png"
       },
       "slug":"tsys",
       "updated-on":"2017-11-06T13:07:41.131Z",
       "updated-by":"Person_583abc2db333a5214d324efb",
       "created-on":"2017-11-01T10:16:30.798Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a000174435d"
    },
    {  
       "color":"#9498a2",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"Robert Half Technology",
       "slug":"robert-half-technology",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443cc",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f99ed678cc2d0001fde3a3_robert-half.png"
       },
       "updated-on":"2017-11-06T13:08:10.634Z",
       "updated-by":"Person_583abc2db333a5214d324efb",
       "created-on":"2017-11-01T10:15:58.100Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "link-to-site":"https://www.roberthalf.com/jobs/technology",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a0001744379"
    },
    {  
       "link-to-site":"https://www.progress.com/",
       "color":"#ffb720",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"1dd549a26129258fbd64081d8ecb347b",
       "name":"Progress",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443cb",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f99eb4ea359e00010789fd_progres.png"
       },
       "slug":"progress",
       "updated-on":"2017-11-06T13:07:19.535Z",
       "updated-by":"Person_583abc2db333a5214d324efb",
       "created-on":"2017-11-01T10:15:28.044Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a0001744367"
    },
    {  
       "link-to-site":"https://oasisdigital.com/",
       "color":"#9498a2",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"10c920273b213931e3d20127df10a610",
       "name":"Oasis Digital",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443ce",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f998cfc9a5280001e4db6f_oasis.png"
       },
       "slug":"oasis-digital",
       "updated-on":"2017-11-06T13:08:36.446Z",
       "updated-by":"Person_583abc2db333a5214d324efb",
       "created-on":"2017-11-01T09:50:29.161Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a000174435e"
    },
    {  
       "link-to-site":"https://github.com/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"33cd9f6aa3354bb41b219c23da5dfecc",
       "name":"GitHub",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443d9",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f9983378cc2d0001fde034_git.png"
       },
       "slug":"github",
       "updated-on":"2017-11-15T16:25:43.769Z",
       "updated-by":"Person_583abc2db333a5214d324efb",
       "created-on":"2017-11-01T09:47:50.375Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a0001744353"
    },
    {  
       "link-to-site":"https://www.adp.com/",
       "_archived":false,
       "_draft":false,
       "type-of-sponsor":"1dd549a26129258fbd64081d8ecb347b",
       "name":"ADP",
       "slug":"adp",
       "logo":{  
          "fileId":"5a2fc7cd99408a00017443cf",
          "url":"https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59f994e1269fd60001399472_adp.png"
       },
       "updated-on":"2017-11-01T09:35:50.445Z",
       "updated-by":"Person_583abc2db333a5214d324efb",
       "created-on":"2017-11-01T09:33:47.583Z",
       "created-by":"Person_583abc2db333a5214d324efb",
       "published-on":"2017-12-12T12:29:38.633Z",
       "published-by":"Person_583abc2db333a5214d324efb",
       "color":"#ffb720",
       "_cid":"5a2fc7cd99408a0001744305",
       "_id":"5a2fc7cd99408a0001744358"
    },
    {  
      "link-to-site":"http://nstudio.io",
      "_archived":false,
      "_draft":false,
      "type-of-sponsor":"1dd549a26129258fbd64081dasdfa",
      "name":"nStudio",
      "slug":"nstudio",
      "logo":{  
         "fileId":"5a2fc7cd99408a0001asdf",
         "url":"~/assets/images/nstudio-banner.png"
      },
      "updated-on":"2017-11-01T09:35:50.445Z",
      "updated-by":"Person_583abc2db333a5214asdf",
      "created-on":"2017-11-01T09:33:47.583Z",
      "created-by":"Person_583abc2db333a5214asdf",
      "published-on":"2017-12-12T12:29:38.633Z",
      "published-by":"Person_583abc2db333a5214dasdf",
      "color":"#ffb720",
      "_cid":"5a2fc7cd99408a0001744305",
      "_id":"5a2fc7cd99408a0001744358"
   }
  ];
  constructor(
    public storage: StorageService,
    private http: HttpClient,
    private sponsors: ConferenceSponsorApi
  ) {
    super(storage);
    this.key = StorageKeys.SPONSORS;
  }

  public get sponsorList() {
    return this._sponsorList;
  }

  public count() {
    // return this.sponsors.count().map(value => value.count);
    return Observable.of(this._sponsorList.length);
  }

  public fetch(forceRefresh?: boolean) {
    const list = this._adjustImage(this._sponsorList).sort( sortAlpha );
    return Observable.of(list);
    // const stored = this.cache;
    // if (!forceRefresh && stored) {
    //   console.log('using cached sponsors.');
    //   return Observable.of(stored.sort(sortAlpha));
    // } else {
    //   console.log('fetch sponsors fresh!');
    //   // return this.sponsors.find();
    //   const sortedList = this._sponsorList.sort(sortAlpha);
    //   for (const sponsor of sortedList) {
    //     for (const level of sponsor.level) {
    //         level.styleClass = `level-${level.name.toLowerCase().replace(/ /ig, '-')}`; 
    //         // console.log(level.styleClass);
    //     }
    //   }
    //   return this.http.get(`${NetworkCommonService.API_URL}ConferenceSponsors`)
    //     .map(sponsors => {
    //       // cache list
    //       this.cache = sponsors;
    //       return sponsors;
    //     });
    // }
  }
  
  private _adjustImage(list: Array<SponsorState.ISponsor>) {
    if (list) {
      list.forEach(i => {
        i.imageUrl$ = Observable.create(observer => {
          if (i.logo && i.logo.url) {
            if (i.logo.url.indexOf('~') > -1 ) {
              observer.next(i.logo.url);
              observer.complete();
              return;
            } else {
              observer.next('~/assets/images/loading.png');
            }
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

  public loadDetail(id) {
    // return this.sponsors.findById(id);
    return Observable.of(this._sponsorList.find(s => {
      return s.name === id;
    }));
  }
}
