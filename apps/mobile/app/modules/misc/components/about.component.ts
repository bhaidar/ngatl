import { Component } from '@angular/core';

// libs
import { Store } from '@ngrx/store';

// app
import { LoggerService } from '@ngatl/api';

@Component({
  moduleId: module.id,
  selector: 'ngatl-ns-about',
  templateUrl: 'about.component.html'
})
export class AboutComponent {

  constructor(private store: Store<any>, private log: LoggerService) {}

}
