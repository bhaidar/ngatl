// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';
import * as app from 'tns-core-modules/application';
import { CustomAppDelegate } from './splash';
import { AppModule } from './app.module';

/**
 * JavaScript error:
file:///app/tns_modules/tns-core-modules/application/application.js:235:87: JS ERROR Error: Value is not a class.
 */
// if (app.ios) {
//   app.ios.delegate = CustomAppDelegate;
// }

platformNativeScriptDynamic().bootstrapModule(AppModule);
