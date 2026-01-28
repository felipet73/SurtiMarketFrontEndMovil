import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonButton, IonIcon, IonProgressBar, IonChip
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonButton, IonIcon, IonProgressBar, IonChip
  ],
})
export class ClientPage {
  // mock por ahora (luego lo conectamos a /dashboard/progress/weekly etc.)
  xp = 320;
  level = 3;
  streak = 5; // días seguidos
  weeklyProgress = 0.62;

  invite() { console.log('Invitar amigos'); }
  createGroup() { console.log('Crear grupo'); }
  viewChallenges() { console.log('Ver retos'); }
}