export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type JoinPolicy = 'OPEN' | 'REQUEST_APPROVAL' | 'INVITE_ONLY';
export type Visibility = 'PUBLIC' | 'PRIVATE';

export interface GroupMembershipDto {
  role: GroupRole;
  joinedAt: string; // ISO date string
}

export interface GroupDto {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  level: number;
  xp: number;
  joinPolicy: JoinPolicy;
  visibility: Visibility;
}

export interface GroupMeDto {
  inGroup: boolean;
  membership?: GroupMembershipDto;
  group?: GroupDto;
  members?: GroupMemberDto[];
}

export interface GroupMemberUserDto {
  id: string;
  fullName?: string | null;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface GroupMemberDto {
  role: GroupRole;
  joinedAt: string;
  user: GroupMemberUserDto | null;
}

export interface GroupJoinRequestDto {
  user: GroupMemberUserDto | null;
  requestedAt: string;
}

export interface MyGroupJoinRequestDto {
  group: GroupDto;
  requestedAt: string;
  status: string;
}
