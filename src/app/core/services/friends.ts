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
}