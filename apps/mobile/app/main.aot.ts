// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScript } from 'nativescript-angular/platform-static';
import * as app from 'tns-core-modules/application';
import { CustomAppDelegate } from './splash';

import { AppModuleNgFactory } from './app.module.ngfactory';

// if (app.ios) {
//   app.ios.delegate = CustomAppDelegate;
// }

platformNativeScript().bootstrapModuleFactory(AppModuleNgFactory);
