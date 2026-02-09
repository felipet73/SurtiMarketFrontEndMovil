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
import { GroupsService } from 'src/app/core/services/group';

type ProfileVisibility = 'PUBLIC' | 'COMMUNITY' | 'GROUP_ONLY' | 'PRIVATE' | string;

interface CommunityUser {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
  emailMasked: string;
  profileVisibility: ProfileVisibility;
}

@Component({
  standalone: true,
  selector: 'app-group-invite-modal',
  templateUrl: './group-invite-modal.component.html',
  styleUrls: ['./group-invite-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
    IonAvatar, IonSpinner
  ],
})
export class GroupInviteModalComponent {
  @Input() open = false;
  @Input() groupId: string | null = null;
  @Input() memberIds: string[] = [];
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
  invitedIds = new Set<string>();

  constructor(private friends: FriendsService, private groups: GroupsService) {}

  init() {
    this.query = '';
    this.results = [];
    this.errorMessage = '';
    this.invitedIds = new Set<string>();
    this.loadAll();
  }

  close() {
    this.closed.emit();
  }

  isMember(id: string) {
    return this.memberIds?.includes(id);
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

  async search() {
    const q = this.query.trim();
    if (!q) {
      await this.loadAll();
      return;
    }
    if (q.length < 2) {
      this.errorMessage = 'Escribe al menos 2 caracteres para buscar.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    try {
      const res = await this.friends.searchUsers(q);
      this.results = res ?? [];
    } catch (e) {
      console.error('Group invite search error', e);
      this.errorMessage = 'No fue posible buscar usuarios.';
    } finally {
      this.loading = false;
    }
  }

  async loadAll() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const res = await this.friends.searchUsers();
      this.results = res ?? [];
    } catch (e) {
      console.error('Group invite load error', e);
      this.errorMessage = 'No fue posible cargar usuarios.';
    } finally {
      this.loading = false;
    }
  }

  async invite(u: CommunityUser) {
    if (!this.groupId || this.isMember(u.id) || this.invitedIds.has(u.id)) return;
    try {
      await this.groups.inviteUser(this.groupId, u.id);
      this.invitedIds.add(u.id);
      this.invited.emit();
    } catch (e) {
      console.error('Group invite error', e);
      this.errorMessage = 'No fue posible invitar al usuario.';
    }
  }
}
