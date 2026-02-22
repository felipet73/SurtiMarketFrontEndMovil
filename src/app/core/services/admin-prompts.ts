import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface ChallengeTemplateDto {
  _id: string;
  key: string;
  isActive: boolean;
  cadence: string;
  gameType: string;
  focusDimension: string;
  locale: string;
  rewardEcoCoins: number;
  systemPrompt: string;
  userPrompt: string;
  jsonSchema: unknown;
  cardImagePrompt?: string;
  numQuestions: number;
  temperature: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardTemplateDto {
  _id: string;
  key: string;
  isActive: boolean;
  locale: string;
  systemPrompt: string;
  userPrompt: string;
  jsonSchema: unknown;
  weeklyImagePrompt?: string;
  dailyCacheHours: number;
  weeklyImageCacheDays: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminPromptsService {
  constructor(private api: ApiService) {}

  getChallenges(params?: { activeOnly?: boolean; focusDimension?: string }) {
    const q = new URLSearchParams();
    if (typeof params?.activeOnly === 'boolean') q.set('activeOnly', String(params.activeOnly));
    if (params?.focusDimension) q.set('focusDimension', params.focusDimension);
    const query = q.toString();
    return firstValueFrom(
      this.api.get<ChallengeTemplateDto[]>(`/admin/prompts/challenges${query ? `?${query}` : ''}`)
    );
  }

  updateChallengeTemplate(templateId: string, payload: {
    rewardEcoCoins: number;
    numQuestions: number;
    temperature: number;
    locale: string;
    focusDimension: string;
    systemPrompt: string;
    userPrompt: string;
    cardImagePrompt: string;
    jsonSchema: unknown;
  }) {
    return firstValueFrom(
      this.api.patch<ChallengeTemplateDto>(`/admin/prompts/challenges/${templateId}`, payload)
    );
  }

  getDashboardTemplates(params?: { activeOnly?: boolean }) {
    const q = new URLSearchParams();
    if (typeof params?.activeOnly === 'boolean') q.set('activeOnly', String(params.activeOnly));
    const query = q.toString();
    return firstValueFrom(
      this.api.get<DashboardTemplateDto[]>(`/admin/prompts/dashboard${query ? `?${query}` : ''}`)
    );
  }

  updateDashboardTemplate(templateId: string, payload: {
    systemPrompt: string;
    userPrompt: string;
    weeklyImagePrompt: string;
    dailyCacheHours: number;
    weeklyImageCacheDays: number;
    jsonSchema: unknown;
  }) {
    return firstValueFrom(
      this.api.patch<DashboardTemplateDto>(`/admin/prompts/dashboard/${templateId}`, payload)
    );
  }
}
