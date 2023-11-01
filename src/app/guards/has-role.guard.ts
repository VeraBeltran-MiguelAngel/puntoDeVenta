import { CanActivateFn } from '@angular/router';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  return true;
};
