import { Injectable } from '@angular/core';
import { ProductDto } from './products';

export interface CartItem {
  product: ProductDto;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private userKey = 'sm_user';
  private currentUserId: string | null = null;
  private items: CartItem[] = [];

  constructor() {
    this.ensureUser();
  }

  getItems() {
    this.ensureUser();
    return this.items;
  }

  clear() {
    this.ensureUser();
    this.items = [];
    this.save();
  }

  add(product: ProductDto, qty: number) {
    this.ensureUser();
    if (qty <= 0) return;
    const existing = this.items.find(i => i.product._id === product._id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ product, qty });
    }
    this.save();
  }

  remove(productId: string, qty: number) {
    this.ensureUser();
    const idx = this.items.findIndex(i => i.product._id === productId);
    if (idx === -1) return;
    this.items[idx].qty -= qty;
    if (this.items[idx].qty <= 0) this.items.splice(idx, 1);
    this.save();
  }

  getCount() {
    this.ensureUser();
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  }

  private ensureUser() {
    const userId = this.getUserIdFromStorage();
    if (userId !== this.currentUserId) {
      this.currentUserId = userId;
      this.items = this.load();
    }
  }

  private getUserIdFromStorage() {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { id?: string };
      return parsed?.id ?? null;
    } catch {
      return null;
    }
  }

  private storageKey() {
    return `sm_cart_${this.currentUserId ?? 'guest'}`;
  }

  private save() {
    localStorage.setItem(this.storageKey(), JSON.stringify(this.items));
  }

  private load(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey());
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
