import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonTextarea, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { ProductDto, ProductsService } from 'src/app/core/services/products';

@Component({
  standalone: true,
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonTextarea
  ],
})
export class EditProductModalComponent {
  @Input() open = false;
  @Input() product: ProductDto | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    save: saveOutline,
  };

  saving = false;
  errorMessage = '';

  form = {
    name: '',
    basePrice: 0,
    stock: 0,
    description: '',
  };

  constructor(
    private productsSvc: ProductsService,
    private toast: ToastController
  ) {}

  init() {
    this.errorMessage = '';
    this.saving = false;
    this.form = {
      name: this.product?.name ?? '',
      basePrice: this.product?.basePrice ?? 0,
      stock: this.product?.stock ?? 0,
      description: this.product?.description ?? '',
    };
  }

  close() {
    this.closed.emit();
  }

  async save() {
    if (!this.product?._id || this.saving) return;
    this.saving = true;
    this.errorMessage = '';
    try {
      await this.productsSvc.updateProduct(this.product._id, {
        name: this.form.name.trim(),
        basePrice: Number(this.form.basePrice),
        stock: Number(this.form.stock),
        description: this.form.description.trim(),
      });
      await this.presentToast('Producto actualizado correctamente', 'success');
      this.updated.emit();
      this.close();
    } catch (e) {
      console.error('Update product error', e);
      this.errorMessage = 'No fue posible actualizar el producto.';
    } finally {
      this.saving = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
