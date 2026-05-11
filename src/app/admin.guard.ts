import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true; // Acceso permitido solo a Dioses (Admins)
  } else {
    // Si es un simple mortal, de vuelta al catálogo
    router.navigate(['/catalog']);
    return false;
  }
};
