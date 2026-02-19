import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonAvatar, IonChip, IonSelect,
  IonSelectOption, IonSpinner, ToastController, IonToggle
} from '@ionic/angular/standalone';
import { closeOutline, searchOutline, createOutline, trashOutline } from 'ionicons/icons';
import { AdminUserDto, AdminUsersService } from 'src/app/core/services/admin-users';
import { EditEmployeeModalComponent } from '../edit-employee-modal/edit-employee-modal.component';
import { CreateEmployeeModalComponent } from '../create-employee-modal/create-employee-modal.component';

type RoleFilter = 'EMPLOYEE' | 'CLIENT';

@Component({
  standalone: true,
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonAvatar, IonChip, IonSelect,
    IonSelectOption, IonSpinner, IonToggle,
    EditEmployeeModalComponent,
    CreateEmployeeModalComponent
  ],
})
export class UsersModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    search: searchOutline,
    edit: createOutline,
    remove: trashOutline,
  };

  loading = false;
  errorMessage = '';
  query = '';
  roleFilter: RoleFilter = 'EMPLOYEE';
  showDeleted = false;
  users: AdminUserDto[] = [];
  editOpen = false;
  createOpen = false;
  selectedUserId = '';

  constructor(
    private adminUsers: AdminUsersService,
    private toast: ToastController
  ) {}

  async init() {
    this.roleFilter = 'EMPLOYEE';
    this.query = '';
    this.showDeleted = false;
    await this.loadUsers();
  }

  close() {
    this.closed.emit();
  }

  async loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const res = await this.adminUsers.getUsers(1, 100);
      this.users = res.items ?? [];
    } catch (e) {
      console.error('Admin users load error', e);
      this.users = [];
      this.errorMessage = 'No fue posible cargar usuarios.';
    } finally {
      this.loading = false;
    }
  }

  get filteredUsers() {
    const role = this.roleFilter;
    const q = this.query.trim().toLowerCase();
    return this.users.filter(u => {
      const hasRole = (u.roles ?? []).includes(role);
      if (!hasRole) return false;
      if (!this.showDeleted && !u.isActive) return false;
      if (!q) return true;
      const haystack = [
        u.fullName ?? '',
        u.username ?? '',
        u.displayName ?? '',
        u.email ?? '',
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }

  displayName(u: AdminUserDto) {
    return (u.displayName || u.username || u.fullName || u.email || 'Usuario').trim();
  }

  initials(u: AdminUserDto) {
    const name = this.displayName(u);
    if (!name) return '?';
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase()).join('');
  }

  editUser(u: AdminUserDto) {
    if (this.roleFilter !== 'EMPLOYEE') return;
    this.selectedUserId = u._id;
    this.editOpen = true;
  }

  openCreateEmployee() {
    this.createOpen = true;
  }

  closeCreateEmployee() {
    this.createOpen = false;
  }

  closeEditEmployee() {
    this.editOpen = false;
    this.selectedUserId = '';
  }

  async onEmployeeSaved() {
    this.closeEditEmployee();
    this.closeCreateEmployee();
    await this.loadUsers();
  }

  async deleteUser(u: AdminUserDto) {
    if (this.roleFilter !== 'EMPLOYEE') return;
    try {
      const res = await this.adminUsers.deleteUser(u._id);
      const targetId = res.id || u._id;
      this.users = this.users.map(item =>
        item._id === targetId ? { ...item, isActive: false, updatedAt: res.updatedAt } : item
      );
      await this.presentToast('Usuario desactivado correctamente', 'success');
    } catch (e) {
      console.error('Delete user error', e);
      this.errorMessage = 'No fue posible eliminar el usuario.';
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
