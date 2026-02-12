import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, NgZone  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonChip, IonProgressBar, IonSpinner
} from '@ionic/angular/standalone';
import { closeOutline, chevronBackOutline, chevronForwardOutline, sendOutline } from 'ionicons/icons';

import { WeeklyQuizService } from 'src/app/core/services/weekly-quiz';
import { WeeklyQuizMeDto, WeeklyQuizSubmitResponseDto, Dimension } from 'src/app/core/dto/weekly-quiz.dto';

@Component({
  standalone: true,
  selector: 'app-weekly-quiz-modal',
  templateUrl: './weekly-quiz-modal.component.html',
  styleUrls: ['./weekly-quiz-modal.component.scss'],
  imports: [
    CommonModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonChip, IonProgressBar, IonSpinner
  ],
})
export class WeeklyQuizModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    prev: chevronBackOutline,
    next: chevronForwardOutline,
    send: sendOutline,
  };

  loading = false;
  submitting = false;

  data?: WeeklyQuizMeDto;
  imgUrl?: string;

  step = 0; // índice de pregunta
  answers: Array<number | null> = [];

  // resultado submit
  done = false;
  result?: WeeklyQuizSubmitResponseDto;

  constructor(private quiz: WeeklyQuizService, private zone: NgZone) {}
  
  instanceId = Math.random().toString(16).slice(2);

  async init() {
    // si ya está cargando, evita doble llamada
    if (this.loading) return;

    // aœ… asegúrate de entrar en zona Angular
    this.zone.run(() => {
      this.loading = true;
      this.done = false;
      this.result = undefined;
      this.step = 0;
    });

    try {
      const dto = await this.quiz.getMe();

      this.zone.run(() => {
        this.data = dto;
        this.imgUrl = this.toDataUrl(dto.instance.cardImage.mimeType, dto.instance.cardImage.base64);
        const qCount = dto.instance.payload.questions.length;
        this.answers = Array.from({ length: qCount }, () => null);
      });
    } catch (e) {
      console.error('Quiz init error', e);
    } finally {
      this.zone.run(() => {
        this.loading = false;
      });
    }
  }

    close() {
    // si quieres limpiar al cerrar, hazlo aquí:
    this.resetLocal();
    this.closed.emit();
    }

    private resetLocal() {
    this.loading = false;
    this.submitting = false;
    this.data = undefined;
    this.imgUrl = undefined;
    this.step = 0;
    this.answers = [];
    this.done = false;
    this.result = undefined;
    }


  toDataUrl(mimeType: string, base64: string) {
    if (base64.startsWith('data:')) return base64;
    return `data:${mimeType};base64,${base64}`;
  }

  dimLabel(d: Dimension) {
    switch (d) {
      case 'waste': return 'Residuos';
      case 'transport': return 'Transporte';
      case 'energy': return 'Energía';
      case 'water': return 'Agua';
      case 'consumption': return 'Consumo';
    }
  }

  get questions() {
    return this.data?.instance.payload.questions ?? [];
  }

  get qTotal() {
    return this.questions.length;
  }

  get progress() {
    if (!this.qTotal) return 0;
    return (this.step + 1) / this.qTotal;
  }

  get currentQ() {
    return this.questions[this.step];
  }

  pick(choiceIndex: number) {
    this.answers[this.step] = choiceIndex;
  }

  canPrev() {
    return this.step > 0 && !this.submitting && !this.done;
  }

  canNext() {
    return this.step < this.qTotal - 1 && this.answers[this.step] !== null && !this.submitting && !this.done;
  }

  canSubmit() {
    return this.step === this.qTotal - 1 &&
      this.answers.every(a => a !== null) &&
      !this.submitting &&
      !this.done;
  }
  
  async submit() {
    if (!this.data) return;
    if (!this.canSubmit()) return;

    this.submitting = true;
    try {
      const quizId = this.data.instance.id;
      const finalAnswers = this.answers.map(a => a ?? 0) as number[];
      const res = await this.quiz.submit(quizId, finalAnswers);
      this.result = res;
      this.done = true;
      // confetti se activa por CSS cuando done=true
    } finally {
      this.submitting = false;
    }
  }

   transitionDir: 'next' | 'prev' = 'next';

    prev() {
      if (!this.canPrev()) return;
      this.transitionDir = 'prev';
      this.step--;
    }

    next() {
      if (!this.canNext()) return;
      this.transitionDir = 'next';
      this.step++;
    }

}