import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonTextarea, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { AdminPromptsService, ChallengeTemplateDto } from 'src/app/core/services/admin-prompts';

@Component({
  standalone: true,
  selector: 'app-edit-challenge-template-modal',
  templateUrl: './edit-challenge-template-modal.component.html',
  styleUrls: ['./edit-challenge-template-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonTextarea
  ],
})
export class EditChallengeTemplateModalComponent {
  @Input() open = false;
  @Input() template: ChallengeTemplateDto | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  icons = { close: closeOutline, save: saveOutline };
  saving = false;
  errorMessage = '';

  form = {
    rewardEcoCoins: 0,
    numQuestions: 0,
    temperature: 0.3,
    locale: 'es-EC',
    focusDimension: 'water',
    systemPrompt: '',
    userPrompt: '',
    cardImagePrompt: '',
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
      rewardEcoCoins: this.template?.rewardEcoCoins ?? 0,
      numQuestions: this.template?.numQuestions ?? 5,
      temperature: this.template?.temperature ?? 0.3,
      locale: this.template?.locale ?? 'es-EC',
      focusDimension: this.template?.focusDimension ?? 'water',
      systemPrompt: this.template?.systemPrompt ?? '',
      userPrompt: this.template?.userPrompt ?? '',
      cardImagePrompt: this.template?.cardImagePrompt ?? '',
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

      await this.prompts.updateChallengeTemplate(this.template._id, {
        rewardEcoCoins: Number(this.form.rewardEcoCoins),
        numQuestions: Number(this.form.numQuestions),
        temperature: Number(this.form.temperature),
        locale: this.form.locale.trim(),
        focusDimension: this.form.focusDimension.trim(),
        systemPrompt: this.form.systemPrompt.trim(),
        userPrompt: this.form.userPrompt.trim(),
        cardImagePrompt: this.form.cardImagePrompt.trim(),
        jsonSchema: parsedSchema,
      });
      const t = await this.toast.create({ message: 'Template de retos actualizado', duration: 1800, color: 'success' });
      await t.present();
      this.saved.emit();
      this.close();
    } catch (e) {
      console.error('Update challenge template error', e);
      this.errorMessage = 'No fue posible guardar cambios.';
    } finally {
      this.saving = false;
    }
  }
}
