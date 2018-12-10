import { NgModule } from '@angular/core';

// libs
import { environment } from '@ngatl/core';

// app
import { CoreModule } from './core/core.module';
import { SharedModule } from './features/shared/shared.module';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const routes: Routes = [];

@NgModule({
  imports: [CoreModule, SharedModule, RouterModule.forRoot(routes), BrowserAnimationsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
