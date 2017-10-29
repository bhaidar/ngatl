import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// libs
import { MatSidenavModule } from '@angular/material';
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
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    JsonpModule,
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    MatSidenavModule,
    CoreModule,
    SharedModule,
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
    WorkshopsComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
