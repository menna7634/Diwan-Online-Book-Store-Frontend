import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () => import('./features/books/books.module').then(m => m.BooksModule)
//   },
//   {
//     path: 'auth',
//     loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
//   },
//   {
//     path: 'cart',
//     loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule)
//   },
//   {
//     path: 'orders',
//     loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule)
//   },
//   {
//     path: 'admin',
//     loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
//   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }