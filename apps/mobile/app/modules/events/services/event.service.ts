// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// lib
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ConferenceEventApi } from '@ngatl/api';
import { Cache, StorageKeys, StorageService, NetworkCommonService, UserService, UserState } from '@ngatl/core';
import { IConferenceAppState } from '../../ngrx';
import { sortAlpha } from '../../../helpers';
import { EventActions } from '../actions';
import { ConferenceViewModel, Session } from '../models/conference.model';
import { EventState } from '../states';

@Injectable()
export class EventService extends Cache {

  private _conferenceModel: ConferenceViewModel;
  private _currentUser: UserState.IRegisteredUser;
  private _updatedFavs = false;

  constructor(
    public storage: StorageService,
    private store: Store<IConferenceAppState>,
    private http: HttpClient,
    private userService: UserService,
    private events: ConferenceEventApi
  ) {
    super(storage);
    this.key = StorageKeys.SCHEDULE;
    this._conferenceModel = new ConferenceViewModel();

    Observable.combineLatest(
      this.store.select( (s: IConferenceAppState) => s.conference.events ),
      this.store.select((s: IConferenceAppState) => s.user )
    )
      .subscribe(([eventState, userState]: [EventState.IState, UserState.IState]) => {
        this._conferenceModel.fullSchedule = [...eventState.list];
        if (this._currentUser && !userState.current) {
          // user had been logged in and is now logging out, reset fav update flag
          this._updatedFavs = false;
        }
        this._currentUser = userState.current;

        if (this._currentUser) {
          // update event listing state with what user had favorited (if any)
          this._updateFavs(this._currentUser);
        }
      });
  }

  private _updateFavs(currentUser: UserState.IRegisteredUser) {
    if (!this._updatedFavs && this._conferenceModel.fullSchedule.length) {
      this._updatedFavs = true;
      if (currentUser.favs) {
        for (let i = 0; i < this._conferenceModel.fullSchedule.length; i++) {
          if (currentUser.favs.includes(this._conferenceModel.fullSchedule[i].id)) {
            this._conferenceModel.fullSchedule[i].isFavorite = true;
          }
        }
        this.store.dispatch(new EventActions.ChangedAction({
          list: [...this._conferenceModel.fullSchedule]
        }));
      }
    }
  }

  public get conferenceModel() {
    return this._conferenceModel;
  }

  public count() {
    return this.events.count().map(value => value.count);
  }

  public fetch(forceRefresh?: boolean): Observable<Array<Session>> {
    const stored = this.cache;
    if (!forceRefresh && stored) {
      console.log('using cached events.');
      // this._parseDates(stored);
      this._fakeDates(stored);
      return Observable.of(this._createSessions(stored));
    } else {
      console.log('fetch events fresh!');
      return this.http.get(`${NetworkCommonService.API_URL}ConferenceEvents`)
        .map((events: Array<EventState.IEvent>) => {

          // cache list
          this.cache = events;
          const eventList = [...events];
          this._updatedFavs = false; // reset when getting fresh list
          this._fakeDates(eventList);
          return this._createSessions(eventList);
          // return this._parseDates(eventList);
        });
    }
  }

  private _createSessions(list: Array<EventState.IEvent>) {
    return list.map(i => new Session(i));
  }

  private _fakeDates(list: Array<EventState.IEvent>) {
    let dateCnt = 0;
    for (const ev of list) {
      let { hour, min, sec } = this._parseTime(ev.startTime);
      const month = dateCnt > 26 ? 1 : 0;
      let day = 30;
      if (dateCnt < 14) {
        day = 30;
      } else if (dateCnt < 27) {
        day = 31;
      } else if (dateCnt < 39) {
        day = 1;
      } else {
        day = 2;
      }
      ev.startDate = new Date(2018,month,day,hour,min,sec,0);
      const end = this._parseTime(ev.endTime);
      ev.endDate = new Date(2018,month,day,end.hour,end.min,end.sec,0);
      ev.cssClass = 'session-favorite';
      if (this._currentUser && this._currentUser.favs) {
        const isFav = this._currentUser.favs.find(id => id === ev.id);
        ev.isFavorite = !!isFav;
      }
      dateCnt++;
    }
  }

  private _parseTime(time: string) {
    const parts = time.split(':');
    let hour, min, sec;
    if (parts.length === 3) {
      hour = parseInt(parts[0]);
      min = parseInt(parts[1]);
      sec = parseInt(parts[2].split(' ')[0]);
      return { hour, min, sec };
    } else {
      return { hour: 0, min: 0, sec: 0};
    }
  }

  private _parseDates(list: Array<EventState.IEvent>) {
    for (const ev of list) {
      ev.startDate = new Date(ev.startTime);
      ev.endDate = new Date(ev.endTime);
      ev.cssClass = 'session-favorite';
    }
  }

  public loadDetail(id) {
    return this.events.findById(id);
  }
}
