import { TOKEN_NAME } from './services/admin-auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer ';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = JSON.parse(localStorage.getItem(TOKEN_NAME))

    if (token.token) {
      const cloned = req.clone({
        headers: req.headers.set(AUTH_HEADER_KEY, AUTH_PREFIX + token.token)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
