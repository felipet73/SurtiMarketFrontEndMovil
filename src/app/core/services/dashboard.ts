import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface AwarenessResponse {
  dateKey: string;
  weekKey: string;
  image: { mimeType: string; base64: string };
  messages: { title?: string; text: string }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAwareness(): Observable<{ imageSrc: string; messages: any[]; weekKey: string; dateKey: string }> {
    return this.http.get<AwarenessResponse>(`${this.baseUrl}/dashboard/awareness`).pipe(
      map((res) => ({
        dateKey: res.dateKey,
        weekKey: res.weekKey,
        messages: res.messages,
        imageSrc: `data:${res.image.mimeType};base64,${res.image.base64}`, // ✅ CLAVE
      })),
    );
  }
}