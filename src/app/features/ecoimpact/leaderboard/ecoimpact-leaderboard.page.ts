import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonButton, IonSpinner, IonCard, IonCardContent, IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { arrowDownOutline, arrowUpOutline, removeOutline, refreshOutline, chevronBackOutline } from 'ionicons/icons';
import { Location } from '@angular/common';

import { EcoImpactService } from 'src/app/core/services/ecoimpact.service';
import { EcoImpactLeaderboardLeader } from 'src/app/core/dto/ecoimpact.dto';

@Component({
  standalone: true,
  selector: 'app-ecoimpact-leaderboard',
  templateUrl: './ecoimpact-leaderboard.page.html',
  styleUrls: ['./ecoimpact-leaderboard.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonButton, IonSpinner, IonCard, IonCardContent, IonButtons, IonIcon
  ],
})
export class EcoImpactLeaderboardPage {
  loading = false;
  error = '';
  items: EcoImpactLeaderboardLeader[] = [];
  myGroupId: string | null = null;
  page = 1;
  limit = 20;
  hasMore = true;

  icons = {
    up: arrowUpOutline,
    down: arrowDownOutline,
    flat: removeOutline,
    retry: refreshOutline,
    back: chevronBackOutline,
  };

  constructor(private eco: EcoImpactService, private location: Location) {}

  ngOnInit() {
    this.load(true);
  }

  async load(reset = false) {
    if (this.loading) return;
    if (reset) {
      this.page = 1;
      this.items = [];
      this.hasMore = true;
    }
    this.loading = true;
    this.error = '';
    try {
      const res = await this.eco.getLeaderboard(this.page, this.limit);
      this.myGroupId = res.myGroup?.groupId ?? null;
      const leaders = res.leaders ?? [];
      this.items = [...this.items, ...leaders];
      if (leaders.length < this.limit) {
        this.hasMore = false;
      } else {
        this.page += 1;
      }
    } catch (e) {
      console.error('Leaderboard load error', e);
      this.error = 'No fue posible cargar la tabla.';
    } finally {
      this.loading = false;
    }
  }

  isMyGroup(g: EcoImpactLeaderboardLeader) {
    return !!this.myGroupId && g.groupId === this.myGroupId;
  }

  deltaClass(delta: number) {
    if (delta > 0) return 'up';
    if (delta < 0) return 'down';
    return 'flat';
  }

  goBack() {
    this.location.back();
  }
}
