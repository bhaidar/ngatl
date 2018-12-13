import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// libs
import { environment } from '@ngatl/core';

// app
import {
  AdminAuthModule,
  routes as AUTH_MODULE_ROUTES
} from '@ngatl/admin/auth';
import { AdminUiModule, LayoutComponent } from '@ngatl/admin/ui';
import { CoreModule } from './core/core.module';
import { SharedModule } from './features/shared/shared.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { IsLoggedInGuard } from '@ngatl/admin/auth/src/lib/guards/is-logged-in.guard'

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ IsLoggedInGuard ],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'conference',
        loadChildren: '@ngatl/admin/conference#AdminConferenceModule'
      },
      {
        path: 'system',
        loadChildren: '@ngatl/admin/system#AdminSystemModule'
      }
    ]
  },
  {
    path: '',
    children: [...AUTH_MODULE_ROUTES]
  }
];

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AdminAuthModule,
    AdminUiModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebase)
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
