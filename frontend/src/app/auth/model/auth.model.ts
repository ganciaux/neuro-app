export enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot-password'
}

export interface AuthCredentials {
    email: string;
    password: string;
    username?: string;
  }