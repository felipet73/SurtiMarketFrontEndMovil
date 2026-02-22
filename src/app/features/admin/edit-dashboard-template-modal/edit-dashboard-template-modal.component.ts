import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonTextarea, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { AdminPromptsService, DashboardTemplateDto } from 'src/app/core/services/admin-prompts';

@Component({
  standalone: true,
  selector: 'app-edit-dashboard-template-modal',
  templateUrl: './edit-dashboard-template-modal.component.html',
  styleUrls: ['./edit-dashboard-template-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonTextarea
  ],
})
export class EditDashboardTemplateModalComponent {
  @Input() open = false;
  @Input() template: DashboardTemplateDto | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  icons = { close: closeOutline, save: saveOutline };
  saving = false;
  errorMessage = '';

  form = {
    systemPrompt: '',
    userPrompt: '',
    weeklyImagePrompt: '',
    dailyCacheHours: 24,
    weeklyImageCacheDays: 7,
    jsonSchemaText: '{}',
  };

  constructor(
    private prompts: AdminPromptsService,
    private toast: ToastController
  ) {}

  init() {
    this.errorMessage = '';
    this.saving = false;
    this.form = {
      systemPrompt: this.template?.systemPrompt ?? '',
      userPrompt: this.template?.userPrompt ?? '',
      weeklyImagePrompt: this.template?.weeklyImagePrompt ?? '',
      dailyCacheHours: this.template?.dailyCacheHours ?? 24,
      weeklyImageCacheDays: this.template?.weeklyImageCacheDays ?? 7,
      jsonSchemaText: JSON.stringify(this.template?.jsonSchema ?? {}, null, 2),
    };
  }

  close() {
    this.closed.emit();
  }

  async save() {
    if (!this.template?._id || this.saving) return;
    this.saving = true;
    this.errorMessage = '';
    try {
      let parsedSchema: unknown = {};
      try {
        parsedSchema = JSON.parse(this.form.jsonSchemaText || '{}');
      } catch {
        this.errorMessage = 'JSON Schema invalido.';
        this.saving = false;
        return;
      }

      await this.prompts.updateDashboardTemplate(this.template._id, {
        systemPrompt: this.form.systemPrompt.trim(),
        userPrompt: this.form.userPrompt.trim(),
        weeklyImagePrompt: this.form.weeklyImagePrompt.trim(),
        dailyCacheHours: Number(this.form.dailyCacheHours),
        weeklyImageCacheDays: Number(this.form.weeklyImageCacheDays),
        jsonSchema: parsedSchema,
      });
      const t = await this.toast.create({ message: 'Template dashboard actualizado', duration: 1800, color: 'success' });
      await t.present();
      this.saved.emit();
      this.close();
    } catch (e) {
      console.error('Update dashboard template error', e);
      this.errorMessage = 'No fue posible guardar cambios.';
    } finally {
      this.saving = false;
    }
  }
}
