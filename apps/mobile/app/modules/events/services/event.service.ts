// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// lib
import { Observable } from 'rxjs/Observable';
import { ConferenceEventApi } from '@ngatl/api';
import { Cache, StorageKeys, StorageService, NetworkCommonService } from '@ngatl/core';
import { sortAlpha } from '../../../helpers';
import { EventState } from '../states';

@Injectable()
export class EventService extends Cache {
  constructor(
    public storage: StorageService,
    private http: HttpClient,
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
      return Observable.of(this._parseDates(stored));
    } else {
      console.log('fetch events fresh!');
      return this.http.get(`${NetworkCommonService.API_URL}ConferenceEvents`)
        .map((events: Array<EventState.IEvent>) => {

          // cache list
          this.cache = events;
          const eventList = [...events];
          return this._parseDates(eventList);
        });
    }
  }

  private _parseDates(list: Array<EventState.IEvent>) {
    for (const ev of list) {
      ev.startDate = new Date(ev.startTime);
      ev.endDate = new Date(ev.endTime);
    }
  }

  public loadDetail(id) {
    return this.events.findById(id);
  }
}
