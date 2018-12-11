import { Component } from '@angular/core'

@Component({
  selector: 'app-auth-base',
  template: `
    <mat-sidenav-container>
      <mat-sidenav-content>
        <div fxFlexFill>
          <main fxFlexFill fxLayout="row" fxLayoutAlign="center center">
            <div fxFlex="30%" fxFlex.lg="40%" fxFlex.xs="100%" fxFlex.sm="80%" fxFlex.md="60%">
              <router-outlet></router-outlet>
            </div>
          </main>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
      `
      mat-sidenav-container {
        height: 100vh;
      }
    `
  ]
})
export class AuthLayoutComponent {
}
