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
import { PromosModalComponent } from '../../products/promos-modal/promos-modal.component';
import { NotificationsModalComponent } from '../../notifications/notifications-modal/notifications-modal.component';
import { GroupInviteModalComponent } from '../../groups/group-invite-modal/group-invite-modal.component';
import { GroupSearchModalComponent } from '../../groups/group-search-modal/group-search-modal.component';
import { GroupCreateModalComponent } from '../../groups/group-create-modal/group-create-modal.component';
import { EcoImpactCardComponent } from '../../client/components/ecoimpact-card/ecoimpact-card.component';
import { EcoLeagueCardComponent } from '../../client/components/ecoleague-card/ecoleague-card.component';
import { EcoProgressCardComponent } from '../../client/components/ecoprogress-card/ecoprogress-card.component';

import { DashboardService } from '../../../core/services/dashboard';

import { StreakService, StreakDto, WeekDayItem } from '../../../core/services/streak';

type Dimension = 'waste' | 'transport' | 'energy' | 'water' | 'consumption';

import { GroupsService } from '../../../core/services/group';
import { GroupMeDto, GroupJoinRequestDto, MyGroupJoinRequestDto } from '../../../core/dto/group-me.dto';

import { FriendsService } from '../../../core/services/friends';
import { FriendsMeDto, FriendUserDto } from '../../../core/dto/friends-me.dto';
import { WalletService, WalletMeDto } from '../../../core/services/wallet';
import { ProductsService, ProductDto } from 'src/app/core/services/products';
import { NotificationsService } from 'src/app/core/services/notifications';
import { EcoImpactService } from 'src/app/core/services/ecoimpact.service';
import { EcoImpactLeaderboardDto, EcoImpactMeDto, EcoImpactProgressDto } from 'src/app/core/dto/ecoimpact.dto';
import { OrdersService, OrderDto } from 'src/app/core/services/orders';

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
    PromosModalComponent,
    NotificationsModalComponent,
    GroupInviteModalComponent,
    GroupSearchModalComponent,
    GroupCreateModalComponent,
    EcoImpactCardComponent,
    EcoLeagueCardComponent,
    EcoProgressCardComponent,
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
  promosOpen = false;
  promoItems: ProductDto[] = [];
  notificationsOpen = false;
  notificationsUnread = 0;
  ordersLoading = true;
  orders: OrderDto[] = [];
  ordersPage = 0;
  groupInviteOpen = false;
  groupSearchOpen = false;
  groupCreateOpen = false;
  ecoImpact?: EcoImpactMeDto | null;
  ecoImpactLoading = false;
  ecoImpactError = '';
  ecoLeague?: EcoImpactLeaderboardDto | null;
  ecoLeagueLoading = false;
  ecoLeagueError = '';
  ecoProgress?: EcoImpactProgressDto | null;
  ecoProgressLoading = false;
  ecoProgressError = '';
  profile = {
    fullName: 'Felipe Torres',
    avatarUrl: 'https://static.vecteezy.com/system/resources/previews/036/475/917/non_2x/agent-or-spy-icon-incognito-logo-vector.jpg', // si está vacío, Ionic muestra placeholder
    groupName: 'EcoVecindad Lumora',
    level: 3,
    totalPoints: 320,
    ecoCoins: 48,
  };

  openPuzzle() { this.puzzleOpen = true; }
  closePuzzle() {
    this.puzzleOpen = false;
    this.loadEcoLeague();
  }
  openWeeklyQuiz() { this.quizOpen = true; }
  closeWeeklyQuiz() {
    this.quizOpen = false;
    this.loadEcoLeague();
  }

  streak?: StreakDto;
  streakLoading = true;

  groupMe?: GroupMeDto;
  groupLoading = true;
  groupMemberIds: string[] = [];
  joinRequests: GroupJoinRequestDto[] = [];
  joinRequestsLoading = false;
  myJoinRequests: MyGroupJoinRequestDto[] = [];

  friendsMe?: FriendsMeDto;
  friendsLoading = true;

  wallet?: WalletMeDto;
  walletLoading = true;
  ecoMovementsPage = 0;
  
  constructor(private sus: SustainabilityService, private dashboard: DashboardService, private router: Router, 
    private streakSvc: StreakService, private auth: AuthService, private groups: GroupsService, private friendsSvc: FriendsService,
    private walletSvc: WalletService, private cartSvc: CartService, private productsSvc: ProductsService,
    private notificationsSvc: NotificationsService, private ecoimpactSvc: EcoImpactService,
    private ordersSvc: OrdersService) { }
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
    this.loadPromos();
    this.loadNotificationsCount();
    this.loadOrders();
    await Promise.all([
      this.loadEcoImpact(),
      this.loadEcoLeague(),
      this.loadEcoProgress(),
    ]);

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
      this.groupMemberIds = this.groupMe?.members
        ?.map(m => m.user?.id)
        .filter((id): id is string => !!id) ?? [];
      const groupId = this.groupMe?.group?.id;
      if (groupId && this.groupMe?.membership?.role === 'OWNER') {
        await this.loadJoinRequests(groupId);
      } else {
        this.joinRequests = [];
      }
      if (!this.groupMe?.inGroup) {
        await this.loadMyJoinRequests();
      } else {
        this.myJoinRequests = [];
      }
    } finally {
      this.groupLoading = false;
    }
  }

  async loadJoinRequests(groupId: string) {
    this.joinRequestsLoading = true;
    try {
      this.joinRequests = await this.groups.getJoinRequests(groupId);
    } catch (e) {
      console.error('Join requests load error', e);
      this.joinRequests = [];
    } finally {
      this.joinRequestsLoading = false;
    }
  }

  async acceptJoinRequest(userId?: string | null) {
    const groupId = this.groupMe?.group?.id;
    if (!groupId || !userId) return;
    try {
      await this.groups.acceptJoinRequest(groupId, userId);
      await this.loadGroup();
    } catch (e) {
      console.error('Accept join request error', e);
    }
  }

  async loadMyJoinRequests() {
    try {
      this.myJoinRequests = await this.groups.getMyJoinRequests();
    } catch (e) {
      console.error('My join requests load error', e);
      this.myJoinRequests = [];
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
      this.ecoMovementsPage = 0;
    } finally {
      this.walletLoading = false;
    }
  }

  get ecoMovements() {
    return this.wallet?.lastMovements ?? [];
  }

  get ecoMovementsTotalPages() {
    return Math.max(1, Math.ceil(this.ecoMovements.length / 5));
  }

  get ecoMovementsSlice() {
    const start = this.ecoMovementsPage * 5;
    return this.ecoMovements.slice(start, start + 5);
  }

  prevEcoMovements() {
    if (this.ecoMovementsPage > 0) this.ecoMovementsPage--;
  }

  nextEcoMovements() {
    if (this.ecoMovementsPage < this.ecoMovementsTotalPages - 1) this.ecoMovementsPage++;
  }

  async loadEcoImpact() {
    this.ecoImpactLoading = true;
    this.ecoImpactError = '';
    try {
      this.ecoImpact = await this.ecoimpactSvc.getMe();
    } catch (e) {
      console.error('EcoImpact load error', e);
      this.ecoImpact = null;
      this.ecoImpactError = 'No fue posible cargar EcoImpact.';
    } finally {
      this.ecoImpactLoading = false;
    }
  }

  async loadEcoLeague() {
    this.ecoLeagueLoading = true;
    this.ecoLeagueError = '';
    try {
      this.ecoLeague = await this.ecoimpactSvc.getLeaderboard(1, 5);
    } catch (e) {
      console.error('EcoLeague load error', e);
      this.ecoLeague = null;
      this.ecoLeagueError = 'No fue posible cargar la EcoLiga.';
    } finally {
      this.ecoLeagueLoading = false;
    }
  }

  async loadEcoProgress() {
    this.ecoProgressLoading = true;
    this.ecoProgressError = '';
    try {
      this.ecoProgress = await this.ecoimpactSvc.getProgress();
    } catch (e) {
      console.error('EcoProgress load error', e);
      this.ecoProgress = null;
      this.ecoProgressError = 'No fue posible cargar el avance.';
    } finally {
      this.ecoProgressLoading = false;
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
  openNotifications() { this.notificationsOpen = true; }
  closeNotifications() {
    this.notificationsOpen = false;
    this.loadNotificationsCount();
    this.loadFriends();
    this.loadGroup();
  }
  openPromos() { this.promosOpen = true; }
  closePromos() { this.promosOpen = false; }
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

  async loadPromos() {
    try {
      const res = await this.productsSvc.getProducts();
      this.promoItems = (res.items ?? []).filter(p => p.promo?.active).slice(0, 3);
    } catch (e) {
      console.error('Promos load error', e);
      this.promoItems = [];
    }
  }

  addPromoToCart(p: ProductDto) {
    this.cartSvc.add(p, 1);
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
  updateNotificationsUnread(count: number) { this.notificationsUnread = count; }
  openGroupInvite() { this.groupInviteOpen = true; }
  closeGroupInvite() {
    this.groupInviteOpen = false;
    this.loadGroup();
  }
  openGroupSearch() { this.groupSearchOpen = true; }
  closeGroupSearch() {
    this.groupSearchOpen = false;
    this.loadGroup();
  }
  openGroupCreate() { this.groupCreateOpen = true; }
  closeGroupCreate() {
    this.groupCreateOpen = false;
    this.loadGroup();
  }

  async loadNotificationsCount() {
    try {
      const res = await this.notificationsSvc.getAll();
      this.notificationsUnread = res.filter(n => n.status === 'UNREAD').length;
    } catch (e) {
      console.error('Notifications count error', e);
      this.notificationsUnread = 0;
    }
  }

  async loadOrders() {
    this.ordersLoading = true;
    try {
      const res = await this.ordersSvc.getMy(1, 20);
      this.orders = res.items ?? [];
      this.ordersPage = 0;
    } catch (e) {
      console.error('Orders load error', e);
      this.orders = [];
    } finally {
      this.ordersLoading = false;
    }
  }

  get ordersTotalPages() {
    return Math.max(1, Math.ceil(this.orders.length / 3));
  }

  get ordersSlice() {
    const start = this.ordersPage * 3;
    return this.orders.slice(start, start + 3);
  }

  prevOrders() {
    if (this.ordersPage > 0) this.ordersPage--;
  }

  nextOrders() {
    if (this.ordersPage < this.ordersTotalPages - 1) this.ordersPage++;
  }

  orderStatusLabel(status: string) {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'PAID': return 'Pagado';
      case 'CANCELLED': return 'Cancelado';
      case 'FULFILLED': return 'Completado';
      default: return status;
    }
  }




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
