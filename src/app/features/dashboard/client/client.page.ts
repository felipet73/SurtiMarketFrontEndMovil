import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonCard, IonCardContent, IonChip, IonAvatar, IonProgressBar,
  IonList, IonItem, IonLabel, IonBadge, IonText, IonInput
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

type Dimension = 'waste' | 'transport' | 'energy' | 'water' | 'consumption';

import {
  notificationsOutline,
  pricetagsOutline,
  peopleOutline,
  leafOutline,
  createOutline,
  settingsOutline,
  sendOutline,
  trashOutline,
  bicycleOutline,
  flashOutline,
  waterOutline,
  cartOutline,
  chevronBackOutline,
  chevronForwardOutline,
  trophyOutline,
  personAddOutline
} from 'ionicons/icons';


const DIMENSIONS: readonly Dimension[] = ['waste', 'transport', 'energy', 'water', 'consumption'] as const;

@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonCard, IonCardContent, IonChip, IonAvatar, IonProgressBar,
    IonList, IonItem, IonLabel, IonBadge, IonText, IonInput, FormsModule
  ],
})
export class ClientPage {
  // --- Header icon actions (por ahora console, luego rutas/servicios)
  openNotifications() { console.log('Notificaciones'); }
  openPromos() { console.log('Promociones'); }
  findFriends() { console.log('Buscar amigos'); }
  findSustainableProducts() { console.log('Buscar productos sostenibles'); }
  dimensions = DIMENSIONS;
  // --- Tarjeta 1: Perfil
  profile = {
    fullName: 'Felipe Torres',
    avatarUrl: '', // si está vacío, Ionic muestra placeholder
    groupName: 'EcoVecindad Lumora',
    level: 3,
    totalPoints: 320,
    ecoCoins: 48,
  };


  icons = {
    notifications: notificationsOutline,
    promos: pricetagsOutline,
    friends: peopleOutline,
    sustainable: leafOutline,
  };

  editProfile() { console.log('Editar perfil'); }
  configGroup() { console.log('Config grupo'); }

  // --- Tarjeta 2: Perfil sostenible (tu JSON)
  sustainability = {
    overallScore: 6,
    dimensionScores: {
      waste: 7,
      transport: 5,
      energy: 6,
      water: 4,
      consumption: 7
    },
    baseline: {
      overallScore: 6,
      dimensionScores: { waste: 7, transport: 4, energy: 6, water: 4, consumption: 7 },
      submittedAt: '2026-01-26T04:13:39.116Z'
    },
    latest: {
      overallScore: 6,
      dimensionScores: { waste: 7, transport: 5, energy: 6, water: 4, consumption: 7 },
      submittedAt: '2026-01-26T21:01:39.327Z'
    },
    progress: { deltaOverall: 0 }
  };

  // --- Tarjeta 3: EcoVecindad (grupo + miembros)
  community = {
    name: 'EcoVecindad Lumora',
    goal: 'Reducir residuos del barrio',
    members: [
      { name: 'Ana', avatarUrl: '' },
      { name: 'Luis', avatarUrl: '' },
      { name: 'Majo', avatarUrl: '' },
      { name: 'Carlos', avatarUrl: '' },
      { name: 'Sofía', avatarUrl: '' },
    ]
  };

  // --- Tarjeta 4: Mensajes IA (4)
  aiMessages = [
    { title: 'Reduce residuos, mejora el planeta', text: 'Separa y recicla tus desechos para disminuir la basura y cuidar nuestro entorno.', dimension: 'waste', cta: 'Comienza hoy a reciclar en casa' },
    { title: 'Opta por movilidad sostenible', text: 'Camina, usa bici o transporte público para reducir la huella de carbono y mejorar tu salud.', dimension: 'transport', cta: 'Elige un transporte más verde' },
    { title: 'Ahorra energía en casa', text: 'Apaga luces y desconecta aparatos que no uses para reducir el consumo eléctrico.', dimension: 'energy', cta: 'Implementa hábitos de ahorro' },
    { title: 'Cuida el agua cada día', text: 'Cierra la llave mientras cepillas tus dientes y reutiliza agua cuando puedas.', dimension: 'water', cta: 'Practica el ahorro de agua' },
  ] as Array<{ title: string; text: string; dimension: Dimension; cta: string }>;

  activeAiIndex = 0;
  nextAi() { this.activeAiIndex = (this.activeAiIndex + 1) % this.aiMessages.length; }
  prevAi() { this.activeAiIndex = (this.activeAiIndex - 1 + this.aiMessages.length) % this.aiMessages.length; }

  // --- Tarjeta 5/6: Retos
  weeklyGroupChallenge = { title: 'Semana sin plásticos', desc: 'Eviten plásticos de un solo uso en el grupo', progress: 0.45 };
  weeklySoloChallenge = { title: 'Ducha eficiente', desc: 'Reducir 2 minutos por ducha', progress: 0.70 };

  viewChallenges() { console.log('Ver retos'); }

  // --- Tarjeta 7: Promociones
  promos = [
    { title: 'Detergente ecológico -20%', desc: 'Biodegradable y recargable', tag: 'Eco', price: '$6.99' },
    { title: 'Botella reutilizable', desc: 'Acero inoxidable', tag: 'Reusable', price: '$9.90' },
    { title: 'Bolsas compostables', desc: 'Pack x 30', tag: 'Waste', price: '$3.50' },
  ];

  openPromo(p: any) { console.log('Promo:', p); }

  // --- Tarjeta 8: Historiales
  history = [
    { title: 'Cuestionario sostenible', when: 'Hoy', info: 'Actualizaste tu perfil' },
    { title: 'Reto completado', when: 'Ayer', info: '+30 XP, +3 EcoCoins' },
    { title: 'Invitación aceptada', when: 'Hace 3 días', info: 'Nuevo miembro en tu grupo' },
  ];

  // --- Tarjeta 9: Chat
  chat = {
    lastMessages: [
      { from: 'Ana', text: '¿Hacemos el reto de residuos hoy?', time: '19:10' },
      { from: 'Tú', text: 'Sí, yo separo cartón y plástico.', time: '19:12' },
      { from: 'Luis', text: 'Yo llevo bolsas reutilizables mañana.', time: '19:14' },
    ]
  };
  messageDraft = '';

  sendMessage() {
    const text = this.messageDraft.trim();
    if (!text) return;
    this.chat.lastMessages.push({ from: 'Tú', text, time: 'Ahora' });
    this.messageDraft = '';
  }

  // --- Helpers
  scoreToProgress(score1to10: number) {
    const clamped = Math.max(0, Math.min(10, score1to10));
    return clamped / 10;
  }

  dimLabel(d: Dimension) {
    switch (d) {
      case 'waste': return 'Residuos';
      case 'transport': return 'Transporte';
      case 'energy': return 'Energía';
      case 'water': return 'Agua';
      case 'consumption': return 'Consumo';
    }
  }

  dimIcon(d: Dimension) {
    switch (d) {
      case 'waste': return 'trash-outline';
      case 'transport': return 'bicycle-outline';
      case 'energy': return 'flash-outline';
      case 'water': return 'water-outline';
      case 'consumption': return 'cart-outline';
    }
  }

  get aiActive() {
    return this.aiMessages[this.activeAiIndex];
  }
}
