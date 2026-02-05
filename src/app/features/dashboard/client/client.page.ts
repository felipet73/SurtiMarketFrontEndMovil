import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonModal,
  IonCard, IonCardContent, IonChip, IonAvatar, IonProgressBar,
  IonList, IonItem, IonLabel, IonBadge, IonText, IonInput, IonSkeletonText, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

import { PuzzleModalPage } from '../../../pages/puzzle-modal/puzzle-modal.page';
import { WeeklyQuizModalComponent } from '../../challenges/weekly-quiz-modal/weekly-quiz-modal.component';
import { EditProfileModalComponent } from '../../profile/edit-profile-modal/edit-profile-modal.component';
import { PrivacyConsentModalComponent } from '../../privacy/privacy-consent-modal/privacy-consent-modal.component';
import { ProductsModalComponent } from '../../products/products-modal/products-modal.component';
import { CartModalComponent } from '../../cart/cart-modal/cart-modal.component';
import { FriendSearchModalComponent } from '../../friends/friend-search-modal/friend-search-modal.component';

import { DashboardService } from '../../../core/services/dashboard';

import { StreakService, StreakDto, WeekDayItem } from '../../../core/services/streak';

type Dimension = 'waste' | 'transport' | 'energy' | 'water' | 'consumption';

import { GroupsService } from '../../../core/services/group';
import { GroupMeDto } from '../../../core/dto/group-me.dto';

import { FriendsService } from '../../../core/services/friends';
import { FriendsMeDto, FriendUserDto } from '../../../core/dto/friends-me.dto';
import { WalletService, WalletMeDto } from '../../../core/services/wallet';

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
  personAddOutline,
  pulseOutline,
  closeOutline,
  logOutOutline,
} from 'ionicons/icons';
import { SustainabilityService } from 'src/app/core/services/sustainability';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth';
import { CartService } from 'src/app/core/services/cart';


const DIMENSIONS: readonly Dimension[] = ['waste', 'transport', 'energy', 'water', 'consumption'] as const;

@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
  imports: [IonCardSubtitle, IonCardTitle, IonCardHeader, IonSkeletonText, 
    CommonModule, IonModal, PuzzleModalPage, WeeklyQuizModalComponent,
    EditProfileModalComponent,
    PrivacyConsentModalComponent,
    ProductsModalComponent,
    CartModalComponent,
    FriendSearchModalComponent,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonCard, IonCardContent, IonChip, IonAvatar, IonProgressBar,
    IonList, IonItem, IonLabel, IonBadge, IonInput, FormsModule
  ],
})
export class ClientPage {
  vm: { imageSrc: string; messages: any[]; weekKey: string; dateKey: string } | null = null;
  loading = true;
  puzzleOpen = false;
  quizOpen = false;
  editProfileOpen = false;
  privacyOpen = false;
  productsOpen = false;
  cartOpen = false;
  friendSearchOpen = false;
  profile = {
    fullName: 'Felipe Torres',
    avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg', // si está vacío, Ionic muestra placeholder
    groupName: 'EcoVecindad Lumora',
    level: 3,
    totalPoints: 320,
    ecoCoins: 48,
  };

  openPuzzle() { this.puzzleOpen = true; }
  closePuzzle() { this.puzzleOpen = false; }
  openWeeklyQuiz() { this.quizOpen = true; }
  closeWeeklyQuiz() { this.quizOpen = false; }

  streak?: StreakDto;
  streakLoading = true;

  groupMe?: GroupMeDto;
  groupLoading = true;

  friendsMe?: FriendsMeDto;
  friendsLoading = true;

  wallet?: WalletMeDto;
  walletLoading = true;
  
