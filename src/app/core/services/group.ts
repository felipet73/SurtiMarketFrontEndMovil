import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { GroupMeDto } from '../dto/group-me.dto';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  constructor(private api: ApiService) {}

  getMe(): Promise<GroupMeDto> {
    return firstValueFrom(this.api.get<GroupMeDto>('/groups/me'));
  }
}