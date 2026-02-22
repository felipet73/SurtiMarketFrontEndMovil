import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonBadge,
  IonSpinner
} from '@ionic/angular/standalone';
import { closeOutline, checkmarkOutline, closeCircleOutline, personAddOutline, notificationsOutline } from 'ionicons/icons';

import { NotificationsService, NotificationDto } from 'src/app/core/services/notifications';

@Component({
  standalone: true,
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.scss'],
  imports: [
    CommonModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonBadge,
    IonSpinner
  ],
})
export class NotificationsModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<number>();

  icons = {
    close: closeOutline,
    accept: checkmarkOutline,
    reject: closeCircleOutline,
    friend: personAddOutline,
    bell: notificationsOutline,
  };

  loading = false;
  errorMessage = '';
  items: NotificationDto[] = [];
  private closeHandled = false;

  constructor(private notifications: NotificationsService) {}

  async init() {
    this.closeHandled = false;
    this.loading = true;
    this.errorMessage = '';
    try {
      this.items = await this.notifications.getAll();
      this.emitUnread();
    } catch (e) {
      console.error('Notifications load error', e);
      this.errorMessage = 'No fue posible cargar notificaciones.';
    } finally {
      this.loading = false;
    }
  }

  async close() {
    if (this.closeHandled) return;
    this.closeHandled = true;
    try {
      await this.notifications.readNonActionable();
      this.items = this.items.map(n => this.canRespond(n) ? n : { ...n, status: 'READ' });
      this.emitUnread();
    } catch (e) {
      console.error('Read non-actionable notifications error', e);
    }
    this.closed.emit();
  }

  unreadCount() {
    return this.items.filter(n => n.status === 'UNREAD').length;
  }

  emitUnread() {
    this.updated.emit(this.unreadCount());
  }

  canRespond(n: NotificationDto) {
    return (n.type === 'FRIEND_REQUEST' || n.type === 'GROUP_INVITE') && n.status === 'UNREAD';
  }

  isGroupInvite(n: NotificationDto) {
    return n.type === 'GROUP_INVITE';
  }

  isFriendRequest(n: NotificationDto) {
    return n.type === 'FRIEND_REQUEST';
  }

  async accept(n: NotificationDto) {
    try {
      if (this.isGroupInvite(n)) {
        await this.notifications.acceptGroupInvite(n.id);
      } else {
        await this.notifications.accept(n.id);
      }
      n.status = 'READ';
      this.emitUnread();
    } catch (e) {
      console.error('Accept error', e);
      this.errorMessage = 'No fue posible aceptar la solicitud.';
    }
  }

  async reject(n: NotificationDto) {
    try {
      await this.notifications.reject(n.id);
      n.status = 'ARCHIVED';
      this.emitUnread();
    } catch (e) {
      console.error('Reject error', e);
      this.errorMessage = 'No fue posible rechazar la solicitud.';
    }
  }
}
