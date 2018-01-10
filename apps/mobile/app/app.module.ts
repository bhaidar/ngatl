import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// nativescript
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

// app
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

// should ideally only be done in ApiService upon construction
import { LoopBackConfig } from '@ngatl/api';

const apiBaseUrl = 'http://ngatl.v0id.nl'; // 'https://ngatl.now.sh';

LoopBackConfig.setBaseURL(apiBaseUrl);

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptHttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
