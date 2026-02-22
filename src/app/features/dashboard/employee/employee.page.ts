import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonCard, IonCardContent, IonChip, IonList, IonItem, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { OrdersModalAdminComponent } from '../../admin/orders-modal-admin/orders-modal-admin.component';
import { logOutOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonCard, IonCardContent, IonChip, IonList, IonItem, IonLabel, IonIcon,
    OrdersModalAdminComponent
  ],
})
export class EmployeePage {
  ordersModalOpen = true;
  iconLogout = logOutOutline;

  constructor(private router: Router) {}

  openOrders() {
    this.ordersModalOpen = true;
  }

  closeOrders() {
    this.ordersModalOpen = false;
  }

  logout() {
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
