import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type Tile = { correctIndex: number; url: string };

export type WeeklyPuzzleMe = {
  weekKey: string;
  assets: { imageUrl: string; grid: number; tiles: Tile[] };
  progress: { positions: number[]; isSolved: boolean; rewardGranted: boolean };
};

export type MoveResponse = {
  ok: boolean;
  positions: number[];
  isSolved: boolean;
  rewardGranted: boolean;
};

export type ClaimResponse = {
  ok: boolean;
  idempotent?: boolean;
  ecoCoinsGranted: number;
  puzzlePointsGranted: number;
};


@Injectable({ providedIn: 'root' })
export class PuzzleService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getWeeklyMe() {
    return this.http.get<WeeklyPuzzleMe>(`${this.baseUrl}/puzzle/weekly/me`);
  }

  updateState(positions: number[]) {
    return this.http.post<{ weekKey: string; positions: number[]; isSolved: boolean; rewardGranted: boolean }>(
      `${this.baseUrl}/puzzle/weekly/me/state`,
      { positions },
    );
  }

  claim() {
    return this.http.post<{ ok: boolean; idempotent?: boolean; ecoCoinsGranted: number; puzzlePointsGranted: number }>(
      `${this.baseUrl}/puzzle/weekly/me/claim`,
      {},
    );
  }

  move(tileIndex: number) {
    return this.http.post<MoveResponse>(`${this.baseUrl}/puzzle/weekly/me/move`, { tileIndex });
  }
}