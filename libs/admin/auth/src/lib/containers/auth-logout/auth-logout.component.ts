import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from 'ngx-auth-firebaseui';
import { Location } from '@angular/common'

@Component({
  template: `
    <ui-card title="Sign out" subtitle="Are you sure you want to sign out?">
      <div class="buttons">
        <button mat-flat-button
                color="accent"
                (click)="back()">
          <span>Back</span>
        </button>
        <button mat-flat-button
                color="primary"
                (click)="logout()">
          <span>Sign out</span>
        </button>
      </div>
    </ui-card>
  `,
  styles: [
    `
    .buttons {
      margin: 20px 0;
      text-align: center;
    }
    button {
      margin: 0 5px;
    }
    `
  ]
})
export class AuthLogoutComponent {
  constructor(
    private location: Location,
    private router: Router, public auth: AuthProcessService) {}

  back() {
    this.location.back()
  }

  logout() {
    this.auth.afa.auth.signOut().then(() => this.router.navigate(['/login']));
  }
}
