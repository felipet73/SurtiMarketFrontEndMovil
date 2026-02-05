import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
  IonAvatar, IonSpinner
} from '@ionic/angular/standalone';
import { closeOutline, searchOutline, personAddOutline, checkmarkOutline } from 'ionicons/icons';

import { FriendsService } from 'src/app/core/services/friends';

type ProfileVisibility = 'PUBLIC' | 'COMMUNITY' | 'GROUP_ONLY' | 'PRIVATE' | string;

interface CommunityUser {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
  emailMasked: string;
  profileVisibility: ProfileVisibility;
  canRequestFriend: boolean;
}

@Component({
  standalone: true,
  selector: 'app-friend-search-modal',
  templateUrl: './friend-search-modal.component.html',
  styleUrls: ['./friend-search-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
    IonAvatar, IonSpinner
  ],
})
export class FriendSearchModalComponent {
  @Input() open = false;
  @Input() friendIds: string[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() invited = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    search: searchOutline,
    add: personAddOutline,
    ok: checkmarkOutline,
  };

  loading = false;
  errorMessage = '';
  query = '';
  results: CommunityUser[] = [];
  requestedIds = new Set<string>();

  constructor(private friends: FriendsService) {}

  init() {
    this.query = '';
    this.results = [];
    this.errorMessage = '';
    this.requestedIds = new Set<string>();
  }

  close() {
    this.closed.emit();
  }

  isFriend(id: string) {
    return this.friendIds?.includes(id);
  }

  displayName(u: CommunityUser) {
    return (u.displayName || u.username || '').trim();
  }

  initials(u: CommunityUser) {
    const name = this.displayName(u);
    if (!name) return '?';
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase()).join('');
  }

  canShow(u: CommunityUser) {
    const visible = u.profileVisibility === 'PUBLIC' || u.profileVisibility === 'COMMUNITY';
    return u.canRequestFriend && visible;
  }

  async search() {
    const q = this.query.trim();
    if (q.length < 2) {
      this.results = [];
      this.errorMessage = 'Escribe al menos 2 caracteres para buscar.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    try {
      const res = await this.friends.searchUsers(q);
      this.results = (res ?? []).filter(u => this.canShow(u));
    } catch (e) {
      console.error('Friend search error', e);
      this.errorMessage = 'No fue posible buscar usuarios.';
    } finally {
      this.loading = false;
    }
  }

  async invite(u: CommunityUser) {
    if (this.isFriend(u.id) || this.requestedIds.has(u.id)) return;
    try {
      await this.friends.requestFriend(u.id);
      this.requestedIds.add(u.id);
      this.invited.emit();
    } catch (e) {
      console.error('Invite error', e);
      this.errorMessage = 'No fue posible enviar la invitacion.';
    }
  }
}
