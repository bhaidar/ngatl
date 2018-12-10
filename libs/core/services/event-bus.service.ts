import { Injectable } from '@angular/core';

import { Observable, Observer, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

class EventBusArgs {
  type: string;
  data: any;
}

interface IEventBusTypes {
  tabIndexActivated: string;
  tabIndexChange: string;
}

@Injectable()
export class EventBusService {
  private _types: IEventBusTypes;
  private _messages$ = new Subject<EventBusArgs>();

  constructor() {
    // define all types here
    this._types = {
      tabIndexActivated: 'tabIndexActivated',
      tabIndexChange: 'tabIndexChange'
    };
  }

  public get types() {
    return this._types;
  }

  emit(eventType: string, data?: any) {
    this._messages$.next({ type: eventType, data: data });
  }

  observe(eventType: string) {
    return this._messages$.pipe(
      filter(args => args.type === eventType),
      map(args => args.data)
    );
  }
}
