import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('userRol');

  // 1. Si no hay token, mandarlo al login
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Si el rol es "Baja", cerrar sesión y mandarlo al login
  if (rol === 'Baja') {
    localStorage.clear();
    router.navigate(['/login']);
    return false;
  }

  return true; // Acceso permitido
};
