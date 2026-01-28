import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonIcon, IonChip, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonIcon, IonChip, IonButtons, IonButton
  ],
})
export class AdminPage {
  // por ahora son “opciones”; luego conectamos endpoints reales
  sections = [
    { key: 'products', title: 'Productos', desc: 'Crear, editar, stock, categorías', icon: 'basket-outline', badge: 'Config' },
    { key: 'employees', title: 'Empleados', desc: 'Usuarios, roles, permisos', icon: 'people-outline', badge: 'Roles' },
    { key: 'promos', title: 'Promociones', desc: 'Cupones, campañas, combos', icon: 'pricetags-outline', badge: 'Marketing' },
  ];

  constructor(private router: Router) {}

  open(key: string) {
    // después: navegar a sub-módulos (admin/products, admin/employees...)
    console.log('Abrir sección:', key);
  }

  logout() {
    // luego conectamos AuthService.logout()
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
