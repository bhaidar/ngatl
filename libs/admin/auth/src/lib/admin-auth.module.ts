import { NgModule } from '@angular/core'
import { Route } from '@angular/router'
import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AdminUiModule } from '@ngatl/admin/ui'
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui'

import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component'
import { AuthLogoutComponent } from './containers/auth-logout/auth-logout.component'
import { AuthLoginComponent } from './containers/auth-login/auth-login.component'
import { HttpAuthInterceptor } from './interceptors/http-auth-interceptor'

export const routes: Route[] = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'logout',
        component: AuthLogoutComponent,
      },
      {
        path: 'login',
        component: AuthLoginComponent,
      },
    ]
  },
]

@NgModule({
  imports: [CommonModule, AdminUiModule, NgxAuthFirebaseUIModule],
  declarations: [AuthLayoutComponent, AuthLoginComponent, AuthLogoutComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true
    },
  ]
})
export class AdminAuthModule {}
