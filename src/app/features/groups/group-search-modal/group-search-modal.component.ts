import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
  IonSpinner, IonChip
} from '@ionic/angular/standalone';
import { closeOutline, searchOutline, personAddOutline, checkmarkOutline } from 'ionicons/icons';

import { GroupsService } from 'src/app/core/services/group';
import { MyGroupJoinRequestDto } from 'src/app/core/dto/group-me.dto';

type JoinPolicy = 'OPEN' | 'REQUEST_APPROVAL' | 'INVITE_ONLY' | string;
type Visibility = 'PUBLIC' | 'PRIVATE' | string;

interface GroupSearchResult {
  id: string;
  name: string;
  description?: string | null;
  memberCount?: number | null;
  joinPolicy?: JoinPolicy;
  visibility?: Visibility;
}

@Component({
  standalone: true,
  selector: 'app-group-search-modal',
  templateUrl: './group-search-modal.component.html',
  styleUrls: ['./group-search-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
    IonSpinner, IonChip
  ],
})
export class GroupSearchModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() requested = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    search: searchOutline,
    add: personAddOutline,
    ok: checkmarkOutline,
  };

  loading = false;
  errorMessage = '';
  query = '';
  results: GroupSearchResult[] = [];
  requestedIds = new Set<string>();
  myRequests: MyGroupJoinRequestDto[] = [];

  constructor(private groups: GroupsService) {}

  init() {
    this.query = '';
    this.results = [];
    this.errorMessage = '';
    this.requestedIds = new Set<string>();
    this.loadAll();
    this.loadMyRequests();
  }

  close() {
    this.closed.emit();
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
      this.results = await this.groups.searchGroups(q);
    } catch (e) {
      console.error('Group search error', e);
      this.errorMessage = 'No fue posible buscar grupos.';
    } finally {
      this.loading = false;
    }
  }

  async loadAll() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.results = await this.groups.searchGroups();
    } catch (e) {
      console.error('Group search error', e);
      this.errorMessage = 'No fue posible cargar grupos.';
    } finally {
      this.loading = false;
    }
  }

  async loadMyRequests() {
    try {
      this.myRequests = await this.groups.getMyJoinRequests();
      this.requestedIds = new Set<string>(this.myRequests.map(r => r.group?.id).filter(id => !!id) as string[]);
    } catch (e) {
      console.error('My join requests error', e);
    }
  }

  async requestJoin(g: GroupSearchResult) {
    if (!g?.id || this.requestedIds.has(g.id)) return;
    try {
      await this.groups.requestJoin(g.id);
      this.requestedIds.add(g.id);
      this.requested.emit();
      this.close();
    } catch (e) {
      console.error('Group join request error', e);
      this.errorMessage = 'No fue posible solicitar unirse.';
    }
  }
}
