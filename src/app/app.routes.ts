import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { LoginPage } from './features/auth/login/login.page';
import { RegisterPage } from './features/auth/register/register.page';
import { guestGuard } from './core/guards/guest-guard';
import { AdminPanelLayout } from './core/features/admin/admin-panel/admin-panel.layout';
import { DashboardPage } from './core/features/admin/dashboard/dashboard.page';
import { OrdersPage } from './core/features/admin/orders/orders.page';
import { AuthorsPage } from './core/features/admin/authors/authors.page';
import { CategoriesPage } from './core/features/admin/categories/categories.page';
import { BooksPage } from './core/features/admin/books/books.page';
import { isadminGuard } from './core/guards/isadmin-guard';
import { ProfilePage } from './core/features/auth/profile/profile.page';
import { authGuardGuard } from './core/guards/auth.guard-guard';
import { VerifyPage } from './core/features/auth/verify/verify.page';
import { NotFoundComponent } from './core/features/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [guestGuard],
  },
  {

    path: 'books/:id',
    loadComponent: () =>
      import('./features/books/book-detail.page').then((m) => m.BookDetailPage),
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./features/books/books.page').then((m) => m.BooksPage),
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [authGuardGuard],
  },
  {
    path: 'verify-email',
    component: VerifyPage,
    canActivate: [guestGuard],
  },
  {
    path: 'admin',
    component: AdminPanelLayout,
    canActivate: [isadminGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardPage,
      },
      {
        path: 'orders',
        component: OrdersPage,
      },
      {
        path: 'authors',
        component: AuthorsPage,
      },
      {
        path: 'categories',
        component: CategoriesPage,
      },
      {
        path: 'books',
        component: BooksPage,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/orders.component').then((m) => m.OrdersComponent),
  },
  { path: '**', component: NotFoundComponent }
];
