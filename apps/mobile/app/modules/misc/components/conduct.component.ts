import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';

// app
import { LoggerService } from '@ngatl/api';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-conduct',
  templateUrl: 'conduct.component.html'
})
export class ConductComponent {

  constructor(private store: Store<any>, private log: LoggerService) {}

}
