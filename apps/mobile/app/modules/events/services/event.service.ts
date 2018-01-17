// angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// lib
import { Observable } from 'rxjs/Observable';
import { ConferenceEventApi } from '@ngatl/api';
import { Cache, StorageKeys, StorageService } from '@ngatl/core';
import { sortAlpha } from '../../../helpers';

@Injectable()
export class EventService extends Cache {
  constructor(
    public storage: StorageService,
    private events: ConferenceEventApi
  ) {
    super(storage);
    this.key = StorageKeys.SCHEDULE;
  }

  public count() {
    return this.events.count().map(value => value.count);
  }

  public fetch(forceRefresh?: boolean) {
    const stored = this.cache;
    if (!forceRefresh && stored) {
      console.log('using cached events.');
      return Observable.of(stored.sort(sortAlpha));
    } else {
      console.log('fetch events fresh!');
      return this.events.find()
        .map(events => {
          // cache list
          this.cache = events;
          return events;
        });
    }
  }

  public loadDetail(id) {
    return this.events.findById(id);
  }
}
