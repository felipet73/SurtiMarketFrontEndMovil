import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_REQUEST_ACCEPTED'
  | 'FRIEND_REQUEST_REJECTED'
  | 'GROUP_INVITE'
  | string;

export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | string;

export interface NotificationDto {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  body: string;
  payload?: {
    friendshipId?: string;
    requesterId?: string;
    [key: string]: unknown;
  };
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private api: ApiService) {}

  getAll(): Promise<NotificationDto[]> {
    return firstValueFrom(this.api.get<NotificationDto[]>('/notifications'));
  }

  accept(notificationId: string) {
    return firstValueFrom(this.api.post(`/notifications/${notificationId}/accept`, {}));
  }

  reject(requestId: string) {
    return firstValueFrom(this.api.post(`/notifications/${requestId}/reject`, {}));
  }

  acceptGroupInvite(notificationId: string) {
    return firstValueFrom(this.api.post(`/groups/invites/${notificationId}/accept`, {}));
  }

  readNonActionable() {
    return firstValueFrom(this.api.post('/notifications/me/read-non-actionable', {}));
  }
}
