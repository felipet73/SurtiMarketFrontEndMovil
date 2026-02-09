import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonButton, IonIcon, IonSpinner, IonChip
} from '@ionic/angular/standalone';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { refreshOutline } from 'ionicons/icons';

import { EcoImpactProgressDto } from 'src/app/core/dto/ecoimpact.dto';

@Component({
  standalone: true,
  selector: 'app-ecoprogress-card',
  templateUrl: './ecoprogress-card.component.html',
  styleUrls: ['./ecoprogress-card.component.scss'],
  imports: [CommonModule, IonCard, IonCardContent, IonButton, IonIcon, IonSpinner, IonChip, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class EcoProgressCardComponent implements OnChanges {
  @Input() data: EcoImpactProgressDto | null = null;
  @Input() loading = false;
  @Input() error = '';
  @Input() inGroup = true;
  @Output() retry = new EventEmitter<void>();

  icons = {
    retry: refreshOutline,
  };

  lineData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    animation: { duration: 600 },
    scales: {
      x: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.08)' } },
      y: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.10)' } },
    },
    plugins: { legend: { labels: { color: 'rgba(255,255,255,0.9)' } } },
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.buildLine();
    }
  }

  buildLine() {
    if (!this.data) {
      this.lineData = { labels: [], datasets: [] };
      return;
    }
    const labels = this.data.pointsSeries.map(p => p.dateKey);
    const scores = this.data.pointsSeries.map(p => p.score);
    const datasets: ChartConfiguration<'line'>['data']['datasets'] = [
      {
        label: 'Score',
        data: scores,
        borderColor: 'rgba(109,255,182,0.9)',
        backgroundColor: 'rgba(109,255,182,0.15)',
        tension: 0.3,
        fill: true,
      },
    ];
    if (this.data.rankSeries?.length) {
      datasets.push({
        label: 'Rank',
        data: this.data.rankSeries.map(r => r.rank),
        borderColor: 'rgba(0,170,255,0.9)',
        backgroundColor: 'rgba(0,170,255,0.10)',
        tension: 0.3,
        fill: false,
        yAxisID: 'y',
      });
    }
    this.lineData = { labels, datasets };
  }

  onRetry() {
    this.retry.emit();
  }
}
