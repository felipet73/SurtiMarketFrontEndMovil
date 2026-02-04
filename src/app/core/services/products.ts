import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface ProductPromoDto {
  active: boolean;
  promoPrice: number;
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

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private api: ApiService) {}

  getProducts(): Promise<ProductsResponseDto> {
    return firstValueFrom(this.api.get<ProductsResponseDto>('/products'));
  }
}
