export interface FriendUserDto {
  id: string;
  displayName: string;
  username?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
}

export interface FriendAcceptedDto {
  friendshipId: string;
  since?: string;
  user: FriendUserDto | null;
}

export interface FriendIncomingDto {
  friendshipId: string;
  requestedAt?: string;
  fromUser: FriendUserDto | null;
}

export interface FriendOutgoingDto {
  friendshipId: string;
  requestedAt?: string;
  toUser: FriendUserDto | null;
}

export interface FriendsMeDto {
  totals: {
    friends: number;
    pendingIncoming: number;
    pendingOutgoing: number;
  };
  friends: FriendAcceptedDto[];
  pendingIncoming: FriendIncomingDto[];
  pendingOutgoing: FriendOutgoingDto[];
}
