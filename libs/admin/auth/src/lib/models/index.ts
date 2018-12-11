export interface AuthAccessToken {
  token: string
  exp: number
  iat: number
  provider: string
  providerId: string
  user: any
}
