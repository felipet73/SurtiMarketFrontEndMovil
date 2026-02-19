import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonInput, IonSpinner, IonChip, ToastController
} from '@ionic/angular/standalone';
import { closeOutline } from 'ionicons/icons';
import { OrderDto, OrdersService } from 'src/app/core/services/orders';
import { AdminUsersService } from 'src/app/core/services/admin-users';
import { ProductsService } from 'src/app/core/services/products';
import { OrderDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';

type StatusFilter = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

@Component({
  standalone: true,
  selector: 'app-orders-modal-admin',
  templateUrl: './orders-modal-admin.component.html',
  styleUrls: ['./orders-modal-admin.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonInput, IonSpinner, IonChip,
    OrderDetailModalComponent
  ],
})
export class OrdersModalAdminComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  iconClose = closeOutline;

  loading = false;
  actionLoading = false;
  errorMessage = '';
  selectedStatus: StatusFilter = 'PENDING';
  customerFilter = '';
  fromDate = '';
  toDate = '';

  orders: OrderDto[] = [];
  customerNames: Record<string, string> = {};
  productImages: Record<string, string> = {};

  detailOpen = false;
  selectedOrder: OrderDto | null = null;

  constructor(
    private ordersSvc: OrdersService,
    private adminUsersSvc: AdminUsersService,
    private productsSvc: ProductsService,
    private toast: ToastController
  ) {}

  async init() {
    this.selectedStatus = 'PENDING';
    this.customerFilter = '';
    this.fromDate = '';
    this.toDate = '';
    await this.loadOrders();
  }

  close() {
    this.closed.emit();
  }

  async changeStatus(status: StatusFilter) {
    this.selectedStatus = status;
    await this.loadOrders();
  }

  async loadOrders() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        this.ordersSvc.getAll(1, 100, this.selectedStatus),
        this.adminUsersSvc.getUsers(1, 100),
        this.productsSvc.getProducts({ page: 1, limit: 100 }),
      ]);

      this.orders = ordersRes.items ?? [];
      this.customerNames = {};
      for (const u of usersRes.items ?? []) {
        const name = u.displayName || u.username || u.fullName || u.email;
        this.customerNames[u._id] = name;
      }

      this.productImages = {};
      for (const p of productsRes.items ?? []) {
        if (p.images?.length) this.productImages[p._id] = p.images[0];
      }
    } catch (e) {
      console.error('Orders admin load error', e);
      this.orders = [];
      this.errorMessage = 'No fue posible cargar pedidos.';
    } finally {
      this.loading = false;
    }
  }

  get filteredOrders() {
    const q = this.customerFilter.trim().toLowerCase();
    const fromMs = this.fromDate ? new Date(`${this.fromDate}T00:00:00`).getTime() : null;
    const toMs = this.toDate ? new Date(`${this.toDate}T23:59:59`).getTime() : null;

    return this.orders.filter(o => {
      if (q) {
        const customer = this.customerName(o).toLowerCase();
        if (!customer.includes(q) && !o.userId.toLowerCase().includes(q)) return false;
      }
      const created = new Date(o.createdAt).getTime();
      if (fromMs !== null && created < fromMs) return false;
      if (toMs !== null && created > toMs) return false;
      return true;
    });
  }

  customerName(order: OrderDto) {
    return this.customerNames[order.userId] || order.userId;
  }

  statusLabel(status: string) {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'CONFIRMED': return 'Confirmado';
      case 'DELIVERED': return 'Enviado';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  }

  openDetail(order: OrderDto) {
    this.selectedOrder = order;
    this.detailOpen = true;
  }

  closeDetail() {
    this.detailOpen = false;
    this.selectedOrder = null;
  }

  async confirm(order: OrderDto) {
    await this.runAction(async () => {
      await this.ordersSvc.confirm(order._id);
      await this.presentToast('Pedido confirmado', 'success');
    });
  }

  async cancel(order: OrderDto) {
    await this.runAction(async () => {
      await this.ordersSvc.cancel(order._id);
      await this.presentToast('Pedido cancelado', 'warning');
    });
  }

  async deliver(order: OrderDto) {
    await this.runAction(async () => {
      await this.ordersSvc.deliver(order._id);
      await this.presentToast('Pedido enviado', 'success');
    });
  }

  private async runAction(fn: () => Promise<void>) {
    if (this.actionLoading) return;
    this.actionLoading = true;
    try {
      await fn();
      await this.loadOrders();
    } catch (e) {
      console.error('Order action error', e);
      await this.presentToast('No fue posible actualizar el pedido', 'danger');
    } finally {
      this.actionLoading = false;
    }
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1800, color });
    await t.present();
  }
}
