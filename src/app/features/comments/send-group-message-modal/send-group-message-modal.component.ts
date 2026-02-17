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

interface GroupUserItem {
  id: string;
  fullName?: string | null;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

@Component({
  standalone: true,
  selector: 'app-send-group-message-modal',
  templateUrl: './send-group-message-modal.component.html',
  styleUrls: ['./send-group-message-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonAvatar,
    IonTextarea
  ],
})
export class SendGroupMessageModalComponent {
  @Input() open = false;
  @Input() members: GroupUserItem[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() sent = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    send: sendOutline,
  };

  text = '';
  sending = false;
  errorMessage = '';

  constructor(
    private comments: CommentsService,
    private toast: ToastController
  ) {}

  init() {
    this.text = '';
    this.sending = false;
    this.errorMessage = '';
  }

  close() {
    this.closed.emit();
  }

  displayName(u: GroupUserItem) {
    return (u.displayName || u.username || u.fullName || 'Usuario').trim();
  }

  initials(u: GroupUserItem) {
    const name = this.displayName(u);
    if (!name) return '?';
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase()).join('');
  }

  async send() {
    const text = this.text.trim();
    if (!text || this.sending) return;
    this.sending = true;
    this.errorMessage = '';
    try {
      await this.comments.sendToGroup(text);
      await this.presentToast('Mesaje enviado', 'success');
      this.sent.emit();
      this.close();
    } catch (e) {
      console.error('Send group comment error', e);
      this.errorMessage = 'No fue posible enviar el mensaje al grupo.';
    } finally {
      this.sending = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
