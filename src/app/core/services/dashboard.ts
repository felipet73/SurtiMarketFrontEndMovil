import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AwarenessResponse {
  dateKey: string;
  weekKey: string;
  image: { mimeType: string; base64: string };
  messages: { title?: string; text: string }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAwareness(): Observable<{ imageSrc: string; messages: any[]; weekKey: string; dateKey: string }> {
    return this.http.get<AwarenessResponse>(`${this.baseUrl}/dashboard/awareness`).pipe(
      map((res) => ({
        dateKey: res.dateKey,
        weekKey: res.weekKey,
        messages: res.messages,
        imageSrc: `data:${res.image.mimeType};base64,${res.image.base64}`, // aœ… CLAVE
      })),
    );
  }
}
