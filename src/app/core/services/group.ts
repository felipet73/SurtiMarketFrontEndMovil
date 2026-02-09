import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { GroupMeDto, GroupJoinRequestDto, MyGroupJoinRequestDto } from '../dto/group-me.dto';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  constructor(private api: ApiService) {}

  getMe(): Promise<GroupMeDto> {
    return firstValueFrom(this.api.get<GroupMeDto>('/groups/me'));
  }

  inviteUser(groupId: string, userId: string) {
    return firstValueFrom(this.api.post(`/groups/${groupId}/invite-user`, { userId }));
  }

  getJoinRequests(groupId: string): Promise<GroupJoinRequestDto[]> {
    return firstValueFrom(this.api.get<GroupJoinRequestDto[]>(`/groups/${groupId}/join-requests`));
  }

  acceptJoinRequest(groupId: string, userId: string) {
    return firstValueFrom(this.api.post(`/groups/${groupId}/join-requests/${userId}/accept`, {}));
  }

  searchGroups(query?: string) {
    const q = (query ?? '').trim();
    const url = q ? `/groups/search?q=${encodeURIComponent(q)}` : '/groups/search';
    return firstValueFrom(this.api.get<any[]>(url));
  }

  requestJoin(groupId: string) {
    return firstValueFrom(this.api.post(`/groups/${groupId}/join-request`, {}));
  }

  getMyJoinRequests(): Promise<MyGroupJoinRequestDto[]> {
    return firstValueFrom(this.api.get<MyGroupJoinRequestDto[]>(`/groups/me/join-requests`));
  }

  createGroup(payload: { name: string; joinPolicy: string; visibility: string }) {
    return firstValueFrom(this.api.post('/groups', payload));
  }
}
