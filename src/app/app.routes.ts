import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { LoginPage } from './features/auth/login/login.page';
import { RegisterPage } from './features/auth/register/register.page';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: "login",
    component: LoginPage,
    canActivate: [guestGuard]
  },
  {
    path: "register",
    component: RegisterPage,
    canActivate: [guestGuard]
  }
];
