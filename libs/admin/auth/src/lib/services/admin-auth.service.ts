import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

import { AuthAccessToken } from '../models'

const baseUrl = '/api/auth'
export const TOKEN_RAW = 'ADMIN_TOKEN_RAW'
export const TOKEN_NAME = 'ADMIN_TOKEN'

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  rawToken: string = null
  private token: AuthAccessToken = null
  private user: any = {}

  constructor(
    public http: HttpClient,
    public router: Router,
  ) {
    this.rawToken = localStorage.getItem(TOKEN_RAW)
    this.token = JSON.parse(localStorage.getItem(TOKEN_NAME))
  }

  storeToken(token: string) {
    this.rawToken = token
    this.user = this.token.user
    localStorage.setItem(TOKEN_RAW, token)
    localStorage.setItem(TOKEN_NAME, JSON.stringify(this.token))
  }

  removeToken() {
    localStorage.removeItem(TOKEN_RAW)
    localStorage.removeItem(TOKEN_NAME)
    this.token = null
    this.user = null
  }

  isLoggedIn() {
    return !!this.token
  }

  getTokenExpirationDate(): Date {
    if (this.token.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(this.token.exp);
    return date;
  }

  isTokenExpired(): boolean {
    if(!this.token) return true;

    const date = this.getTokenExpirationDate();
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  signInGoogle() {
    window.location.href = baseUrl + '/google'
  }

  signInGithub() {
    window.location.href = baseUrl + '/github'
  }
}
