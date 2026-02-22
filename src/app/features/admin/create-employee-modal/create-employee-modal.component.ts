import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonSelect, IonSelectOption, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, personAddOutline } from 'ionicons/icons';
import { AdminUsersService } from 'src/app/core/services/admin-users';

@Component({
  standalone: true,
  selector: 'app-create-employee-modal',
  templateUrl: './create-employee-modal.component.html',
  styleUrls: ['./create-employee-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonSelect, IonSelectOption
  ],
})
export class CreateEmployeeModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    add: personAddOutline,
  };

  saving = false;
  errorMessage = '';

  form = {
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'EMPLOYEE' as const,
  };

  constructor(
    private adminUsers: AdminUsersService,
    private toast: ToastController
  ) {}

  init() {
    this.saving = false;
    this.errorMessage = '';
    this.form = {
      fullName: '',
      email: '',
      username: '',
      password: '',
      role: 'EMPLOYEE',
    };
  }

  close() {
    this.closed.emit();
  }

  async save() {
    if (this.saving) return;
    this.saving = true;
    this.errorMessage = '';
    try {
      await this.adminUsers.createEmployee({
        fullName: this.form.fullName.trim(),
        email: this.form.email.trim(),
        username: this.form.username.trim(),
        password: this.form.password,
        role: 'EMPLOYEE',
      });
      await this.presentToast('Empleado creado correctamente', 'success');
      this.created.emit();
      this.close();
    } catch (e) {
      console.error('Create employee error', e);
      this.errorMessage = 'No fue posible crear el empleado.';
    } finally {
      this.saving = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
