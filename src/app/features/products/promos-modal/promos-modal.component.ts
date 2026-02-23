import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
  IonBadge, IonSpinner
} from '@ionic/angular/standalone';
import { closeOutline, addOutline, removeOutline, cartOutline, searchOutline } from 'ionicons/icons';

import { ProductsService, ProductDto } from 'src/app/core/services/products';
import { CartService } from 'src/app/core/services/cart';

@Component({
  standalone: true,
  selector: 'app-promos-modal',
  templateUrl: './promos-modal.component.html',
  styleUrls: ['./promos-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput,
    IonBadge, IonSpinner
  ],
})
export class PromosModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    add: addOutline,
    remove: removeOutline,
    cart: cartOutline,
    search: searchOutline,
  };

  loading = false;
  errorMessage = '';
  items: ProductDto[] = [];
  query = '';
  qtyById: Record<string, number> = {};

  constructor(private products: ProductsService, private cart: CartService) {}

  async init() {
    if (this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      const res = await this.products.getProducts();
      this.items = (res.items ?? []).filter(p => p.promo?.active);
      this.qtyById = {};
      this.items.forEach(p => (this.qtyById[p._id] = 1));
    } catch (e) {
      console.error('Promos load error', e);
      this.errorMessage = 'No fue posible cargar promociones.';
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.closed.emit();
  }

  get filteredItems() {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.items;
    return this.items.filter(p =>
      (p.name ?? '').toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
    );
  }

  qtyOf(p: ProductDto) {
    return this.qtyById[p._id] ?? 1;
  }

  inc(p: ProductDto) {
    const current = this.qtyOf(p);
    this.qtyById[p._id] = current + 1;
  }

  dec(p: ProductDto) {
    const current = this.qtyOf(p);
    this.qtyById[p._id] = Math.max(1, current - 1);
  }

  addToCart(p: ProductDto) {
    const qty = this.qtyOf(p);
    this.cart.add(p, qty);
  }
}
