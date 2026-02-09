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

  searchUsers(query?: string) {
    const q = (query ?? '').trim();
    const url = q ? `/community/users/search?q=${encodeURIComponent(q)}` : '/community/users/search';
    return firstValueFrom(this.api.get<any[]>(url));
  }

  requestFriend(targetUserId: string) {
    return firstValueFrom(this.api.post('/friends/request', { targetUserId }));
  }
}
