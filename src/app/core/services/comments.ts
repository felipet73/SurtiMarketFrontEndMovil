import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface CommentUserDto {
  id: string;
  fullName: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface CommentItemDto {
  id: string;
  message: string;
  sentAt: string;
  direction: 'sent' | 'received' | string;
  channel: 'USER' | 'GROUP' | string;
  groupId: string | null;
  sender: CommentUserDto;
  recipient: CommentUserDto;
}

export interface CommentsMeResponseDto {
  total: number;
  items: CommentItemDto[];
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  constructor(private api: ApiService) {}

  getReceived() {
    return firstValueFrom(this.api.get<CommentsMeResponseDto>('/comments/me/received'));
  }
}
