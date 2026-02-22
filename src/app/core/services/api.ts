import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.base}${path}`, body);
  }

  get<T>(path: string) {
    return this.http.get<T>(`${this.base}${path}`);
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<T>(`${this.base}${path}`, body);
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.base}${path}`);
  }
}
