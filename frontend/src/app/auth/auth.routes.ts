import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { AuthMode } from './model/auth.model';

export const AUTH_ROUTES: Routes = [
  { path: AuthMode.LOGIN, component: LoginFormComponent, data: { mode: AuthMode.LOGIN } },
  { path: AuthMode.REGISTER, component: RegisterFormComponent, data: { mode: AuthMode.REGISTER } },
  { path: AuthMode.FORGOT_PASSWORD, component: RegisterFormComponent, data: { mode: AuthMode.FORGOT_PASSWORD } }

];
