// angular
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// app
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './features/shared/shared.module';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

// should ideally only be done in ApiService upon construction
import { LoopBackConfig } from '@ngatl/api';

const apiBaseUrl = 'http://ngatl.beeman.nl'; // 'https://ngatl.now.sh';

LoopBackConfig.setBaseURL(apiBaseUrl);

@NgModule({
  imports: [CoreModule, SharedModule, AppRoutingModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
