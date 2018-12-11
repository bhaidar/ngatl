// From https://www.illucit.com/en/angular/angular-5-httpinterceptor-add-bearer-token-to-httpclient-requests/ :)
import { from, Observable } from 'rxjs'

import { Injectable } from '@angular/core'
import { HttpInterceptor } from '@angular/common/http'
import { HttpRequest } from '@angular/common/http'
import { HttpHandler } from '@angular/common/http'
import { HttpEvent } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'
import { AdminAuthService } from '../services/admin-auth.service'

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private service: AdminAuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next))
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const token = this.service.rawToken

    // HttpHeader object immutable - copy values
    const headerSettings: { [name: string]: string | string[]; } = {}

    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key)
    }
    if (token) {
      headerSettings['Authorization'] = 'Bearer ' + token
    }
    headerSettings['Content-Type'] = 'application/json'
    const newHeader = new HttpHeaders(headerSettings)

    const changedRequest = request.clone({ headers: newHeader })
    return next.handle(changedRequest).toPromise()
  }

}
