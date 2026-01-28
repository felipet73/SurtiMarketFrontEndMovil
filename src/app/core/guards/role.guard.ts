import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const roleGuard = (allowed: Array<'ADMIN' | 'EMPLOYEE' | 'CLIENT'>): CanActivateFn => () => {
  const auth = inject(AuthService);
  return allowed.some(r => auth.hasRole(r));
};