import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const hasRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Accede al valor de 'rol' desde 'data' en el ActivatedRouteSnapshot
  const requiredRole = route.data['rol'];

  // Lógica para verificar si el usuario tiene el rol requerido
  // Por ejemplo, compara requiredRole con el rol del usuario autenticado
  if (auth.getRol() === requiredRole) {
    return true; // Usuario tiene el rol requerido, permite la navegación
  } else {
    // Usuario no tiene el rol requerido, redirige o toma otra acción apropiada
    router.navigate(['']); // Redirige a una página de acceso denegado
    return false; // No permite la navegación
  }
};
