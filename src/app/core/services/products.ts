import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface ProductPromoDto {
  active: boolean;
  promoPrice: number;
  startsAt?: string;
  endsAt?: string;
}

export interface ProductRewardDto {
  active: boolean;
  costEcoCoins: number;
}

export interface ProductDto {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  stock: number;
  sku: string;
  basePrice: number;
  promo?: ProductPromoDto;
  ecoScore: number;
  co2Kg: number;
  badges: string[];
  ecoCoinsEnabled: boolean;
  maxEcoCoinsDiscountPercent: number;
  reward?: ProductRewardDto;
  createdAt: string;
  updatedAt: string;
  __v: number;
  effectivePrice?: number;
}

export interface ProductsResponseDto {
  page: number;
  limit: number;
  total: number;
  items: ProductDto[];
}

export interface UpdateProductPayload {
  name: string;
  basePrice: number;
  stock: number;
  description: string;
}

export interface ProductPromoDiscountPayload {
  discountPercent: number;
  startsAt: string;
  endsAt: string;
}

export interface CreateProductPayload {
  name: string;
  brand: string;
  category: string;
  description: string;
  sku: string;
  basePrice: number;
  stock: number;
  ecoScore: number;
  badges: string[];
  ecoCoinsEnabled: boolean;
  maxEcoCoinsDiscountPercent: number;
  promo: {
    active: boolean;
    promoPrice: number;
  };
  reward: {
    active: boolean;
    costEcoCoins: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private api: ApiService) {}

  getProducts(params?: { type?: 'promo'; activeOnly?: boolean; page?: number; limit?: number }): Promise<ProductsResponseDto> {
    const q = new URLSearchParams();
    if (params?.type) q.set('type', params.type);
    if (typeof params?.activeOnly === 'boolean') q.set('activeOnly', String(params.activeOnly));
    if (typeof params?.page === 'number') q.set('page', String(params.page));
    if (typeof params?.limit === 'number') q.set('limit', String(params.limit));
    const query = q.toString();
    const url = query ? `/products?${query}` : '/products';
    return firstValueFrom(this.api.get<ProductsResponseDto>(url));
  }

  updateProduct(productId: string, payload: UpdateProductPayload) {
    return firstValueFrom(this.api.patch<ProductDto>(`/products/${productId}`, payload));
  }

  deactivateProduct(productId: string) {
    return firstValueFrom(this.api.delete<ProductDto>(`/products/${productId}`));
  }

  applyPromoDiscount(productId: string, payload: ProductPromoDiscountPayload) {
    return firstValueFrom(this.api.patch<ProductDto>(`/products/${productId}/promo/discount`, payload));
  }

  stopPromo(productId: string) {
    return firstValueFrom(this.api.patch<ProductDto>(`/products/${productId}/promo/stop`, {}));
  }

  createProduct(payload: CreateProductPayload) {
    return firstValueFrom(this.api.post<ProductDto>('/products', payload));
  }

  activateProduct(productId: string) {
    return firstValueFrom(this.api.patch<ProductDto>(`/products/${productId}/activate`, {}));
  }
}