  constructor(private sus: SustainabilityService, private dashboard: DashboardService, private router: Router, 
    private streakSvc: StreakService, private auth: AuthService, private groups: GroupsService, private friendsSvc: FriendsService,
    private walletSvc: WalletService, private cartSvc: CartService) { }
  sustainability: any = {
              overallScore: 0,
              dimensionScores: {
                waste: 0,
                transport: 0,
                energy: 0,
                water: 0,
                consumption: 0
              },
              baseline: {
                overallScore: 0,
                dimensionScores: { waste: 0, transport: 0, energy: 0, water: 0, consumption: 0 },
                submittedAt: '2026-01-26T04:13:39.116Z'
              },
              latest: {
                overallScore: 0,
                dimensionScores: { waste: 0, transport: 0, energy: 0, water: 0, consumption: 0 },
                submittedAt: '2026-01-26T21:01:39.327Z'
              },
              progress: { deltaOverall: 0 }
            };
  async ngOnInit() {
    try {
      const me = await this.sus.getMeOrNull();
      if (me) {
        console.log(me,'Perfil sostenible actual');
        this.sustainability = me;
      } else {
        this.router.navigateByUrl('/sustainability/questionnaire', { replaceUrl: true });
      }
    } finally {}
    this.loading = true;
    this.dashboard.getAwareness().subscribe({
      next: (data) => {
        this.vm = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
    await this.loadStreak();

    await this.loadProfile();

    this.loadGroup();
    this.loadFriends();
    this.loadWallet();

  }

  
  async loadFriends() {
    this.friendsLoading = true;
    try {
      this.friendsMe = await this.friendsSvc.getMe();
    } finally {
      this.friendsLoading = false;
    }
  }

  // Helpers para UI
  initials(name?: string | null) {
    const n = (name ?? '').trim();
    if (!n) return '?';
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase()).join('');
  }

  trackByUserId(_: number, u: FriendUserDto | null) {
    return u?.id ?? _;
  }
  
  async loadGroup() {
    this.groupLoading = true;
    try {
      this.groupMe = await this.groups.getMe();
    } finally {
      this.groupLoading = false;
    }
  }

  async loadStreak() {
    this.streakLoading = true;
    try {
      this.streak = await this.streakSvc.markToday();
    } finally {
      this.streakLoading = false;
    }
  }

  async loadProfile() {
    let user = await this.auth.me();
    console.log('Usuario actual:', user);
    this.profile.fullName = user.fullName || user?.username || user.displayName || '';
    this.profile.avatarUrl = user.avatarUrl || this.profile.avatarUrl; // default avatar
  }

  async loadWallet() {
    this.walletLoading = true;
    try {
      this.wallet = await this.walletSvc.getMe();
    } finally {
      this.walletLoading = false;
    }
  }

  // helpers UI
  statusClass(d: WeekDayItem) {
    return {
      logged: d.status === 'logged',
      missed: d.status === 'missed',
      future: d.status === 'future',
      pulse: this.streak?.today === d.date && d.status === 'logged',
    };
  }

  // --- Header icon actions (por ahora console, luego rutas/servicios)
  openNotifications() { console.log('Notificaciones'); }
  openPromos() { console.log('Promociones'); }
  findFriends() { this.friendSearchOpen = true; }
  closeFriendSearch() {
    this.friendSearchOpen = false;
    this.loadFriends();
  }

  friendIds() {
    return this.friendsMe?.friends
      ?.map(f => f.user?.id)
      .filter((id): id is string => !!id) ?? [];
  }
  findSustainableProducts() { this.productsOpen = true; }
  closeProducts() { this.productsOpen = false; }
  openCart() { this.cartOpen = true; }
  closeCart() { this.cartOpen = false; }
  cartCount() { return this.cartSvc.getCount(); }
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  dimensions = DIMENSIONS;
  
  

  


  icons = {
    notifications: notificationsOutline,
    promos: pricetagsOutline,
    friends: peopleOutline,
    sustainable: leafOutline,
    cart: cartOutline,
    logout: logOutOutline,
  };

  editProfile() { this.editProfileOpen = true; }
  closeEditProfile() {
    this.editProfileOpen = false;
    this.loadProfile();
  }
  configGroup() { this.privacyOpen = true; }
  closePrivacy() { this.privacyOpen = false; }




  // --- Tarjeta 3: EcoVecindad (grupo + miembros)
  community = {
    name: 'EcoVecindad Lumora',
    goal: 'Reducir residuos del barrio',
    members: [
      { name: 'Ana', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg' },
      { name: 'Luis', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg' },
      { name: 'Majo', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg' },
      { name: 'Carlos', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg' },
      { name: 'Sofía', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg' },
      { name: 'Ana', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg' },
      { name: 'Luis', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg' },
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

  retosIndividuales = [
    { title: 'Puzzle- Arma la Imagen de la semana', desc: 'Juega y ordena las piezas de la imagen de la semana', tag: 'Eco', price: 'Entrar' },
    { title: 'Quizz Semanal', desc: 'Responde tu quiz de la semana y gana EcoCoins', tag: 'Reusable', price: 'Entrar' },
  ];
  openReto(p: any) { 
    console.log('Reto:', p); 
    if (p.title == 'Puzzle- Arma la Imagen de la semana'){
      this.openPuzzle();
    }
    if (p.title == 'Quizz Semanal'){
      this.openWeeklyQuiz();
    }

  }

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
