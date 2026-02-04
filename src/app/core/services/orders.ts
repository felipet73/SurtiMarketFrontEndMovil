import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface OrderItemPayload {
  productId: string;
  qty: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private api: ApiService) {}

  createOrder(payload: CreateOrderPayload) {
    return firstValueFrom(this.api.post('/orders', payload));
  }
}
