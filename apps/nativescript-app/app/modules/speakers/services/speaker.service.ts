// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// lib
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as tnsHttp from 'tns-core-modules/http';
import { ConferenceSpeakerApi } from '@ngatl/api';
import { Cache, StorageKeys, StorageService, environment } from '@ngatl/core';
import { sortAlpha } from '@ngatl/utils';
import { SpeakerState } from '../states';

@Injectable()
export class SpeakerService extends Cache {

  private _speakerList: Array<SpeakerState.ISpeaker> = [
    {
      "_archived": false,
      "_draft": false,
      "position-company": "LinkedIn",
      "about": "Kamini is a Senior Director of Engineering at LinkedIn. She leads the Infrastructure and Productivity Engineering Team for the core flagship app for LinkedIn. Her team is responsible for developing tools and infrastructure to enable continuous development and deployment. She also leads the Women in Tech (WIT) Invest Program at LinkedIn which provides opportunities to accelerate women's careers. Prior to LinkedIn, Kamini spent 11 years at eBay, rising through the company from an engineer to leading and managing large engineering organizations. Throughout her career, Kamini has transformed Engineering, Tools, and Test organizations at several companies.",
      "name": "Kamini Dandapani",
      "slug": "kamini-dandapani",
      "photo": {
        "fileId": "5a5f699d7ec7470001130ab0",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a5f699d7ec7470001130ab0_Kamini%20Headshot.PNG"
      },
      "updated-on": "2018-01-17T15:20:05.137Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2018-01-17T15:20:05.137Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2018-01-17T15:20:42.978Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a5f69a55b4456000136c0a4"
    },
    {
      "twitter-link": "https://twitter.com/mgechev",
      "_archived": false,
      "_draft": false,
      "position-company": "Rhyme.com",
      "about": "Minko is co-founder of http://Rhyme.com and has a big passion for open source. He loves to experiment with theoretical computer science concepts and apply them in practice. Minko teaches, speaks and writes about JavaScript and Angular. Some of the projects he works on are his books “Switching to Angular”, codelyzer, the official Angular style guide, Angular Seed and many others.",
      "name": "Minko Gechev",
      "slug": "minko-gechev",
      "photo": {
        "fileId": "5a41d613a028fc00012ac9e1",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a41d613a028fc00012ac9e1_minko.jpg"
      },
      "updated-on": "2017-12-26T04:55:29.517Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-12-26T04:55:29.517Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-26T04:56:30.191Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a41d64181a52d00010fee56"
    },
    {
      "_archived": false,
      "_draft": false,
      "twitter-link": "https://twitter.com/trigger_hip_e",
      "only-workshop-speaker": true,
      "name": "Zach Gray",
      "about": "After earning my engineering degree, I’ve spent the past decade building teams, architectures and frameworks which enable the creation of state-of-the-art applications, products and services for startups and leading brands. Recently, I’ve been working closely with many neighboring bay-area companies on the next wave of products, technologies, frameworks and tools including Realtime web, IoT, Augmented Reality and Deep Learning.",
      "position-company": "Scal.io",
      "photo": {
        "fileId": "5a398afe8101fe00019f8b21",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a398afe8101fe00019f8b21_Zach.jpeg"
      },
      "slug": "zach-gray",
      "updated-on": "2017-12-19T22:02:41.589Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-12-19T21:59:52.056Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-19T22:02:44.563Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a398bd8bca9da000118e116"
    },
    {
      "_archived": false,
      "_draft": false,
      "twitter-link": "https://twitter.com/samdtho",
      "only-workshop-speaker": true,
      "name": "Sam Thompson",
      "about": "Sam is a Solutions Architect at NodeSource, jack-of-all-trades, and open source technologist. He has started working with Node late 2009 and has been using it to build web applications ever since. In his spare time, he currently serves as a director at a non-profit makerspace and maker education facility in Sacramento, CA.",
      "position-company": "NodeSource",
      "photo": {
        "fileId": "5a39358d0ec5490001233d8d",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a39358d0ec5490001233d8d_Artboard%201-100.jpg"
      },
      "slug": "sam-thompson",
      "updated-on": "2017-12-19T18:45:37.872Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-12-19T15:52:32.607Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-19T18:45:42.199Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a3935c08d5f3b00011b8366"
    },
    {
      "twitter-link": "https://twitter.com/danibsheehan",
      "_archived": false,
      "_draft": false,
      "position-company": "Forbes",
      "about": "Danielle is a Front-end Developer of the Forbes Article Page, graduate of the Grace Hopper Program at Fullstack Academy, and member of Tech Ladies. In her previous life, she attended both Trinity College Dublin and The University of North Carolina at Greensboro studying film theory and media. When not coding, she loves to travel (she just visited Iceland), visit museums, and read…as a true Ravenclaw does!",
      "name": "Danielle Sheehan",
      "photo": {
        "fileId": "5a36d41b2aad880001d29abc",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a36d41b2aad880001d29abc_danielle-sheehan.jpg"
      },
      "slug": "danielle-sheehan",
      "updated-on": "2017-12-17T20:31:37.433Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-12-17T20:31:37.433Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-17T20:32:29.855Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a36d429078182000190bdd3"
    },
    {
      "twitter-link": "https://twitter.com/FrozenPandaz",
      "_archived": false,
      "_draft": false,
      "position-company": "Forbes",
      "about": "Jason is the Lead Developer of the Forbes Article Page. He studied Mechanical Engineering at New Jersey Institute of Technology. He is also part of the Angular Universal Core Team, the author of @nguniversal/express-engine and helped design and implement building Universal apps with AngularCLI! He also enjoys watching a variety of TV shows and keeping up with the latest technology.",
      "name": "Jason Jean",
      "slug": "jason-jean",
      "photo": {
        "fileId": "5a36d3eef22ae30001caf5d6",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a36d3eef22ae30001caf5d6_jason-jean.jpg"
      },
      "updated-on": "2017-12-17T20:31:07.030Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-12-17T20:31:07.030Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-17T20:32:29.855Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a36d40b078182000190bdce"
    },
    {
      "twitter-link": "https://twitter.com/UriShaked",
      "_archived": false,
      "_draft": false,
      "about": "Uri Shaked is a Google Developer Expert for Web Technologies. He loves combining his passion for the web with his love for hardware electronics and robotics in challenging and amusing IoT projects, which he shares with the world in his blog, as well as travelling around the world and speaking in conferences and meetup. Among his interests are reverse engineering, hardware hacking, neuroscience, playing music and Salsa dancing.",
      "name": "Uri Shaked",
      "photo": {
        "fileId": "5a35ce8e3a08ae00019a6da0",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a35ce8e3a08ae00019a6da0_uri.jpg"
      },
      "slug": "uri-shaked",
      "updated-on": "2017-12-17T01:55:53.495Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-12-17T01:55:53.495Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-17T01:56:10.477Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a35cea9f22ae30001cae20e"
    },
    {
      "_archived": false,
      "_draft": false,
      "twitter-link": "https://twitter.com/thestefaniediaz",
      "only-workshop-speaker": false,
      "name": "Stefanie Diaz",
      "about": "Stefanie has spent the last two and a half years sharing her insights as well as compelling stories of Atlanta entrepreneurs as Host of the Mastermind Your Launch Podcast which generated over 130,000 unique listeners per episode and created more than 100 shows. In 2017, Stefanie founded WoE, Women Only Entrepreneurs; an event-based community for Atlanta lady bosses that can best be described as Ellen meets Oprah for women entrepreneurs. W.O.E. combines the lively spirit of a girls' night out with the soulful impact of inspiring interviews plus uplifting affirmations for an experience like no other. Recently named an Atlanta Startup Wonder Women by Hypepotamus, Stefanie’s impact on the Atlanta entrepreneurial community goes beyond WoE and the brand strategy work she does with her clients. She is a Community Organizer for 1 Million Cups Atlanta and a 2-time mentor at Techsquare Labs’ Atlanta Startup Battle.",
      "position-company": "Women Only Entrepreneurs",
      "photo": {
        "fileId": "5a32cdf19a5de90001dc71d0",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a32cdf19a5de90001dc71d0_Stefanie%20Diaz%20Headshot.jpg"
      },
      "slug": "stefanie-diaz",
      "updated-on": "2017-12-15T19:51:56.695Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-12-14T19:17:02.591Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-15T19:51:59.923Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a32ce2e36ab7a0001513ef6"
    },
    {
      "twitter-link": "https://twitter.com/paulpaultweets",
      "_archived": false,
      "_draft": false,
      "position-company": "WebJunto",
      "about": "Paulina is a kick ass software developer at Webjunto. She is an integral process for the day-to-day beyond building Webjunto’s hybrid mobile and web applications, providing insight to interns and teammates. She is always in the know and up to date on the latest updates in technology and how to apply them to Webjunto’s current projects. She enjoys the challenge of consistently opening her thought process to new avenues in order to productively search for solutions in a different way and implement those ideas. Due to her craving for creativity, hybrid technologies and Angular are not only her only technical obsession; her latest interests are native mobile development, game development, experimenting with a Raspberry Pi. You can catch her a giving talks about her love of technology, acting as an Assistant Organizer of the Ionic Philly Meetup, or working as a TA at Girl Develop It Philly and TechGirlz. When she isn’t coding, she can be found online playing games, playing with her cat Ozzy, or trying new and different types of food.\n",
      "name": "Paulina Gallo",
      "photo": {
        "fileId": "5a2fc7cd99408a000174442c",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a12ffc0306e7e0001fa6559_Paulina.jpg"
      },
      "slug": "paulina-gallo",
      "updated-on": "2017-11-20T19:18:50.877Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-20T16:16:04.220Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a00017443b7"
    },
    {
      "twitter-link": "https://twitter.com/jedihacks",
      "_archived": false,
      "_draft": false,
      "position-company": "WebJunto",
      "about": "Jedi (Jedidiah) Weller is CO-CEO & Head of Technology at Webjunto, a Design & Development agency providing customized services across the glboe. In addition, Jedi is an entrepreneur, landlord, dog lover, and organizer of the Philadelphia Junto, one of the fastest growing meetups in Philly. Previously, Jedi has worked as Director of Operations @ Geekli.st in Silicon Valley, Unisys Corporation, Analytical Graphics Inc., and the Technological Institute of Crete, Greece. He serves on the board of Kitchen Cred, a Philadelphia non-profit 501(3)(c) that fosters youth through culinary exercises. He has been a speaker and mentor at technology events across the world, such as SXSW (Slashathon), The Web Summit (#hack4good Dublin), Duke University (#hackduke), and University of Penn (Penn Apps). ",
      "name": "Jedi Weller",
      "slug": "jedi-weller",
      "photo": {
        "fileId": "5a2fc7cd99408a000174442d",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a12ff178a21290001d832ac_Jedi.JPG"
      },
      "updated-on": "2017-11-20T19:18:38.128Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-20T16:13:17.227Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174436e"
    },
    {
      "twitter-link": "https://twitter.com/saniyusuf",
      "_archived": false,
      "_draft": false,
      "position-company": "Haibrid",
      "about": "Sani is the founder of Haibrid, a London-based consultancy that offers Ionic training & consultancy. Sani is also the co-organiser of Ionic UK & has spoken about Ionic on 4 continents. A published book author, Sani also recently created the first Ionic 3.0 course online VIA Lynda.COM. One of the things he is currently working on is UI.SCHOOL, an online school for engineers to learn front-end development. When he is not doing geeky stuff, he enjoys food tourism & paddle boarding on the ocean. ",
      "name": "Sani Yusuf",
      "photo": {
        "fileId": "5a2fc7cd99408a000174441c",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a12eea7864de000010d4a72_sani.jpg"
      },
      "slug": "sani-yusuf",
      "updated-on": "2017-11-20T19:19:14.263Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-20T15:03:07.103Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a00017443a4"
    },
    {
      "_archived": false,
      "_draft": false,
      "twitter-link": "https://twitter.com/kammysliwiec",
      "only-workshop-speaker": true,
      "name": "Kamil Myśliwiec ",
      "about": "Kamil (@kamilmmys) is the creator of the NestJS framework, Software Engineer at Scal.io, Angular enthusiast, and the clean code advocate. Beyond code, he loves cats (especially his own one).",
      "position-company": "Software Engineer",
      "photo": {
        "fileId": "5a2fc7cd99408a000174442e",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a12ddfaf5b6b60001010c18_Kamil.jpg"
      },
      "slug": "kamil-mysliwiec",
      "updated-on": "2017-11-20T13:52:51.485Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-20T13:52:51.485Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a00017443a3"
    },
    {
      "twitter-link": "https://twitter.com/ChloeCondon",
      "_archived": false,
      "_draft": false,
      "position-company": "Sentry",
      "about": "Former musical theatre actress and Hackbright Academy graduate, Chloe is now a Developer Evangelist at Sentry. Perhaps the only engineer you'll meet who has been in \"Hairspray\", \"Xanadu\", and \"Jerry Springer: the Opera\"- she is passionate about bringing people with non-traditional backgrounds into the world of tech. If you're trying to place her face, yes- she's the young woman giving the awkward thumbs up in the \"What It's Like to be a Woman at a Tech Conference\" article (which she also wrote). A quick Google search of her will provide you with getting started with Docker videos, theatre reviews, tech blogs, and videos of her singing- enjoy!",
      "name": "Chloe Condon",
      "slug": "chloe-condon",
      "photo": {
        "fileId": "5a31c5db678f4d00013154ab",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a31c5db678f4d00013154ab_Headshot.jpeg"
      },
      "updated-on": "2017-12-14T14:14:20.731Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-18T19:22:24.021Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-14T14:15:22.134Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744332"
    },
    {
      "_archived": false,
      "_draft": false,
      "position-company": "Theoretical Physicist",
      "about": "Dr. Michio Kaku is one of the most widely recognized figures in science in the world today. He is an internationally recognized authority in two areas. The first is Einstein’s unified field theory, which Kaku is attempting to complete. The other is to predict trends affecting business, commerce and finance based on the latest research in science.",
      "name": "Dr. Michio Kaku",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443b8",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c5c0f1a930500014f55f4_Dr.%20Michio%20Kaku.jpg"
      },
      "slug": "dr-michio-kaku",
      "updated-on": "2017-11-18T19:17:43.253Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-15T15:24:17.088Z",
      "created-by": "Person_583abc2db333a5214d324efb",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "twitter-link": "https://twitter.com/michiokaku",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a00017443ab"
    },
    {
      "_archived": false,
      "_draft": false,
      "twitter-link": "https://twitter.com/MarkPieszak",
      "only-workshop-speaker": true,
      "name": "Mark Pieszak",
      "about": "Mark Pieszak is the Founder & CTO of http://DevHelp.Online , and a member of the Angular Universal core team. He has a passion for all things front-end and open source. He's been working with and contributing to both Angular and AngularJS since their earliest releases.",
      "position-company": "Founder / DevHelp.Online ",
      "slug": "mark-pieszak",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443c6",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c57411d5f720001f4c939_Mark.jpg"
      },
      "updated-on": "2017-11-15T15:05:34.302Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-15T15:05:34.302Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a00017443ad"
    },
    {
      "_archived": false,
      "_draft": false,
      "name": "Dan Arias",
      "slug": "dan",
      "updated-on": "2017-11-15T16:46:57.146Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-15T13:52:19.578Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "about": "Dan is the latest and greatest addition to the Ultimate Angular team lead by Todd Motto, a Google Developer Expert (GDE) for both Angular and Web Technologies. Dan has been working in Front End Development for over 3 years and regularly participates in meetups as a technical speaker. He is highly passionate about teaching and advocating outstanding developer experiences. Testing and migrations are his top favorite topics. In the words of Todd: “Dan is the e2e/unit test advocate in the Ultimate Angular Slack channels. I’ve never known anyone to love testing more”. If you’re ready to learn how to fully master Angular testing, jump right in with us!",
      "twitter-link": "https://twitter.com/getDanArias",
      "position-company": "Platform Engineer / Ultimate Angular",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443c5",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c55ea60a8300001d2ee39_wMFapJ1C_400x400.jpg"
      },
      "only-workshop-speaker": true,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a00017443ae"
    },
    {
      "twitter-link": "https://twitter.com/KimMaida",
      "only-workshop-speaker": false,
      "_archived": false,
      "_draft": false,
      "position-company": "Auth0",
      "name": "Kim Maida",
      "slug": "kim-maida",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744421",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0c44ff5b03090001a4edb2_kim.jpg"
      },
      "updated-on": "2018-01-15T14:21:08.738Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-15T13:45:39.428Z",
      "created-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "published-on": "2018-01-15T14:21:14.130Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174436a"
    },
    {
      "twitter-link": "https://twitter.com/_clarkio",
      "_archived": false,
      "_draft": false,
      "name": "Brian Clark",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744352",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0587d4e9caed0001ee19c9_brian.jpg"
      },
      "slug": "brian-clark",
      "updated-on": "2017-11-10T11:05:04.546Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-08T15:18:26.916Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "only-workshop-speaker": true,
      "position-company": "Microsoft",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744346"
    },
    {
      "twitter-link": "https://twitter.com/beeman_nl",
      "_archived": false,
      "_draft": false,
      "about": "Hedonist, traveler, software developer. I have a great passion for JavaScript and work every day with LoopBack and Angular. Other passions are music, beer and traveling.",
      "name": "Bram Borggreve",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744415",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a031b64f12e1c00017aa509_J6ZDJlKi_400x400.jpg"
      },
      "slug": "bram-borggreve",
      "updated-on": "2017-11-10T11:03:27.357Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-08T14:59:15.442Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "only-workshop-speaker": true,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174437c"
    },
    {
      "twitter-link": "https://twitter.com/BenLesh",
      "_archived": false,
      "_draft": false,
      "position-company": "Google",
      "about": "Software engineer at Google, RxJS core team member.",
      "name": "Ben Lesh",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744306",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0316622b2af6000127e7d8_PgONBPpm_400x400%20(1).jpg"
      },
      "slug": "ben-lesh",
      "updated-on": "2017-11-10T11:02:44.159Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-08T14:37:09.229Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "only-workshop-speaker": true,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174432f"
    },
    {
      "_archived": false,
      "_draft": false,
      "twitter-link": "https://twitter.com/PascalPrecht",
      "only-workshop-speaker": true,
      "name": "Pascal Precht",
      "about": "I like coding, skateboarding and art. ",
      "position-company": "Co-Founder of thoughtram",
      "slug": "pascal-precht",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744419",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a0311eda67d850001f3bb32_cV0xqXzz_400x400.jpg"
      },
      "updated-on": "2017-11-15T13:38:40.677Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-08T14:19:09.832Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744350"
    },
    {
      "twitter-link": "https://twitter.com/elmd_",
      "_archived": false,
      "_draft": false,
      "position-company": "Trainer Thoughtram and Co-founder of MachineLabs",
      "about": "Entrepreneur. I love all things Angular, Firebase and ReactiveX. Sportsman and also into Design. Trainer @thoughtram and Co-founder of @machinelabs_ai",
      "name": "Dominic Elm",
      "slug": "dominic-elm",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744330",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a030beba67d850001f3ba2b_Io6PNlP5_400x400.jpg"
      },
      "updated-on": "2017-11-10T11:08:09.019Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-08T13:52:17.424Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "only-workshop-speaker": true,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a00017443a1"
    },
    {
      "only-workshop-speaker": true,
      "_archived": false,
      "_draft": false,
      "about": "Chris Griffith is the User Experience Lead at a home automation and security company. Recently he finished his first book, Mobile App Development with Ionic 2, published by O’Reilly Press. He is also an instructor at the University of California, San Diego Extension, teaching mobile application development, and an Adobe Community Professional. He has developed several mobile applications, a variety of code-hinters and ConfiGAP for PhoneGap Build. In addition, he has served as a technical reviewer for several publications and written for uxmag.com.",
      "name": "Chris Griffith",
      "slug": "chris-griffith",
      "photo": {
        "fileId": "5a2fc7cd99408a000174441b",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/5a02fecdf12e1c00017aa047_527875.jpeg"
      },
      "updated-on": "2017-12-19T18:47:36.018Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-08T12:55:56.071Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-19T18:47:41.348Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "twitter-link": "https://twitter.com/chrisgriffith",
      "position-company": "Staff Software Enginer @ Nortek Security and Control",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744340"
    },
    {
      "twitter-link": "https://twitter.com/sebawita",
      "_archived": false,
      "_draft": false,
      "position-company": "NativeScript nomad",
      "about": "NativeScript nomad, master of robots, Angular enthusiast. Speaker for exciting technology and humour. Views are my own.",
      "name": "Sebastian Witalec",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443ea",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fdd54dd4ae9c0001bec7ab_sebastian.jpg"
      },
      "slug": "sebastian-witalec",
      "updated-on": "2017-11-15T16:46:37.655Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-04T14:57:48.636Z",
      "created-by": "Person_583abc2db333a5214d324efb",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "special-speaker": false,
      "only-workshop-speaker": true,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744388"
    },
    {
      "twitter-link": "https://twitter.com/nitish_dayal",
      "_archived": false,
      "_draft": false,
      "position-company": "Web Dev @ Amazon",
      "about": "Full-stack Javascript developer with an interest in modern/trending technology and their real-world applications. I have created full-stack (MEAN, React/Angular + Firebase, React/Angular + Express) and client-side applications (React, Angular), as well as consumable APIs for mobile applications. I have a strong grasp of object-oriented programming principles and design patterns, and am currently studying functional and functional-reactive programming and their applications in single-page application development.",
      "name": "Nitish Dayal",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744412",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fda56acd54e70001a35bb6_nitish-dayal.jpg"
      },
      "slug": "nitish-dayal",
      "updated-on": "2017-11-15T16:22:30.586Z",
      "updated-by": "Person_583abc2db333a5214d324efb",
      "created-on": "2017-11-04T11:35:18.703Z",
      "created-by": "Person_583abc2db333a5214d324efb",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "only-workshop-speaker": true,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174437d"
    },
    {
      "twitter-link": "https://twitter.com/WyleshaRachell",
      "_archived": false,
      "_draft": false,
      "position-company": "Turner Broadcasting | NBA.com",
      "about": "Wylesha wrote her first line of code with custom Myspace pages for music artists while in college at LSU. Through ingenuity and a little reverse engineering, Wylesha taught herself the basic concepts of front-end development, and turned a profit in the process. It wasn’t until after she took her first Computer Science course her senior year, that she realized programming is what she wanted to do the rest of her life. After graduating with a Bachelors in Business Management, Wylesha moved to Atlanta and immersed herself in Software Engineering. She is currently on the tech team as a Sr. Engineer for NBA.com at Turner Broadcasting.",
      "name": "Wylesha Rachell",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f1",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc7a8b22019c0001c19943_Wylesha.jpg"
      },
      "slug": "wylesha-rachell",
      "updated-on": "2017-11-03T14:17:54.287Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T14:17:54.287Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744387"
    },
    {
      "twitter-link": "https://twitter.com/ladyleet",
      "_archived": false,
      "_draft": false,
      "position-company": "This Dot Labs",
      "about": "Tracy is a Google Developer Expert, a Women Techmakers Lead, and on the RxJS Learning Team. She is the organizer of This.JavaScript, Modern Web, Contributor Days, Google Developer Group, and RxWorkshop. She is also Co-Founder of This Dot Labs, an elite consultancy helping teams build front end applications. You can find her on Twitter @ladyleet or at http://thisdot.co/labs.",
      "name": "Tracy Lee",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443ed",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc7a59605d4b0001f00373_Tracy.jpg"
      },
      "slug": "tracy-lee",
      "updated-on": "2017-12-08T21:02:35.138Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-03T14:17:16.618Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744392"
    },
    {
      "twitter-link": "https://twitter.com/Tzmanics",
      "_archived": false,
      "_draft": false,
      "position-company": "Progress",
      "about": "Tara (@tzmanics) is a life-long student, teacher and maker. She has spent her career using Javascript on both back-end and front-end to create applications. In her free time she works in her community to educate and learn from other developers. Tara launched the Cincinnati Chapter of Women Who Code and Co-Chairs the Cincinnati branch of NodeSchool. Beyond code, she likes to make things with other materials (wool, solder, clay, etc.) and hike any mountain she can get to with her trusty sidekick, #toshmagosh.",
      "name": "Tara Manicsic",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443fd",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc7a3eb6086d0001493607_Tara.jpg"
      },
      "slug": "tara-manicsic",
      "updated-on": "2017-11-15T13:23:31.038Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T14:16:48.829Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "special-speaker": false,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744395"
    },
    {
      "twitter-link": "https://twitter.com/thatgoldblatt",
      "_archived": false,
      "_draft": false,
      "position-company": "Google",
      "about": "Bio Coming Soon",
      "name": "Susan Goldblatt",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443ef",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc7a2e3eed770001eff6b8_Susan.jpg"
      },
      "slug": "susan-goldblatt",
      "updated-on": "2017-11-15T13:23:26.714Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T14:16:19.790Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "special-speaker": false,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174439a"
    },
    {
      "twitter-link": "https://twitter.com/simona_cotin",
      "_archived": false,
      "_draft": false,
      "position-company": "Microsoft",
      "about": "Bio Coming Soon",
      "name": "Simona Cotin",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443fe",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc79e722019c0001c19925_Simona.jpg"
      },
      "slug": "simona-cotin",
      "updated-on": "2017-11-03T14:15:15.862Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T14:15:15.862Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744397"
    },
    {
      "twitter-link": "https://twitter.com/sherrylist",
      "_archived": false,
      "_draft": true,
      "position-company": "Nordea",
      "about": "Sherry is a front-end developer based in beautiful Copenhagen with over 10 years of experience in software engineering. She is also co-organizer of ngCopenhagen, GDG Copenhagen and ngVikings. She loves animals and supports many animal protection organisations.",
      "name": "Sherry List",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443fa",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc798f3eed770001eff677_Sherry.jpg"
      },
      "slug": "sherry-list",
      "updated-on": "2018-01-17T15:21:06.747Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-03T14:13:48.496Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174432e"
    },
    {
      "twitter-link": "https://twitter.com/shanselman",
      "_archived": false,
      "_draft": false,
      "position-company": "Microsoft",
      "about": "Scott is a web developer who has been blogging at https://hanselman.com for over a decade. He works in Open Source on ASP.NET and the Azure Cloud for Microsoft out of his home office in Portland, Oregon. Scott has three podcasts, http://hanselminutes.com for tech talk, http://thisdeveloperslife.com on developers' lives and loves, and http://ratchetandthegeek.com for pop culture and tech media. He's written a number of books and spoken in person to almost a half million developers worldwide.",
      "name": "Scott Hanselman",
      "slug": "scott-hanselman",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f4",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc7949b6086d00014935d6_Scott.jpg"
      },
      "updated-on": "2017-11-03T14:12:27.236Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T14:12:27.236Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174438b"
    },
    {
      "twitter-link": "https://twitter.com/SamLee_509",
      "_archived": false,
      "_draft": false,
      "about": "Samantha Rhodes is the co-founder of Code Bridge Texas and a high school student in Houston, Texas. Along with her mom, Sam enjoys learning Angular and teaching it to others. In her free time, she enjoys running, teaching, volunteering, and learning new things.",
      "name": "Samantha Rhodes",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f5",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc79203eed770001eff659_Samantha%20(1).jpg"
      },
      "slug": "samantha-rhodes",
      "updated-on": "2017-11-03T14:12:02.350Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T14:12:02.350Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174438c"
    },
    {
      "twitter-link": "https://twitter.com/ryanchenkie",
      "_archived": false,
      "_draft": false,
      "position-company": "Auth0",
      "about": "Ryan is a full-stack JavaScript developer and works mostly with Angular and Node. He's a Google Developer Expert, Developer Advocate at Auth0, and also runs Angularcasts.io, a screencast site offering end-to-end Angular and JavaScript training. Ryan is the author of Securing Angular Applications, a complete guide on how to lock down Angular apps.",
      "name": "Ryan Chenkie",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f0",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc74b6605d4b0001f0023d_Ryan.jpeg"
      },
      "slug": "ryan-chenkie",
      "updated-on": "2017-11-03T14:11:22.800Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T14:11:22.800Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744364"
    },
    {
      "twitter-link": "https://twitter.com/rkoutnik",
      "_archived": false,
      "_draft": false,
      "position-company": "Netflix",
      "about": "Randall is a senior software engineer at Netflix, building tools that wake up other Netflixers when things break. To offset that karma, he’s adopted a cat that wakes him up whenever a new JavaScript framework is released. He doesn’t get much sleep.",
      "name": "Randall Koutnik",
      "slug": "randall-koutnik",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443ee",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc7493605d4b0001f00233_Randall.jpg"
      },
      "updated-on": "2017-11-03T13:52:39.500Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:52:39.500Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744398"
    },
    {
      "twitter-link": "https://twitter.com/way2rach",
      "_archived": false,
      "_draft": false,
      "about": "Rachita is a front-end developer with a deep interest in the front end architecture. With each talk, she wants to spread the message of doing it right the first time. She is a firm believer that time put into thinking about the architecture before writing code results in faster and more reliable code over time. From experience, she knows code written fast, but with no consideration for architecture is also buggy. :)",
      "name": "Rachita Joshi",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f6",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc7445605d4b0001f00231_Rachita.jpg"
      },
      "slug": "rachita-joshi",
      "updated-on": "2017-12-11T18:11:37.349Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-03T13:51:18.285Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a00017443c1"
    },
    {
      "twitter-link": "https://twitter.com/wwwalkerrun",
      "_archived": false,
      "_draft": false,
      "position-company": "nStudio LLC",
      "about": "Nathan Ross Walker has enjoyed the opportunity to work in the web/mobile app development arena for over 15 years. His varied background rooted in the world of design and the arts provides him a unique approach to problem solving. Spending several years working across multiple industries including entertainment, audio/video production, manufacturing, b2b marketing, communications, and technology helped establish a focused sensibility with client needs.",
      "name": "Nathan Walker",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443ff",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc73c43eed770001eff574_Nathan.jpg"
      },
      "slug": "nathan-walker",
      "updated-on": "2017-11-07T09:22:56.152Z",
      "updated-by": "Person_583abc2db333a5214d324efb",
      "created-on": "2017-11-03T13:48:55.340Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "special-speaker": false,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174439b"
    },
    {
      "twitter-link": "https://twitter.com/Brocco",
      "_archived": false,
      "_draft": false,
      "position-company": "Rangle.io",
      "about": "Mike has worked on Angular tooling before the Angular CLI was even an alpha release. He continued his work beyond the CLI into the next iteration of Angular tooling: Angular DevKit. Mike is a GDE who contributes to the Angular CLI and is also an instructor at egghead. Mike is passionate about writing quality code as well as teaching. Outside of development, Mike loves to spend time with his wife and two daughters.",
      "name": "Mike Brocchi",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443eb",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc73a9605d4b0001f0020c_Mike.jpg"
      },
      "slug": "mike-brocchi",
      "updated-on": "2017-11-03T13:48:30.282Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:48:30.282Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174439c"
    },
    {
      "twitter-link": "https://twitter.com/meredithjordyn",
      "_archived": false,
      "_draft": false,
      "about": "Bio Coming Soon",
      "name": "Meredith Bayne",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744363",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc72b8605d4b0001f001e4_Meredith.jpg"
      },
      "slug": "meredith-bayne",
      "updated-on": "2017-11-03T13:44:40.688Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:44:40.688Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174432b"
    },
    {
      "twitter-link": "https://twitter.com/KimCrayton1",
      "_archived": false,
      "_draft": false,
      "position-company": "Kim Crayton LLC",
      "about": "Bio Coming Soon",
      "name": "Kim Crayton",
      "slug": "kim-crayton",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744407",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc72a5605d4b0001f001dd_KimCrayton.jpg"
      },
      "updated-on": "2017-11-03T13:44:13.431Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:44:13.431Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174435a"
    },
    {
      "twitter-link": "https://twitter.com/kapunahele",
      "_archived": false,
      "_draft": false,
      "about": "Kapunahele likes explaining things and playing with electronics, especially broken ones. She also likes cooking, eating, and dancing the Native Hawaiian hula. She is a developer based in Richmond, Virginia and can usually be spotted gazing at the Angular docs.",
      "name": "Kapunahele Wong",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744408",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc720a22019c0001c197a9_Kapunahele.jpg"
      },
      "slug": "kapunahele-wong",
      "updated-on": "2017-11-03T13:43:44.852Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:43:44.852Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174438f"
    },
    {
      "twitter-link": "https://twitter.com/John_Papa",
      "_archived": false,
      "_draft": false,
      "position-company": "Microsoft",
      "about": "John Papa is dedicated a father and husband, a Principal Developer Advocate with Microsoft, and an alumni of the Google Developer Expert, Microsoft RD and MVP programs. His passions are deploying and teaching modern web technologies, and enjoying everything Disney with his family. John is a co-host of the popular Adventures in Angular podcast, author of the Angular Style Guide, and many popular Pluralsight courses.",
      "name": "John Papa",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443e9",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc71c522019c0001c1978c_John.jpg"
      },
      "slug": "john-papa",
      "updated-on": "2017-11-15T13:23:17.786Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:40:42.421Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "special-speaker": false,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744342"
    },
    {
      "twitter-link": "https://twitter.com/ratracegrad",
      "_archived": false,
      "_draft": false,
      "position-company": "Stanley Black & Decker",
      "about": "Jennifer Bland is a Senior Software Developer specializing in MEAN stack development. She has more than ten years of development experience working for companies like CNN, Coca-Cola and Apple Computer. Jennifer is the author of the book “Developing e-Business Applications Using Lotus Domino on the AS/400″, published by IBM. She runs the website codeprep.io which provides interview questions to assist programmers in preparation for job interviews. Her personal website is jenniferbland.com.",
      "name": "Jennifer Bland",
      "slug": "jennifer-bland",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744406",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc7165605d4b0001f00199_JenniferBland.jpg"
      },
      "updated-on": "2017-11-03T13:39:18.571Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:39:18.571Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744391"
    },
    {
      "twitter-link": "https://twitter.com/ericastanley",
      "_archived": false,
      "_draft": false,
      "position-company": "SalesLoft",
      "name": "Erica Stanley",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744400",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc711022019c0001c19768_erica_stanley.jpg"
      },
      "slug": "erica-stanley",
      "updated-on": "2017-12-19T22:02:22.354Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-03T13:37:22.744Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-19T22:02:44.563Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "about": "Erica Stanley is an engineering manager at SalesLoft – where she’s helping grow the product engineering team for one the Southeast’s fastest growing SaaS companies. She holds a B.S and M.S in Computer Science from Clark Atlanta University and conducted post-graduate research at the University of North Carolina at Chapel Hill. Always eager to explore and push boundaries in tech, Erica has worked in various areas of technology, including web, mobile, augmented and virtual reality, artificial intelligence and human-centered computing. Erica is active in the Atlanta technology community. She helps develop and teach youth coding programs, speaks at local hackathons, conferences, and user groups. She also founded the Atlanta network of Women Who Code, where she leads new developer workshops and organizes monthly tech talks, hack nights, and networking events for women technologists.",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744356"
    },
    {
      "twitter-link": "https://twitter.com/valorkin",
      "_archived": false,
      "_draft": false,
      "position-company": "Valor Software",
      "name": "Dmitriy Shekhovtsov",
      "slug": "dmitriy-shekhovtsov",
      "updated-on": "2017-11-08T10:49:56.162Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:37:03.499Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744402",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc711ab8ca44000134c6fd_Dmitri.jpg"
      },
      "about": "Bio Coming Soon",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744376"
    },
    {
      "twitter-link": "https://twitter.com/chawomack",
      "_archived": false,
      "_draft": false,
      "position-company": "CareerBuilder",
      "about": "Chaela is a native to Georgia. She attended Kennesaw State University and earned a bachelor's in computer science. Chaela has a love for JavaScript and currently works as a software engineer for Careerbuilder.",
      "name": "Chaela Womack",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744414",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc6b47b6086d000149332e_Chaela.jpg"
      },
      "slug": "chaela-womack",
      "updated-on": "2017-11-03T13:13:14.561Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:13:14.561Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744399"
    },
    {
      "twitter-link": "https://twitter.com/CarmenPopoviciu",
      "_archived": false,
      "_draft": false,
      "about": "Carmen is a front-end engineer who likes writing code and solving challenging puzzles. She's currently working towards undertaking the path of Artificial Neural Networks and Machine Learning ... all one step at a time. If she had superpowers, she would smiley all the things.",
      "name": "Carmen Popoviciu",
      "slug": "carmen-popoviciu",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744341",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc6b22cba6e2000196761e_Carmen.jpg"
      },
      "updated-on": "2017-11-03T13:12:11.140Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T13:12:11.140Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174438e"
    },
    {
      "twitter-link": "https://twitter.com/brandontroberts",
      "_archived": false,
      "_draft": false,
      "position-company": "Synapse Wireless",
      "about": "Brandon is a Senior Software Engineer for Synapse Wireless building web applications for Industrial IoT. He is a natural born troubleshooter and is passionate about writing good documentation to help developers. He is a core contributor to the NgRx project.",
      "name": "Brandon Roberts",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744413",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc6a2b605d4b0001f00041_Brandon.jpg"
      },
      "slug": "brandon-roberts",
      "updated-on": "2017-11-10T11:03:57.527Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-03T13:11:29.725Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174434b"
    },
    {
      "twitter-link": "https://twitter.com/bradlygreen",
      "_archived": false,
      "_draft": false,
      "position-company": "Google",
      "about": "Brad Green is an Engineering Director at Google where he manages that Angular Framework, Google's internal CRM suite, and other internal development productivity tools. He lives in Mountain View, CA with two kids and four chickens",
      "name": "Brad Green",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f9",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc6758b6086d00014932ca_Brad.jpg"
      },
      "slug": "brad-green",
      "updated-on": "2017-11-03T12:56:08.586Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T12:56:08.586Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744389"
    },
    {
      "twitter-link": "https://twitter.com/bonnster75",
      "_archived": false,
      "_draft": false,
      "about": "Bonnie Brennan is the founder of the ngHouston Angular Meetup. Along with her teenage daughter, she also co-founded Code Bridge Texas, where together they plan and teach free programming workshops for girls and women. Bonnie has been writing and teaching Angular since 2013 and is passionate about code quality, continuing education, and empowering others who want to learn.",
      "name": "Bonnie Brennan",
      "photo": {
        "fileId": "5a2fc7cd99408a0001744374",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc6747b6086d00014932c3_Bonnie.jpg"
      },
      "slug": "bonnie-brennan",
      "updated-on": "2017-11-03T12:55:37.424Z",
      "updated-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "created-on": "2017-11-03T12:55:37.424Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744378"
    },
    {
      "twitter-link": "https://twitter.com/aprilwensel",
      "_archived": false,
      "_draft": false,
      "position-company": "Compassionate Coding",
      "about": "April Wensel is the founder of Compassionate Coding, a social enterprise that offers coaching and training to empower individuals and teams to cultivate sustainable and human-­centered agile software development practices. She has spent the past decade in software engineering and technical leadership roles at various Silicon Valley startups. She also mentors widely and volunteers with organizations like Black Girls Code and Hackbright Academy to advance diversity in the software industry. When not coding, she enjoys writing, running marathons, and cooking vegan food.",
      "name": "April Wensel",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f3",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc6707605d4b0001efffe0_April.jpg"
      },
      "slug": "april-wensel",
      "updated-on": "2017-11-10T11:02:07.490Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-03T12:54:40.615Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-12T12:29:38.633Z",
      "published-by": "Person_583abc2db333a5214d324efb",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744338"
    },
    {
      "twitter-link": "https://twitter.com/AlyssaNicoll",
      "_archived": false,
      "_draft": false,
      "about": "I'm an Angular Developer Advocate for Kendo UI & GDE. I’ve spoken at over 20 conferences Internationally, specializing in motivational soft talks. I'm a weekly panelist on Adventures in Angular and Angular Air, which have a combined following of over 16,000 listeners. I enjoy gaming, scuba diving, and have a toothless dog named Gummy. My DM is always open, come talk sometime.",
      "name": "Alyssa Nicoll",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f7",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc66d822019c0001c195cd_Alyssa.jpg"
      },
      "slug": "alyssa-nicoll",
      "updated-on": "2017-12-21T01:09:54.963Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-03T12:54:17.600Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2017-12-21T01:09:58.070Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a000174438a"
    },
    {
      "twitter-link": "https://twitter.com/Aimee_Knight",
      "_archived": false,
      "_draft": false,
      "position-company": "Built Technologies",
      "about": "Aimee Knight is a former figure skater, graduate of the Nashville Software School, software engineer for Built Technologies. Outside of work, she’s a weekly panelist on the JavaScript Jabber podcast, and she regularly participates in a variety of others. In her spare time, she enjoys speaking at conferences, playing with new technology, running, working out, or trying the latest flavor of Kombucha.",
      "name": "Aimee Knight",
      "slug": "aimee-knight",
      "photo": {
        "fileId": "5a2fc7cd99408a00017443f8",
        "url": "https://daks2k3a4ib2z.cloudfront.net/59f85d8ca38c420001ebea6f/59fc66b6b6086d00014932a2_Aimee.jpg"
      },
      "updated-on": "2018-01-10T01:58:38.288Z",
      "updated-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "created-on": "2017-11-03T12:53:25.402Z",
      "created-by": "Collaborator_59fb40d65a1f1a00019b0b02",
      "published-on": "2018-01-10T01:58:40.938Z",
      "published-by": "Collaborator_5a009ab5cd54e70001a53c9b",
      "special-speaker": false,
      "_cid": "5a2fc7cd99408a00017442f4",
      "_id": "5a2fc7cd99408a0001744377"
    }
  ];

  constructor(
    public storageService: StorageService,
    private http: HttpClient,
    private speakers: ConferenceSpeakerApi
  ) {
    super( storageService );
    this.key = StorageKeys.SPEAKERS;
  }

  public count() {
    // return this.speakers.count().map(value => value.count);
    return of( this._speakerList.length );
  }

  public get speakerList() {
    return this._speakerList;
  }

  public fetch( forceRefresh?: boolean ) {
    // const list = this._adjustImage(this._speakerList).filter(s => !s["only-workshop-speaker"]).sort( sortAlpha );
    // return of(list);
    const stored = this.cache;
    if (!forceRefresh && stored) {
      console.log('using cached speakers.');
      return of(this._adjustImage(stored).sort(sortAlpha));
    } else {
      console.log('fetch speakers fresh!');
      // return this.speakers.find();
      return this.http.get(`${environment.API_URL}ConferenceSpeakers`)
      .pipe(
        map((speakers: Array<any>) => {
          // cache list
          this.cache = speakers;
          return this._adjustImage(speakers).sort(sortAlpha);
        }));
    }
  }

  private _adjustImage(list: Array<SpeakerState.ISpeaker>) {
    if (list) {
      list.forEach(i => {
        i.imageUrl$ = Observable.create(observer => {
          observer.next('~/assets/images/loading.png');
          if (i.imageUrl) {
            tnsHttp.getImage(i.imageUrl).then(img => {
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

  public loadDetail( id ) {
    // return this.speakers.findById(id);
    return of( this._speakerList.find( s => {
      return s['twitter-link'] === id;
    } ) );
  }
}
