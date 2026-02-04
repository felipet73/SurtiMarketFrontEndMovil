import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonSpinner, IonItem, IonInput, IonLabel,
  IonCheckbox
} from '@ionic/angular/standalone';
import { closeOutline, saveOutline } from 'ionicons/icons';

import { AuthService } from 'src/app/core/services/auth';

interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

@Component({
  standalone: true,
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonSpinner, IonItem, IonInput, IonLabel,
    IonCheckbox
  ],
})
export class RegisterModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    save: saveOutline,
  };

  loading = false;
  errorMessage = '';
  accepted = false;

  form: RegisterPayload = {
    fullName: '',
    username: '',
    email: '',
    password: '',
  };

  constructor(private auth: AuthService) {}

  close() {
    this.closed.emit();
  }

  canSubmit() {
    return !!this.form.fullName &&
      !!this.form.username &&
      !!this.form.email &&
      !!this.form.password &&
      this.accepted &&
      !this.loading;
  }

  async submit() {
    if (!this.canSubmit()) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.auth.register(this.form);
      this.closed.emit();
    } catch (e: any) {
      console.error('Register error', e);
      this.errorMessage = e?.error?.message ?? 'No fue posible registrar.';
    } finally {
      this.loading = false;
    }
  }
}
