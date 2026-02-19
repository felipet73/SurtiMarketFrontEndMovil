import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { AdminUserDetailDto, AdminUsersService } from 'src/app/core/services/admin-users';

@Component({
  standalone: true,
  selector: 'app-edit-employee-modal',
  templateUrl: './edit-employee-modal.component.html',
  styleUrls: ['./edit-employee-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonSpinner
  ],
})
export class EditEmployeeModalComponent {
  @Input() open = false;
  @Input() userId = '';
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    save: saveOutline,
  };

  loading = false;
  saving = false;
  errorMessage = '';
  user?: AdminUserDetailDto;

  form = {
    fullName: '',
    username: '',
    displayName: '',
    avatarUrl: '',
    email: '',
    roles: [] as string[],
    isActive: true,
  };

  constructor(
    private adminUsers: AdminUsersService,
    private toast: ToastController
  ) {}

  async init() {
    if (!this.userId) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      this.user = await this.adminUsers.getUserById(this.userId);
      this.form = {
        fullName: this.user.fullName ?? '',
        username: this.user.username ?? '',
        displayName: this.user.displayName ?? '',
        avatarUrl: this.user.avatarUrl ?? '',
        email: this.user.email ?? '',
        roles: this.user.roles ?? ['EMPLOYEE'],
        isActive: this.user.isActive ?? true,
      };
    } catch (e) {
      console.error('Load employee detail error', e);
      this.errorMessage = 'No fue posible cargar los datos del empleado.';
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.closed.emit();
  }

  async save() {
    if (!this.userId || this.saving) return;
    this.saving = true;
    this.errorMessage = '';
    try {
      await this.adminUsers.updateUser(this.userId, {
        fullName: this.form.fullName.trim(),
        username: this.form.username.trim(),
        displayName: this.form.displayName.trim(),
        avatarUrl: this.form.avatarUrl.trim(),
        email: this.form.email.trim(),
        roles: this.form.roles,
        isActive: this.form.isActive,
      });
      await this.presentToast('Datos actualizados correctamente', 'success');
      this.updated.emit();
      this.close();
    } catch (e) {
      console.error('Update employee error', e);
      this.errorMessage = 'No fue posible actualizar el empleado.';
    } finally {
      this.saving = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
