// angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// lib
import { Observable } from 'rxjs/Observable';
import { ConferenceSponsorApi } from '@ngatl/api';
import { Cache, StorageKeys, StorageService } from '@ngatl/core';
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
      name: 'ADP',
      level: [{name:'Gold'}],
      image: '~/assets/images/sponsors/adp_logo.jpg',
      url: 'https://adp.com'
    },
    {
      name: 'The Weather Company',
      level: [{name:'Diversity Advocate'}],
      image: '~/assets/images/sponsors/weather.jpg',
      url: 'http://www.theweathercompany.com'
    },
    {
      name: 'WebJunto',
      level: [{name:'Gold'}, {name:'Diversity Supporter'}],
      image: '~/assets/images/sponsors/webjunto.jpg',
      url: 'http://webjunto.com'
    },
    {
      name: 'JetBrains',
      level: [{name:'Attendee Prizes'}],
      image: '~/assets/images/sponsors/jetbrains.jpg',
      url: 'https://www.jetbrains.com'
    },
    {
      name: 'GitHub',
      level: [{name:'Diversity Supporter'}],
      image: '~/assets/images/sponsors/GitHub_Logo.jpg',
      url: 'https://github.com'
    },
    {
      name: 'Robert Half Technology',
      level: [{name:'Silver'}],
      image: '~/assets/images/sponsors/robert-half.jpg',
      url: 'https://www.roberthalf.com/jobs/technology'
    },
    {
      name: 'TSYS',
      level: [{name:'Silver'}],
      image: '~/assets/images/sponsors/tsys.jpg',
      url: 'http://www.tsys.com'
    },
    {
      name: 'Progress',
      level: [{name:'Gold'}],
      image: '~/assets/images/sponsors/progress.jpg',
      url: 'https://www.progress.com'
    },
    {
      name: 'Valor Software',
      level: [{name:'Gold'}],
      image: '~/assets/images/sponsors/valor_software.jpg',
      url: 'https://valor-software.com'
    },
    {
      name: 'Oasis Digital',
      level: [{name:'Silver'}],
      image: '~/assets/images/sponsors/od_logo_print_hi.jpg',
      url: 'https://oasisdigital.com'
    }
  ];
  constructor(
    public storage: StorageService,
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
    const stored = this.cache;
    if (!forceRefresh && stored) {
      console.log('using cached sponsors.');
      return Observable.of(stored.sort(sortAlpha));
    } else {
      console.log('fetch sponsors fresh!');
      // return this.sponsors.find();
      const sortedList = this._sponsorList.sort(sortAlpha);
      for (const sponsor of sortedList) {
        for (const level of sponsor.level) {
            level.styleClass = `level-${level.name.toLowerCase().replace(/ /ig, '-')}`; 
            // console.log(level.styleClass);
        }
      }
      return Observable.of(sortedList)
        .map(sponsors => {
          // cache list
          this.cache = sponsors;
          return sponsors;
        });
    }
  }

  public loadDetail(id) {
    // return this.sponsors.findById(id);
    return Observable.of(this._sponsorList.find(s => {
      return s.name === id;
    }));
  }
}
