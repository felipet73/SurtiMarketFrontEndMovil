import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonTextarea, ToastController
} from '@ionic/angular/standalone';
import { closeOutline, saveOutline, chevronBackOutline, chevronForwardOutline, addOutline } from 'ionicons/icons';
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
    prev: chevronBackOutline,
    next: chevronForwardOutline,
    add: addOutline,
  };

  saving = false;
  errorMessage = '';
  imageIndex = 0;
  newImageFiles: File[] = [];

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
    this.imageIndex = 0;
    this.newImageFiles = [];
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
      if (this.newImageFiles.length) {
        await this.productsSvc.uploadProductImages(this.product._id, this.newImageFiles);
      }
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

  get currentImages() {
    return this.product?.images ?? [];
  }

  get totalImageSlots() {
    return this.currentImages.length + 1;
  }

  isAddSlot() {
    return this.imageIndex >= this.currentImages.length;
  }

  currentImage() {
    if (this.isAddSlot()) return '';
    return this.currentImages[this.imageIndex] ?? '';
  }

  prevImage() {
    if (this.imageIndex > 0) this.imageIndex--;
  }

  nextImage() {
    if (this.imageIndex < this.totalImageSlots - 1) this.imageIndex++;
  }

  triggerAddImages(input: HTMLInputElement) {
    input.click();
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;
    this.newImageFiles = [...this.newImageFiles, ...files];
    input.value = '';
  }
}
