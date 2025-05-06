import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';
import { AuthComponent } from './auth/pages/auth/auth.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: AUTH_ROUTES,
    component: AuthComponent,
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
];
