import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export type WalletMovementType = 'EARN' | 'SPEND' | string;

export interface WalletMovementDto {
  _id: string;
  userId: string;
  type: WalletMovementType;
  amount: number;
  source: string;
  refId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WalletMeDto {
  ecoCoinsBalance: number;
  lastMovements: WalletMovementDto[];
}

@Injectable({ providedIn: 'root' })
export class WalletService {
  constructor(private api: ApiService) {}

  getMe(): Promise<WalletMeDto> {
    return firstValueFrom(this.api.get<WalletMeDto>('/wallet/me'));
  }
}
