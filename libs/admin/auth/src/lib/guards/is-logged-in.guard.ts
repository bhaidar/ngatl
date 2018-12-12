import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthProcessService } from 'ngx-auth-firebaseui'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthProcessService) {}

  canActivate(): Observable<boolean>  {
   return this.auth.afa.user
      .pipe(map(res => {
        if (res) {
          return true
        }
        this.router.navigate(['/login'])
        return false
      }))

  }

}
