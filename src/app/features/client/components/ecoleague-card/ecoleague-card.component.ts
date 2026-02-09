import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonButton, IonIcon, IonSpinner, IonChip
} from '@ionic/angular/standalone';
import { chevronForwardOutline, refreshOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

import { EcoImpactLeaderboardDto } from 'src/app/core/dto/ecoimpact.dto';

@Component({
  standalone: true,
  selector: 'app-ecoleague-card',
  templateUrl: './ecoleague-card.component.html',
  styleUrls: ['./ecoleague-card.component.scss'],
  imports: [CommonModule, IonCard, IonCardContent, IonButton, IonIcon, IonSpinner, IonChip],
})
export class EcoLeagueCardComponent {
  @Input() data: EcoImpactLeaderboardDto | null = null;
  @Input() loading = false;
  @Input() error = '';
  @Input() inGroup = true;
  @Output() retry = new EventEmitter<void>();

  icons = {
    next: chevronForwardOutline,
    retry: refreshOutline,
  };

  constructor(private router: Router) {}

  deltaIcon(delta: number) {
    if (delta > 0) return 'up';
    if (delta < 0) return 'down';
    return 'flat';
  }

  onRetry() {
    this.retry.emit();
  }

  openFullTable() {
    this.router.navigateByUrl('/ecoimpact/leaderboard');
  }
}
