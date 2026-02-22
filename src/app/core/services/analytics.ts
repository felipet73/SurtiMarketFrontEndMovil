import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface AnalyticsDashboardResponse {
  range?: {
    from?: string;
    to?: string;
    tz?: string;
  };
  charts?: {
    activityDaily?: unknown;
    dimensionWeekly?: unknown;
    ecoCoinsBreakdown?: unknown;
    ordersTopCustomers?: unknown;
    streakDistribution?: unknown;
    ordersVsTicketWeekly?: unknown;
    [key: string]: unknown;
  };
  activityDaily?: unknown;
  dimensionWeekly?: unknown;
  ecoCoinsBreakdown?: unknown;
  ordersTopCustomers?: unknown;
  streakDistribution?: unknown;
  ordersVsTicketWeekly?: unknown;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private api: ApiService) {}

  getDashboard(from?: string, to?: string) {
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    const query = q.toString();
    return firstValueFrom(
      this.api.get<AnalyticsDashboardResponse>(`/analytics/dashboard${query ? `?${query}` : ''}`)
    );
  }
}
