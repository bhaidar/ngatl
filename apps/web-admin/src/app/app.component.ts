import { Component } from '@angular/core';

// xplat
import { AppBaseComponent } from '@ngatl/web';

@Component({
  selector: 'ngatl-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent extends AppBaseComponent {
  constructor() {
    super();
  }
}
