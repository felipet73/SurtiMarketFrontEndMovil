import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonIcon, IonChip, IonButtons, IonButton, IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UsersModalComponent } from '../../admin/users-modal/users-modal.component';
import { ProductsModalAdminComponent } from '../../admin/products-modal-admin/products-modal-admin.component';
import { OrdersModalAdminComponent } from '../../admin/orders-modal-admin/orders-modal-admin.component';

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonIcon, IonChip, IonButtons, IonButton, IonCard, IonCardContent,
    UsersModalComponent,
    ProductsModalAdminComponent,
    OrdersModalAdminComponent
  ],
})
export class AdminPage {
  // por ahora son a€œopcionesa€; luego conectamos endpoints reales
  sections = [
    { key: 'products', title: 'Productos', desc: 'Crear, editar, stock, categorías', icon: 'basket-outline', badge: 'Config' },
    { key: 'employees', title: 'Empleados', desc: 'Usuarios, roles, permisos', icon: 'people-outline', badge: 'Roles' },
    { key: 'orders', title: 'Gestionar Pedidos', desc: 'Seguimiento, estados y despacho', icon: 'clipboard-outline', badge: 'Pedidos' },
    { key: 'ai-challenges', title: 'Gestion de Retos IA', desc: 'Configurar retos, reglas y mensajes IA', icon: 'sparkles-outline', badge: 'IA' },
  ];
  usersModalOpen = false;
  productsModalOpen = false;
  ordersModalOpen = false;

  constructor(private router: Router) {}

  open(key: string) {
    if (key === 'employees') {
      this.usersModalOpen = true;
      return;
    }
    if (key === 'products') {
      this.productsModalOpen = true;
      return;
    }
    if (key === 'orders') {
      this.ordersModalOpen = true;
      return;
    }
    console.log('Abrir sección:', key);
  }

  closeUsersModal() {
    this.usersModalOpen = false;
  }

  closeProductsModal() {
    this.productsModalOpen = false;
  }

  closeOrdersModal() {
    this.ordersModalOpen = false;
  }

  logout() {
    // luego conectamos AuthService.logout()
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
