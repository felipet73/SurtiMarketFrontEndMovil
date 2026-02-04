import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonSpinner, IonCheckbox, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { closeOutline } from 'ionicons/icons';

import { AuthService } from 'src/app/core/services/auth';
import { UserResponse } from 'src/app/core/models/auth.models';

type ProfileVisibility = 'PUBLIC' | 'COMMUNITY' | 'GROUP_ONLY' | 'PRIVATE';
type FriendRequests = 'ANYONE' | 'FRIENDS_OF_FRIENDS' | 'NOBODY';

interface PrivacyState {
  profileVisibility: ProfileVisibility;
  emailSearchable: boolean;
  friendRequests: FriendRequests;
}

@Component({
  standalone: true,
  selector: 'app-privacy-consent-modal',
  templateUrl: './privacy-consent-modal.component.html',
  styleUrls: ['./privacy-consent-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonSpinner, IonCheckbox, IonItem, IonLabel
  ],
})
export class PrivacyConsentModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  icons = {
    close: closeOutline,
  };

  loading = false;
  errorMessage = '';

  privacy?: PrivacyState;
  accepted = false;

  constructor(private auth: AuthService) {}

  async init() {
    if (this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    this.accepted = false;
    try {
      const me = await this.auth.me();
      this.fillPrivacy(me);
    } catch (e) {
      console.error('Privacy load error', e);
      this.errorMessage = 'No fue posible cargar la configuracion de privacidad.';
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.closed.emit();
  }

  private fillPrivacy(me: UserResponse) {
    this.privacy = {
      profileVisibility: (me.privacy?.profileVisibility ?? 'COMMUNITY') as ProfileVisibility,
      emailSearchable: me.privacy?.emailSearchable ?? true,
      friendRequests: (me.privacy?.friendRequests ?? 'ANYONE') as FriendRequests,
    };
  }

  visibilityLabel(v?: ProfileVisibility) {
    switch (v) {
      case 'PUBLIC': return 'Publico';
      case 'COMMUNITY': return 'Comunidad';
      case 'GROUP_ONLY': return 'Solo grupo';
      case 'PRIVATE': return 'Privado';
      default: return 'Comunidad';
    }
  }

  emailSearchableLabel(v?: boolean) {
    return v ? 'Si' : 'No';
  }

  friendRequestsLabel(v?: FriendRequests) {
    switch (v) {
      case 'ANYONE': return 'Cualquiera';
      case 'FRIENDS_OF_FRIENDS': return 'Amigos de amigos';
      case 'NOBODY': return 'Nadie';
      default: return 'Cualquiera';
    }
  }
}
