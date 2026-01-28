import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,
  IonLabel, IonList, IonItem, IonBadge
} from '@ionic/angular/standalone';

type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

@Component({
  standalone: true,
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,
    IonLabel, IonList, IonItem, IonBadge
  ],
})
export class EmployeePage {
  status: OrderStatus = 'PENDING';

  // mock por ahora
  orders = [
    { id: 'ORD-1001', customer: 'Cliente A', total: '$12.50', status: 'PENDING' as OrderStatus },
    { id: 'ORD-1002', customer: 'Cliente B', total: '$9.90', status: 'IN_PROGRESS' as OrderStatus },
    { id: 'ORD-1003', customer: 'Cliente C', total: '$18.00', status: 'DONE' as OrderStatus },
  ];

  get filtered() {
    return this.orders.filter(o => o.status === this.status);
  }

  onStatusChange(ev: any) {
    this.status = ev.detail.value as OrderStatus;
  }
}