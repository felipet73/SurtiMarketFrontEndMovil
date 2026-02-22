import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonSpinner, IonChip
} from '@ionic/angular/standalone';
import { closeOutline, createOutline } from 'ionicons/icons';
import { AdminPromptsService, ChallengeTemplateDto, DashboardTemplateDto } from 'src/app/core/services/admin-prompts';
import { EditChallengeTemplateModalComponent } from '../edit-challenge-template-modal/edit-challenge-template-modal.component';
import { EditDashboardTemplateModalComponent } from '../edit-dashboard-template-modal/edit-dashboard-template-modal.component';

type Tab = 'challenge' | 'dashboard';

@Component({
  standalone: true,
  selector: 'app-ai-prompts-modal',
  templateUrl: './ai-prompts-modal.component.html',
  styleUrls: ['./ai-prompts-modal.component.scss'],
  imports: [
    CommonModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonSpinner, IonChip,
    EditChallengeTemplateModalComponent,
    EditDashboardTemplateModalComponent
  ],
})
export class AiPromptsModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  icons = { close: closeOutline, edit: createOutline };
  activeTab: Tab = 'challenge';
  loading = false;
  errorMessage = '';

  challengeTemplates: ChallengeTemplateDto[] = [];
  dashboardTemplates: DashboardTemplateDto[] = [];

  editChallengeOpen = false;
  editDashboardOpen = false;
  selectedChallenge: ChallengeTemplateDto | null = null;
  selectedDashboard: DashboardTemplateDto | null = null;

  constructor(private prompts: AdminPromptsService) {}

  async init() {
    this.activeTab = 'challenge';
    await this.loadAll();
  }

  close() {
    this.closed.emit();
  }

  async loadAll() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const [challenges, dashboards] = await Promise.all([
        this.prompts.getChallenges({ activeOnly: true }),
        this.prompts.getDashboardTemplates({ activeOnly: true }),
      ]);
      this.challengeTemplates = challenges ?? [];
      this.dashboardTemplates = dashboards ?? [];
    } catch (e) {
      console.error('AI prompts load error', e);
      this.errorMessage = 'No fue posible cargar templates IA.';
      this.challengeTemplates = [];
      this.dashboardTemplates = [];
    } finally {
      this.loading = false;
    }
  }

  setTab(tab: Tab) {
    this.activeTab = tab;
  }

  editChallenge(t: ChallengeTemplateDto) {
    this.selectedChallenge = t;
    this.editChallengeOpen = true;
  }

  closeEditChallenge() {
    this.editChallengeOpen = false;
    this.selectedChallenge = null;
  }

  async onChallengeSaved() {
    this.closeEditChallenge();
    await this.loadAll();
  }

  editDashboard(t: DashboardTemplateDto) {
    this.selectedDashboard = t;
    this.editDashboardOpen = true;
  }

  closeEditDashboard() {
    this.editDashboardOpen = false;
    this.selectedDashboard = null;
  }

  async onDashboardSaved() {
    this.closeEditDashboard();
    await this.loadAll();
  }
}
