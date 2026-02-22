import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { closeOutline } from 'ionicons/icons';
import { OrderDto } from 'src/app/core/services/orders';

@Component({
  standalone: true,
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.scss'],
  imports: [
    CommonModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent
  ],
})
export class OrderDetailModalComponent {
  @Input() open = false;
  @Input() order: OrderDto | null = null;
  @Input() customerName = '';
  @Input() productImages: Record<string, string> = {};
  @Output() closed = new EventEmitter<void>();

  iconClose = closeOutline;

  close() {
    this.closed.emit();
  }

  imageFor(productId: string) {
    return this.productImages[productId] || '';
  }
}
