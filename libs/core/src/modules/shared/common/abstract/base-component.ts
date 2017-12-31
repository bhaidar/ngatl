/**
 * Common base component
 * Provides destroy$ observable for subclasses to use .takeUntil(this.destroy$)
 * Avoids having to keep up with so many subscriptions
 */
import { OnDestroy } from '@angular/core';
// libs
import { Subject } from 'rxjs/Subject';

export abstract class BaseComponent implements OnDestroy {
  public destroy$: Subject<any> = new Subject();

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
