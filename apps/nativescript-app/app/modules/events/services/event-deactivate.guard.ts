import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map, skip, take } from 'rxjs/operators';
import { LogService, ICoreState, UserState, ProgressService, UserActions } from '@ngatl/core';
import { EventComponent } from '../components/event.component';
import { EventService } from './event.service';

@Injectable()
export class EventDeactivateGuard implements CanDeactivate<EventComponent> {

  constructor(
    private _store: Store<ICoreState>,
    private _eventService: EventService,
    private _log: LogService,
    private _translate: TranslateService,
    private _progressService: ProgressService,
  ) {}

  canDeactivate(component: EventComponent): Promise<boolean> {
    this._log.debug('EventDeactivateGuard canDeactivate');
    return new Promise((resolve) => {
      // simple check first
      if (this._eventService.origFavs && this._eventService.currentUser && this._eventService.conferenceModel) {
        const savedFavs = this._eventService.currentUser.favs ? this._eventService.currentUser.favs : [];
        const origFavs = JSON.stringify(this._eventService.origFavs);
        const inViewFavs = this._eventService.conferenceModel.fullSchedule.filter(e => e.isFavorite).map(e => e.id);
        const inViewFavsString = JSON.stringify(inViewFavs);
        this._log.debug('origFavs:', origFavs);
        this._log.debug('inViewFavs:', inViewFavsString);
        if (origFavs === inViewFavsString) {
          resolve(true);
        } else {
          this._progressService.toggleSpinner(true, { message: this._translate.instant('user.save-favs') });
          this._store.pipe(
            select((s: ICoreState) => s.user),
            skip(1),
            take(1)
          )
            .subscribe((s: UserState.IState) => {
              if (s.current) {
                // this._log.debug('user.current fired:', s.current.favs);
                this._progressService.toggleSpinner();
                // this._eventService.updateFullScheduleFavs(s.current.favs);
                resolve(true);
              }
            });
          const user = Object.assign({}, this._eventService.currentUser);
          user.favs = inViewFavs;
          this._log.debug('saving favs via this._store.dispatch(new UserActions.UpdateAction(user))');
          this._store.dispatch(new UserActions.UpdateAction(user));
        }
      } else {
        this._log.debug('EventDeactivateGuard canDeactivate resolve immediately true');
        resolve(true);
      }
    });
  }
}