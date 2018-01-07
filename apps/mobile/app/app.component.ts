import { Component } from '@angular/core';

// nativescript
import { registerElement } from 'nativescript-angular/element-registry';
import { topmost } from 'tns-core-modules/ui/frame';

// register plugin components
// registerElement('VideoPlayer', () => require('nativescript-videoplayer').Video);
registerElement('Shimmer', () => require('nativescript-shimmer').Shimmer);

// app
import { NSAppService } from './modules/core/services/ns-app.service';

@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private _appService: NSAppService // DO NOT REMOVE (used to construct singleton)
  ) {
    if (topmost().ios) {
      let navigationBar = topmost().ios.controller.navigationBar;
      // 0: default
      // 1: light
      navigationBar.barStyle = 1;
    }
  }
}
