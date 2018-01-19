// Snapshot the ~/app.css and the theme
import * as application from 'tns-core-modules/application';
import 'ui/styling/style-scope';
const appCssContext = require.context('~/', false, /^\.\/app\.(css|scss|less|sass)$/);
global.registerWebpackModules(appCssContext);
application.loadAppCss();

import './vendor-platform';

import 'reflect-metadata';

// ng
import '@angular/core';
import '@angular/common';
import '@angular/forms';
import '@angular/http';
import '@angular/platform-browser';
import '@angular/router';

// ng libs
import '@ngrx/effects';
import '@ngrx/router-store';
import '@ngrx/store';
import '@ngx-translate/core';

// ns-ng
import 'nativescript-angular/platform-static';
import 'nativescript-angular/common';
import 'nativescript-angular/router';
import 'nativescript-angular/forms';
import 'nativescript-angular/http';

import 'date-fns';

// shared libs across all apps in Nx workspace
// TODO: import any shared libs here
import '@ngatl/api';
import '@ngatl/core';

// ns plugins
import 'nativescript-audio';
import 'nativescript-background-http';
import 'nativescript-camera-plus';
import 'nativescript-checkbox';
import 'nativescript-fancyalert';
import 'nativescript-imagecropper';
import 'nativescript-imagepicker';
import 'nativescript-loading-indicator';
import 'nativescript-ngx-fonticon';
import 'nativescript-permissions';
import 'nativescript-phone';
import 'nativescript-pro-ui/listview';

/**
 * app shared code
 * this list will be barrels of code imported in many different modules
 * local to the {N} app here only
 */
import './helpers';
import './modules/shared';
