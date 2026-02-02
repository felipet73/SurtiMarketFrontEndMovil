import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { WeeklyQuizMeDto, WeeklyQuizSubmitResponseDto } from '../dto/weekly-quiz.dto';

@Injectable({ providedIn: 'root' })
export class WeeklyQuizService {
  constructor(private api: ApiService) {}

  getMe(): Promise<WeeklyQuizMeDto> {
    return firstValueFrom(this.api.get<WeeklyQuizMeDto>('/challenges/weekly-quiz/me'));
  }

  submit(quizId: string, answers: number[]): Promise<WeeklyQuizSubmitResponseDto> {
    return firstValueFrom(
      this.api.post<WeeklyQuizSubmitResponseDto>(`/challenges/weekly-quiz/${quizId}/submit`, { answers })
    );
  }
}