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
      this._fixDates(stored);
      return Observable.of(this._createSessions(stored));
    } else {
      console.log('fetch events fresh!');
      return this.http.get(`${NetworkCommonService.API_URL}ConferenceEvents`) //?filter%5Bwhere%5D%5Btype%5D=Workshop
        .map((events: Array<EventState.IEvent>) => {

          // cache list
          this.cache = events;
          const eventList = [...events];
          this._updatedFavs = false; // reset when getting fresh list
          this._fixDates(eventList);
          return this._createSessions(eventList);
          // return this._parseDates(eventList);
        });
    }
  }

  private _createSessions(list: Array<EventState.IEvent>) {
    return list.map(i => new Session(i));
  }

  private _fixDates(list: Array<EventState.IEvent>) {
    for (const ev of list) {
      this._parseTimes(ev);
      ev.cssClass = 'session-favorite';
      if (this._currentUser && this._currentUser.favs) {
        const isFav = this._currentUser.favs.find(id => id === ev.id);
        ev.isFavorite = !!isFav;
      }
    }
  }

  private _parseTimes(ev: EventState.IEvent) {
    const currentDate = new Date(ev.date);
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
    switch( day) {
      case 29:
        month = 0;
        day = 30;
        break;
      case 30:
        month = 0;
        day = 31;
        break;
      case 31:
        month = 1;
        day = 1;
        break;
      case 1:
        month = 1;
        day = 2;
        break;  
    }
    let {hour, min, sec, ampm} = this._parseTime(ev.startTime);
    ev.startDate = new Date(2018,month,day,hour,min);
    ev.startTime = `${hour}:${min < 10 ? ('0'+min) : min} ${ampm}`;
    const end = this._parseTime(ev.endTime);
    ev.endDate = new Date(2018,month,day,end.hour,end.min);
    ev.endTime = `${end.hour}:${end.min < 10 ? ('0'+end.min) : min} ${end.ampm}`;
  }

  private _parseTime(time: string) {
    const parts = time.split(':');
    let hour, min, sec;
    if (parts.length === 3) {
      hour = parseInt(parts[0]);
      min = parseInt(parts[1]);
      const secParts = parts[2].split(' ');
      let ampm = 'am';
      sec = parseInt(secParts[0]);
      if (secParts.length > 1) {
        ampm = secParts[1];
      } 
      return { hour, min, sec, ampm };
    } else {
      return { hour: 0, min: 0, sec: 0, ampm: 'am'};
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
