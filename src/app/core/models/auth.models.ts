export type Role = 'ADMIN' | 'EMPLOYEE' | 'CLIENT';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  roles: Role[];
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
