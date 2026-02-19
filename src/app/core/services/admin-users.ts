import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface AdminUserDto {
  _id: string;
  fullName?: string;
  username?: string;
  displayName?: string;
  email: string;
  roles: string[];
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserDetailDto {
  id: string;
  fullName?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string | null;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUsersResponseDto {
  page: number;
  limit: number;
  total: number;
  items: AdminUserDto[];
}

export interface AdminUpdateUserPayload {
  fullName: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface AdminCreateUserPayload {
  fullName: string;
  email: string;
  username: string;
  password: string;
  role: 'EMPLOYEE';
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  constructor(private api: ApiService) {}

  getUsers(page = 1, limit = 100) {
    return firstValueFrom(
      this.api.get<AdminUsersResponseDto>(`/admin/users?page=${page}&limit=${limit}`)
    );
  }

  getUserById(userId: string) {
    return firstValueFrom(this.api.get<AdminUserDetailDto>(`/admin/users/${userId}`));
  }

  updateUser(userId: string, payload: AdminUpdateUserPayload) {
    return firstValueFrom(this.api.patch<AdminUserDetailDto>(`/admin/users/${userId}`, payload));
  }

  createEmployee(payload: AdminCreateUserPayload) {
    return firstValueFrom(this.api.post<AdminUserDetailDto>('/admin/users', payload));
  }

  deleteUser(userId: string) {
    return firstValueFrom(this.api.delete<AdminUserDetailDto>(`/admin/users/${userId}`));
  }
}
