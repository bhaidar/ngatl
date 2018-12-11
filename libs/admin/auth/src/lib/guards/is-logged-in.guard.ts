import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AdminAuthService } from '../services/admin-auth.service'

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard implements CanActivate {

  constructor(
    private router: Router,
    private service: AdminAuthService,
  ) {
  }

  canActivate() {
    if (this.service.isLoggedIn()) {
      return true
    }
    this.router.navigate(['/login'])
    return false
  }

}
