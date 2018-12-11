import { Component, OnInit } from '@angular/core'
import { AdminAuthService } from '../../services/admin-auth.service'
import { Router } from '@angular/router'

@Component({
  template: `
    <ui-card title="Sign out" subtitle="Are you sure you want to log out?">
      <div class="buttons">
        <button mat-button
                (click)="logout()">
          <i class="pull-left fa fa-google-plus"></i>
          <span>Log out</span>
        </button>
      </div>
    </ui-card>
  `,
  styles: [`
    .buttons {
      margin: 20px 0;
      text-align: center;
    }
  `],
})
export class AuthLogoutComponent {

  constructor(
    private router: Router,
    public auth: AdminAuthService,
  ) {
  }

  logout() {
    this.auth.removeToken()
    this.router.navigate(['/login'])
  }
}
