import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { tap } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      const cartService = inject(CartService);
      return authService
        .hydrate()
        .pipe(
          tap(() => {
            if (authService.getAccessToken()) {
              cartService.loadCart();
            }
          }),
        )
        .toPromise();
    }),
  ],
};
