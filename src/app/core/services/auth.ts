import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { AuthUser, LoginResponse, Role, UserResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'sm_token';
  private userKey = 'sm_user';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {}

  // --- storage ---
  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; } catch { return null; }
  }

  private saveAuth(token: string, user: AuthUser) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getRoles(): Role[] {
    return this.currentUserSubject.value?.roles ?? [];
  }

  hasRole(role: Role): boolean {
    return this.getRoles().includes(role);
  }

  /** Prioridad por si un usuario tiene varios roles */
  getPrimaryRole(): Role | null {
    const roles = this.getRoles();
    if (roles.includes('ADMIN')) return 'ADMIN';
    if (roles.includes('EMPLOYEE')) return 'EMPLOYEE';
    if (roles.includes('CLIENT')) return 'CLIENT';
    return null;
  }

  // --- api ---
  async login(email: string, password: string) {
    const res = await firstValueFrom(
      this.api.post<LoginResponse>('/auth/login', { email, password })
    );

    this.saveAuth(res.accessToken, res.user);
    return res;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  async me() {
    const res = await firstValueFrom(
      this.api.get<UserResponse>('/auth/me' )
    );    
    return res;
  }

}
