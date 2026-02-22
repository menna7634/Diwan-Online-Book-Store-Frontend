import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.user$.pipe(
    take(1),
    map(user => !!user),
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
};
