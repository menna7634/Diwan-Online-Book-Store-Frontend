import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { LoginPage } from './features/auth/login/login.page';
import { RegisterPage } from './features/auth/register/register.page';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: "login",
    component: LoginPage
  },
  {
    path: "register",
    component: RegisterPage,
  }
];
