import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { EcoImpactLeaderboardDto, EcoImpactMeDto, EcoImpactProgressDto } from '../dto/ecoimpact.dto';

@Injectable({ providedIn: 'root' })
export class EcoImpactService {
  constructor(private api: ApiService) {}

  getMe(): Promise<EcoImpactMeDto> {
    return firstValueFrom(this.api.get<EcoImpactMeDto>('/ecoimpact/me'));
  }

  getLeaderboard(page = 1, limit = 20): Promise<EcoImpactLeaderboardDto> {
    return firstValueFrom(
      this.api.get<EcoImpactLeaderboardDto>(`/ecoimpact/leaderboard?page=${page}&limit=${limit}`)
    );
  }

  getProgress(): Promise<EcoImpactProgressDto> {
    return firstValueFrom(this.api.get<EcoImpactProgressDto>('/ecoimpact/progress'));
  }
}
