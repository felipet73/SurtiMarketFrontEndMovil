import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonBadge,
  IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, cartOutline, checkmarkOutline, addOutline, removeOutline, trashOutline } from 'ionicons/icons';

import { CartService, CartItem } from 'src/app/core/services/cart';
import { OrdersService } from 'src/app/core/services/orders';
import { WalletService } from 'src/app/core/services/wallet';

@Component({
  standalone: true,
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonBadge,
    IonSpinner
  ],
})
export class CartModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() purchased = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    cart: cartOutline,
    ok: checkmarkOutline,
    add: addOutline,
    remove: removeOutline,
    trash: trashOutline,
  };

  loading = false;
  submitting = false;
  errorMessage = '';

  items: CartItem[] = [];
  ecoCoinsBalance = 0;

  readonly taxRate = 0.12;
  readonly ecoCoinDiscountFactor = 0.025;

  constructor(
    private cart: CartService,
    private orders: OrdersService,
    private wallet: WalletService,
    private toast: ToastController
  ) {}

  async init() {
    this.loading = true;
    this.errorMessage = '';
    this.refreshItems();
    try {
      const w = await this.wallet.getMe();
      this.ecoCoinsBalance = w.ecoCoinsBalance ?? 0;
    } catch {
      this.ecoCoinsBalance = 0;
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.closed.emit();
  }

  refreshItems() {
    this.items = [...this.cart.getItems()];
  }

  priceOf(item: CartItem) {
    const p = item.product;
    if (p.promo?.active) return p.promo.promoPrice;
    return p.basePrice;
  }

  get subtotal() {
    return this.items.reduce((sum, i) => sum + this.priceOf(i) * i.qty, 0);
  }

  get tax() {
    return this.subtotal * this.taxRate;
  }

  get ecoDiscount() {
    const discount = this.ecoCoinsBalance * this.ecoCoinDiscountFactor;
    const max = this.subtotal + this.tax;
    return Math.min(discount, max);
  }

  get total() {
    return this.subtotal + this.tax - this.ecoDiscount;
  }

  inc(item: CartItem) {
    this.cart.add(item.product, 1);
    this.refreshItems();
  }

  dec(item: CartItem) {
    this.cart.remove(item.product._id, 1);
    this.refreshItems();
  }

  removeAll(item: CartItem) {
    this.cart.remove(item.product._id, item.qty);
    this.refreshItems();
  }

  async confirm() {
    if (!this.items.length || this.submitting) return;
    this.submitting = true;
    this.errorMessage = '';
    try {
      const payload = {
        items: this.items.map(i => ({ productId: i.product._id, qty: i.qty })),
      };
      await this.orders.createOrder(payload);
      this.cart.clear();
      this.purchased.emit();
      await this.presentToast('Tu pedido ha sido generado.', 'success');
      this.close();
    } catch (e) {
      console.error('Order error', e);
      this.errorMessage = 'No fue posible generar el pedido.';
    } finally {
      this.submitting = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
