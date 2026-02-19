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

export interface OrderItemDto {
  productId: string;
  nameSnapshot: string;
  qty: number;
  unitPriceMoney: number;
  ecoCoinsSpent: number;
  moneyDiscount: number;
  moneyToPay: number;
}

export interface OrderDto {
  _id: string;
  userId: string;
  items: OrderItemDto[];
  totalMoney: number;
  totalEcoCoinsSpent: number;
  totalMoneyDiscount: number;
  totalMoneyToPay: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrdersMyResponse {
  page: number;
  limit: number;
  total: number;
  items: OrderDto[];
}

export interface OrdersAllResponse {
  page: number;
  limit: number;
  total: number;
  items: OrderDto[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private api: ApiService) {}

  createOrder(payload: CreateOrderPayload) {
    return firstValueFrom(this.api.post('/orders', payload));
  }

  getMy(page = 1, limit = 20) {
    return firstValueFrom(this.api.get<OrdersMyResponse>(`/orders/my?page=${page}&limit=${limit}`));
  }

  getAll(page = 1, limit = 100, status?: string) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) q.set('status', status);
    return firstValueFrom(this.api.get<OrdersAllResponse>(`/orders?${q.toString()}`));
  }

  confirm(orderId: string) {
    return firstValueFrom(this.api.patch(`/orders/${orderId}/confirm`, {}));
  }

  cancel(orderId: string) {
    return firstValueFrom(this.api.patch(`/orders/${orderId}/cancel`, {}));
  }

  deliver(orderId: string) {
    return firstValueFrom(this.api.patch(`/orders/${orderId}/deliver`, {}));
  }
}
