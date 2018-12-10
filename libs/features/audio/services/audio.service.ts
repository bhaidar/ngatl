import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AudioService {
  public cleanup$: Subject<boolean> = new Subject();
}
