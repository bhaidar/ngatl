import { Component, OnInit } from '@angular/core'
import { AdminAuthService } from '../../services/admin-auth.service'
import { ActivatedRoute, Router } from '@angular/router'
import { filter, map, tap } from 'rxjs/operators'

@Component({
  template: `
    <ui-card title="Sign in" subtitle="Select a login provider.">
      <div class="buttons">
        <button mat-button
                class="btn-google-plus my-3"
                (click)="login('google')">
          <i class="pull-left fa fa-google-plus"></i>
          <span>Google+</span>
        </button>
      </div>
    </ui-card>
  `,
  styles: [`
    .buttons {
      margin: 20px 0;
      text-align: center;
    }
    .btn-google-plus {
      color: #fff;
      background-color: #d34836;
      border-color: #d34836;
    }

    .btn-google-plus:hover {
      color: #fff;
      background-color: #ba3929;
      border-color: #b03626;
    }
    .btn-google-plus:focus, .btn-google-plus.focus {
      box-shadow: 0 0 0 0.2rem rgba(211, 72, 54, 0.5);
    }
  `]
})
export class AuthLoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: AdminAuthService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(params => params['token']),
        filter(token => !!token),
        tap(token => this.auth.storeToken(token)),
      )
      .subscribe(() => this.router.navigate(['/']))
  }

  login(provider) {
    switch (provider) {
      case 'google':
        return this.router.navigate(['/'])
        // return this.auth.signInGoogle()
    }
  }
}
