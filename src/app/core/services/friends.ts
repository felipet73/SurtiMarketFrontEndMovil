import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { FriendsMeDto } from '../dto/friends-me.dto';

@Injectable({ providedIn: 'root' })
export class FriendsService {
  constructor(private api: ApiService) {}

  getMe(): Promise<FriendsMeDto> {
    return firstValueFrom(this.api.get<FriendsMeDto>('/friends/me'));
  }

  searchUsers(query: string) {
    const q = encodeURIComponent(query);
    return firstValueFrom(this.api.get<any[]>(`/community/users/search?q=${q}`));
  }

  requestFriend(targetUserId: string) {
    return firstValueFrom(this.api.post('/friends/request', { targetUserId }));
  }
}
