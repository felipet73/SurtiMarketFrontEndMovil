import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonSpinner, IonList, IonItem, IonLabel,
  IonInput, IonSelect, IonSelectOption, IonToggle, IonAvatar
} from '@ionic/angular/standalone';
import { closeOutline, saveOutline, cameraOutline, imageOutline, banOutline } from 'ionicons/icons';

import { AuthService } from 'src/app/core/services/auth';
import { UserResponse } from 'src/app/core/models/auth.models';

type ProfileVisibility = 'PUBLIC' | 'COMMUNITY' | 'GROUP_ONLY' | 'PRIVATE';
type FriendRequests = 'ANYONE' | 'FRIENDS_OF_FRIENDS' | 'NOBODY';

interface UpdateProfilePayload {
  fullName: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  privacy: {
    profileVisibility: ProfileVisibility;
    emailSearchable: boolean;
    friendRequests: FriendRequests;
  };
  email: string;
  roles: string[];
  isActive: boolean;
}

@Component({
  standalone: true,
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonSpinner, IonList, IonItem, IonLabel,
    IonInput, IonSelect, IonSelectOption, IonToggle, IonAvatar
  ],
})
export class EditProfileModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    save: saveOutline,
    camera: cameraOutline,
    image: imageOutline,
    ban: banOutline,
  };

  loading = false;
  saving = false;
  errorMessage = '';

  form?: UpdateProfilePayload;
  avatarPreview = '';

  constructor(private auth: AuthService) {}

  async init() {
    if (this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      const me = await this.auth.me();
      this.fillForm(me);
    } catch (e) {
      console.error('Profile load error', e);
      this.errorMessage = 'No fue posible cargar el perfil.';
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.resetLocal();
    this.closed.emit();
  }

  private resetLocal() {
    this.loading = false;
    this.saving = false;
    this.errorMessage = '';
    this.form = undefined;
    this.avatarPreview = '';
  }

  private fillForm(me: UserResponse) {
    this.form = {
      fullName: me.fullName ?? '',
      username: me.username ?? '',
      displayName: me.displayName ?? '',
      avatarUrl: me.avatarUrl ?? '',
      privacy: {
        profileVisibility: (me.privacy?.profileVisibility ?? 'COMMUNITY') as ProfileVisibility,
        emailSearchable: me.privacy?.emailSearchable ?? true,
        friendRequests: (me.privacy?.friendRequests ?? 'ANYONE') as FriendRequests,
      },
      email: me.email ?? '',
      roles: me.roles ?? [],
      isActive: me.isActive ?? true,
    };
    this.avatarPreview = this.form.avatarUrl;
  }

  triggerFile(input: HTMLInputElement) {
    input.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.form) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.avatarPreview = result;
      this.form!.avatarUrl = result;
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  setInactive() {
    if (this.form) {
      this.form.isActive = false;
    }
  }

  async submit() {
    if (!this.form || this.saving) return;
    this.saving = true;
    this.errorMessage = '';
    try {
      const res = await this.auth.updateProfile(this.form);
      this.fillForm(res);
    } catch (e) {
      console.error('Profile update error', e);
      this.errorMessage = 'No fue posible actualizar el perfil.';
    } finally {
      this.saving = false;
    }
  }
}
