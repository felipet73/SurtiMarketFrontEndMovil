import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonChip, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { chevronBackOutline, chevronForwardOutline, refreshOutline } from 'ionicons/icons';

import { EcoImpactMeDto } from 'src/app/core/dto/ecoimpact.dto';

@Component({
  standalone: true,
  selector: 'app-ecoimpact-card',
  templateUrl: './ecoimpact-card.component.html',
  styleUrls: ['./ecoimpact-card.component.scss'],
  imports: [CommonModule, IonCard, IonCardContent, IonChip, IonButton, IonIcon, IonSpinner, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class EcoImpactCardComponent implements OnChanges {
  @Input() data: EcoImpactMeDto | null = null;
  @Input() loading = false;
  @Input() error = '';
  @Input() inGroup = true;
  @Output() retry = new EventEmitter<void>();

  activeIndex = 0;

  icons = {
    prev: chevronBackOutline,
    next: chevronForwardOutline,
    retry: refreshOutline,
  };

  radarData: ChartConfiguration<'radar'>['data'] = {
    labels: ['Residuos', 'Transporte', 'Energía', 'Agua', 'Consumo'],
    datasets: [],
  };

  radarOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    animation: { duration: 600 },
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { backdropColor: 'transparent', color: 'rgba(255,255,255,0.6)' },
        grid: { color: 'rgba(255,255,255,0.15)' },
        angleLines: { color: 'rgba(255,255,255,0.15)' },
        pointLabels: { color: 'rgba(255,255,255,0.8)' },
      },
    },
    plugins: {
      legend: { labels: { color: 'rgba(255,255,255,0.9)' } },
    },
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.activeIndex = 0;
      this.buildRadar();
    }
  }

  buildRadar() {
    if (!this.data) {
      this.radarData = { labels: this.radarData.labels, datasets: [] };
      return;
    }
    const current = this.data.currentRadar;
    const target = this.data.targetRadar;
    this.radarData = {
      labels: ['Residuos', 'Transporte', 'Energía', 'Agua', 'Consumo'],
      datasets: [
        {
          label: 'Current',
          data: [current.waste, current.transport, current.energy, current.water, current.consumption],
          borderColor: 'rgba(109,255,182,0.9)',
          backgroundColor: 'rgba(109,255,182,0.15)',
          pointBackgroundColor: 'rgba(109,255,182,0.9)',
        },
        {
          label: 'Target',
          data: [target.waste, target.transport, target.energy, target.water, target.consumption],
          borderColor: 'rgba(0,170,255,0.9)',
          backgroundColor: 'rgba(0,170,255,0.10)',
          pointBackgroundColor: 'rgba(0,170,255,0.9)',
        },
      ],
    };
  }

  dimensionLabel(d?: string) {
    switch (d) {
      case 'waste': return 'Residuos';
      case 'transport': return 'Transporte';
      case 'energy': return 'Energía';
      case 'water': return 'Agua';
      case 'consumption': return 'Consumo';
      default: return 'Enfoque';
    }
  }

  messages() {
    return this.data?.ai?.messages ?? [];
  }

  activeMessage() {
    return this.messages()[this.activeIndex];
  }

  next() {
    const len = this.messages().length;
    if (!len) return;
    this.activeIndex = (this.activeIndex + 1) % len;
  }

  prev() {
    const len = this.messages().length;
    if (!len) return;
    this.activeIndex = (this.activeIndex - 1 + len) % len;
  }

  onRetry() {
    this.retry.emit();
  }
}
