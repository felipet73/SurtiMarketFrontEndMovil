import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonToggle, IonChip, IonSpinner, ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { closeOutline, searchOutline, addOutline, createOutline, pricetagOutline, banOutline } from 'ionicons/icons';
import { ProductDto, ProductsService } from 'src/app/core/services/products';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { CreateProductModalComponent } from '../create-product-modal/create-product-modal.component';

@Component({
  standalone: true,
  selector: 'app-products-modal-admin',
  templateUrl: './products-modal-admin.component.html',
  styleUrls: ['./products-modal-admin.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonToggle, IonChip, IonSpinner,
    EditProductModalComponent,
    CreateProductModalComponent
  ],
})
export class ProductsModalAdminComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  icons = {
    close: closeOutline,
    search: searchOutline,
    add: addOutline,
    edit: createOutline,
    promo: pricetagOutline,
    deactivate: banOutline,
  };

  loading = false;
  errorMessage = '';
  query = '';
  onlyPromo = false;
  showInactive = false;
  products: ProductDto[] = [];
  editOpen = false;
  createOpen = false;
  selectedProduct: ProductDto | null = null;

  constructor(
    private productsSvc: ProductsService,
    private toast: ToastController,
    private alert: AlertController
  ) {}

  async init() {
    this.query = '';
    this.onlyPromo = false;
    this.showInactive = false;
    await this.loadProducts();
  }

  close() {
    this.closed.emit();
  }

  async loadProducts() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const res = await this.productsSvc.getProducts();
      this.products = res.items ?? [];
    } catch (e) {
      console.error('Admin products load error', e);
      this.products = [];
      this.errorMessage = 'No fue posible cargar productos.';
    } finally {
      this.loading = false;
    }
  }

  get filteredProducts() {
    const q = this.query.trim().toLowerCase();
    return this.products.filter(p => {
      if (!this.showInactive && !p.isActive) return false;
      if (this.onlyPromo && !p.promo?.active) return false;
      if (!q) return true;
      const haystack = [p.name, p.brand, p.category, p.description].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }

  displayPrice(p: ProductDto) {
    if (p.promo?.active && p.promo.promoPrice) return p.promo.promoPrice;
    return p.basePrice;
  }

  createProduct() {
    this.createOpen = true;
  }

  editProduct(p: ProductDto) {
    this.selectedProduct = p;
    this.editOpen = true;
  }

  closeEditProduct() {
    this.editOpen = false;
    this.selectedProduct = null;
  }

  async onProductUpdated() {
    this.closeEditProduct();
    await this.loadProducts();
  }

  closeCreateProduct() {
    this.createOpen = false;
  }

  async onProductCreated() {
    this.closeCreateProduct();
    await this.loadProducts();
  }

  async deactivateProduct(p: ProductDto) {
    try {
      if (p.isActive) {
        await this.productsSvc.deactivateProduct(p._id);
        await this.presentToast('Producto desactivado', 'success');
      } else {
        await this.productsSvc.activateProduct(p._id);
        await this.presentToast('Producto activado', 'success');
      }
      await this.loadProducts();
    } catch (e) {
      console.error('Toggle product status error', e);
      await this.presentToast('No fue posible actualizar el estado del producto', 'danger');
    }
  }

  async promoteProduct(p: ProductDto) {
    if (p.promo?.active) {
      try {
        await this.productsSvc.stopPromo(p._id);
        await this.presentToast('Promocion detenida', 'success');
        await this.loadProducts();
      } catch (e) {
        console.error('Stop promo error', e);
        await this.presentToast('No fue posible detener la promocion', 'danger');
      }
      return;
    }

    const alert = await this.alert.create({
      header: 'Aplicar promocion',
      inputs: [
        { name: 'discountPercent', type: 'number', placeholder: 'Porcentaje (ej: 25)' },
        { name: 'startsAt', type: 'datetime-local', placeholder: 'Inicio' },
        { name: 'endsAt', type: 'datetime-local', placeholder: 'Fin' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aplicar',
          handler: async (data) => {
            const discountPercent = Number(data.discountPercent);
            const startsAt = data.startsAt ? new Date(data.startsAt).toISOString() : '';
            const endsAt = data.endsAt ? new Date(data.endsAt).toISOString() : '';
            if (!discountPercent || discountPercent <= 0 || discountPercent > 100 || !startsAt || !endsAt) {
              await this.presentToast('Datos de promocion invalidos', 'warning');
              return false;
            }
            try {
              await this.productsSvc.applyPromoDiscount(p._id, { discountPercent, startsAt, endsAt });
              await this.presentToast('Promocion aplicada', 'success');
              await this.loadProducts();
            } catch (e) {
              console.error('Apply promo error', e);
              await this.presentToast('No fue posible aplicar la promocion', 'danger');
            }
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1600, color });
    await t.present();
  }
}
