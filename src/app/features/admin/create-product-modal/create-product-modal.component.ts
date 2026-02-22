import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonTextarea, IonToggle, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { ProductsService } from 'src/app/core/services/products';

@Component({
  standalone: true,
  selector: 'app-create-product-modal',
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonTextarea, IonToggle
  ],
})
export class CreateProductModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    save: saveOutline,
  };

  saving = false;
  errorMessage = '';

  form = {
    name: '',
    brand: '',
    category: '',
    description: '',
    sku: '',
    basePrice: 0,
    stock: 0,
    ecoScore: 0,
    badgesText: '',
    ecoCoinsEnabled: true,
    maxEcoCoinsDiscountPercent: 0.5,
    promoActive: true,
    promoPrice: 0,
    rewardActive: true,
    rewardCostEcoCoins: 0,
  };

  constructor(
    private productsSvc: ProductsService,
    private toast: ToastController
  ) {}

  init() {
    this.saving = false;
    this.errorMessage = '';
    this.form = {
      name: '',
      brand: '',
      category: '',
      description: '',
      sku: '',
      basePrice: 0,
      stock: 0,
      ecoScore: 0,
      badgesText: '',
      ecoCoinsEnabled: true,
      maxEcoCoinsDiscountPercent: 0.5,
      promoActive: true,
      promoPrice: 0,
      rewardActive: true,
      rewardCostEcoCoins: 0,
    };
  }

  close() {
    this.closed.emit();
  }

  async save() {
    if (this.saving) return;
    this.saving = true;
    this.errorMessage = '';
    try {
      const badges = this.form.badgesText
        .split(',')
        .map(b => b.trim())
        .filter(Boolean);

      await this.productsSvc.createProduct({
        name: this.form.name.trim(),
        brand: this.form.brand.trim(),
        category: this.form.category.trim(),
        description: this.form.description.trim(),
        sku: this.form.sku.trim(),
        basePrice: Number(this.form.basePrice),
        stock: Number(this.form.stock),
        ecoScore: Number(this.form.ecoScore),
        badges,
        ecoCoinsEnabled: this.form.ecoCoinsEnabled,
        maxEcoCoinsDiscountPercent: Number(this.form.maxEcoCoinsDiscountPercent),
        promo: {
          active: this.form.promoActive,
          promoPrice: Number(this.form.promoPrice),
        },
        reward: {
          active: this.form.rewardActive,
          costEcoCoins: Number(this.form.rewardCostEcoCoins),
        },
      });

      await this.presentToast('Producto creado correctamente', 'success');
      this.created.emit();
      this.close();
    } catch (e) {
      console.error('Create product error', e);
      this.errorMessage = 'No fue posible crear el producto.';
    } finally {
      this.saving = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
