import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// libs
import { ModalModule } from 'ngx-bootstrap/modal';

// Import Re-usable Components:

// app
// Import Page Components:
import {
  CodeOfConductComponent,
  DetailsComponent,
  HomeComponent,
  BlogComponent,
  SessionsComponent,
  SpeakersComponent,
  SponsorsComponent,
  WorkshopsComponent
} from './pages/pages';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { routes } from './app-routing.module';

@NgModule({
  imports: [
    // Add .withServerTransition() to support Universal rendering.
    // The application ID can be any identifier which is unique on the page.
    BrowserModule.withServerTransition({appId: 'ngatl-app'}),

    BrowserAnimationsModule,
    HttpClientModule,
    JsonpModule,
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    CoreModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    BlogComponent,
    CodeOfConductComponent,
    DetailsComponent,
    HomeComponent,
    SessionsComponent,
    SpeakersComponent,
    SponsorsComponent,
    WorkshopsComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
