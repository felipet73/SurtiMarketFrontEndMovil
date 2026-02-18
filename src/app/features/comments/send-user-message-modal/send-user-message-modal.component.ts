import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonAvatar,
  IonTextarea, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, sendOutline } from 'ionicons/icons';
import { CommentsService } from 'src/app/core/services/comments';

interface MessageUserItem {
  id: string;
  fullName?: string | null;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

@Component({
  standalone: true,
  selector: 'app-send-user-message-modal',
  templateUrl: './send-user-message-modal.component.html',
  styleUrls: ['./send-user-message-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonAvatar,
    IonTextarea
  ],
})
export class SendUserMessageModalComponent {
  @Input() open = false;
  @Input() users: MessageUserItem[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() sent = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    send: sendOutline,
  };

  selectedUserId = '';
  text = '';
  sending = false;
  errorMessage = '';

  constructor(
    private comments: CommentsService,
    private toast: ToastController
  ) {}

  init() {
    this.text = '';
    this.errorMessage = '';
    this.sending = false;
    this.selectedUserId = this.users?.[0]?.id ?? '';
  }

  close() {
    this.closed.emit();
  }

  displayName(u: MessageUserItem) {
    return (u.displayName || u.username || u.fullName || 'Usuario').trim();
  }

  initials(u: MessageUserItem) {
    const name = this.displayName(u);
    if (!name) return '?';
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase()).join('');
  }

  async send() {
    const text = this.text.trim();
    if (!this.selectedUserId || !text || this.sending) return;
    this.sending = true;
    this.errorMessage = '';
    try {
      await this.comments.sendToUser(this.selectedUserId, text);
      await this.presentToast('Mesaje enviado', 'success');
      this.sent.emit();
      this.close();
    } catch (e) {
      console.error('Send user comment error', e);
      this.errorMessage = 'No fue posible enviar el mensaje.';
    } finally {
      this.sending = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
