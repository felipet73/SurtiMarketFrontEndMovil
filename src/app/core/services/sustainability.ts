import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { firstValueFrom } from 'rxjs';

export type Dimension = 'waste' | 'transport' | 'energy' | 'water' | 'consumption';

export interface QuestionnaireDto {
  version: number;
  scale: { min: number; max: number }; // 0..4
  dimensions: Dimension[];
  questions: Array<{ id: number; dimension: Dimension; text: string }>;
  options: Array<{ value: number; label: string }>; // 0..4
}

export interface SustainabilityMeDto {
  overallScore: number;
  dimensionScores: Record<Dimension, number>;
  baseline?: any;
  latest?: any;
  progress?: { deltaOverall: number };
  messages?: Array<{ title: string; text: string; dimension: Dimension; cta: string }>;
}

@Injectable({ providedIn: 'root' })
export class SustainabilityService {
  constructor(private api: ApiService) {}

  async getMeOrNull(): Promise<SustainabilityMeDto | null> {
    try {
      return await firstValueFrom(this.api.get<SustainabilityMeDto>('/sustainability/me'));
    } catch (e: any) {
      const status = e?.status ?? e?.error?.statusCode;
      const msg = e?.error?.message;
      if (status === 404 && typeof msg === 'string' && msg.toLowerCase().includes('no creado')) {
        return null;
      }
      throw e;
    }
  }

  async getQuestionnaire(): Promise<QuestionnaireDto> {
    return await firstValueFrom(this.api.get<QuestionnaireDto>('/sustainability/questionnaire'));
  }

  // aœ… Payload recomendado (pregunta id + value)
  async submitAssessment(answers1: Array<{ id: number; value: number }>) {
    const answers = answers1.map(a => a.value);
    return await firstValueFrom(this.api.post('/sustainability/assessment', { answers }));
  }
}
