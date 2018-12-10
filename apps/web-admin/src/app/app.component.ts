import { Component } from '@angular/core';

// xplat
import { AppBaseComponent } from '@ngatl/web';

@Component({
  selector: 'ngatl-root',
  templateUrl: './app.component.html'
})
export class AppComponent extends AppBaseComponent {
  constructor() {
    super();
  }
}
