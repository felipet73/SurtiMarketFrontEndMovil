import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export type DayStatus = 'logged' | 'missed' | 'future';

export interface WeekDayItem {
  date: string;        // YYYY-MM-DD
  dayOfMonth: number;  // 1..31
  month: number;       // 1..12
  status: DayStatus;
}

export interface StreakDto {
  timezone: string;
  today: string;
  weekStart: string;
  weekEnd: string;
  loggedDates: string[];
  totalDays: number;
  weekLoggedCount: number;
  streakCurrent: number;
  streakBest: number;
  currentWeekDays: WeekDayItem[];
}

@Injectable({ providedIn: 'root' })
export class StreakService {
  constructor(private api: ApiService) {}

  markToday(): Promise<StreakDto> {
    return firstValueFrom(this.api.post<StreakDto>('/streak/mark', {}));
  }

  getMe(): Promise<StreakDto> {
    return firstValueFrom(this.api.get<StreakDto>('/streak/me'));
  }
}