import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthProvider, AuthProcessService } from 'ngx-auth-firebaseui'

@Component({
  template: `
    <ui-card title="Sign in">
      <ngx-auth-firebaseui-providers [providers]="[providers.Google]"></ngx-auth-firebaseui-providers>
    </ui-card>
  `
})
export class AuthLoginComponent implements OnInit {
  providers = AuthProvider;
  constructor(private router: Router, public auth: AuthProcessService) {}

  ngOnInit() {
    this.auth.afa.user
      .pipe(filter(Boolean))
      .subscribe(() => this.router.navigate(['/']));
  }
}
