import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonSpinner
} from '@ionic/angular/standalone';
import { closeOutline, addOutline } from 'ionicons/icons';

import { GroupsService } from 'src/app/core/services/group';

type JoinPolicy = 'OPEN' | 'REQUEST_APPROVAL' | 'INVITE_ONLY';
type Visibility = 'PUBLIC' | 'PRIVATE';

@Component({
  standalone: true,
  selector: 'app-group-create-modal',
  templateUrl: './group-create-modal.component.html',
  styleUrls: ['./group-create-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonSpinner
  ],
})
export class GroupCreateModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    add: addOutline,
  };

  loading = false;
  errorMessage = '';

  name = '';
  joinPolicy: JoinPolicy = 'REQUEST_APPROVAL';
  visibility: Visibility = 'PUBLIC';

  constructor(private groups: GroupsService) {}

  init() {
    this.errorMessage = '';
    this.name = '';
    this.joinPolicy = 'REQUEST_APPROVAL';
    this.visibility = 'PUBLIC';
  }

  close() {
    this.closed.emit();
  }

  async create() {
    const name = this.name.trim();
    if (!name) {
      this.errorMessage = 'Ingresa un nombre para el grupo.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.groups.createGroup({
        name,
        joinPolicy: this.joinPolicy,
        visibility: this.visibility,
      });
      this.created.emit();
      this.close();
    } catch (e) {
      console.error('Group create error', e);
      this.errorMessage = 'No fue posible crear el grupo.';
    } finally {
      this.loading = false;
    }
  }
}
