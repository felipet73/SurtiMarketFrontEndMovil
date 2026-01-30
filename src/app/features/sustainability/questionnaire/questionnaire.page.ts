import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonButton, IonProgressBar, IonSpinner, IonChip, IonIcon,
  IonRadioGroup, IonRadio
} from '@ionic/angular/standalone';

import { SustainabilityService, QuestionnaireDto, Dimension } from 'src/app/core/services/sustainability';

// ✅ array tipado para evitar errores TS
const DIM_LABEL: Record<Dimension, string> = {
  waste: 'Residuos',
  transport: 'Transporte',
  energy: 'Energía',
  water: 'Agua',
  consumption: 'Consumo',
};

@Component({
  standalone: true,
  selector: 'app-sustainability-questionnaire',
  templateUrl: './questionnaire.page.html',
  styleUrls: ['./questionnaire.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonButton, IonProgressBar, IonSpinner, IonChip, IonIcon,
    IonRadioGroup, IonRadio
  ],
})
export class QuestionnairePage implements OnInit {
  loading = true;
  saving = false;

  q!: QuestionnaireDto;

  dimIndex = 0;

  // answers: questionId -> selected option value (0..4)
  answers: Record<number, number> = {};

  constructor(private sus: SustainabilityService) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.q = await this.sus.getQuestionnaire();

      // valores por defecto: el medio (2)
      for (const qu of this.q.questions) {
        if (this.answers[qu.id] == null) this.answers[qu.id] = 2;
      }
    } finally {
      this.loading = false;
    }
  }

  // --- navegación por dimensión ---
  get dimensions() {
    return this.q?.dimensions ?? [];
  }

  get currentDim(): Dimension {
    return this.dimensions[this.dimIndex];
  }

  get currentDimLabel() {
    return DIM_LABEL[this.currentDim];
  }

  get totalDims() {
    return this.dimensions.length;
  }

  get progress() {
    if (!this.totalDims) return 0;
    return (this.dimIndex + 1) / this.totalDims;
  }

  get currentQuestions() {
    return this.q.questions.filter(x => x.dimension === this.currentDim);
  }

  prev() { this.dimIndex = Math.max(0, this.dimIndex - 1); }
  next() { this.dimIndex = Math.min(this.totalDims - 1, this.dimIndex + 1); }

  // --- validation (no permitir enviar sin respuestas) ---
  isDimComplete(dim: Dimension) {
    const qs = this.q.questions.filter(x => x.dimension === dim);
    return qs.every(x => this.answers[x.id] != null);
  }

  canGoNext() {
    return this.isDimComplete(this.currentDim);
  }

  // --- submit ---
  async submit() {
    this.saving = true;
    try {
      const payload = Object.entries(this.answers).map(([id, value]) => ({
        id: Number(id),
        value: Number(value),
      }));

      await this.sus.submitAssessment(payload);
      // redirige tú donde quieras luego (dashboard client)
      window.location.href = '/dashboard/client';
    } finally {
      this.saving = false;
    }
  }

  // UX: mostrar label de option
  optionLabel(val: number) {
    return this.q.options.find(o => o.value === val)?.label ?? `${val}`;
  }
}
