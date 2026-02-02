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

export interface PrivacyPresponse{
    profileVisibility: string;
    emailSearchable: boolean;
    friendRequests: string;
}
export interface UserResponse {
    id: string;
    fullName: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string,
    privacy: PrivacyPresponse;
    email: string;
    roles: Role[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
