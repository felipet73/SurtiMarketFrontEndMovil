import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonIcon, IonChip, IonButtons, IonButton, IonCard, IonCardContent, IonInput,
  IonSpinner, IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { UsersModalComponent } from '../../admin/users-modal/users-modal.component';
import { ProductsModalAdminComponent } from '../../admin/products-modal-admin/products-modal-admin.component';
import { OrdersModalAdminComponent } from '../../admin/orders-modal-admin/orders-modal-admin.component';
import { AiPromptsModalComponent } from '../../admin/ai-prompts-modal/ai-prompts-modal.component';
import { AnalyticsService, AnalyticsDashboardResponse } from 'src/app/core/services/analytics';

type SectionKey = 'products' | 'employees' | 'orders' | 'ai-challenges';

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonIcon, IonChip, IonButtons, IonButton, IonCard, IonCardContent, IonInput,
    IonSpinner, IonRefresher, IonRefresherContent,
    BaseChartDirective,
    UsersModalComponent,
    ProductsModalAdminComponent,
    OrdersModalAdminComponent,
    AiPromptsModalComponent
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class AdminPage implements OnInit {
  sections: Array<{ key: SectionKey; title: string; desc: string; icon: string; badge: string }> = [
    { key: 'products', title: 'Productos', desc: 'Crear, editar, stock, categorias', icon: 'basket-outline', badge: 'Config' },
    { key: 'employees', title: 'Empleados', desc: 'Usuarios, roles, permisos', icon: 'people-outline', badge: 'Roles' },
    { key: 'orders', title: 'Gestionar Pedidos', desc: 'Seguimiento, estados y despacho', icon: 'clipboard-outline', badge: 'Pedidos' },
    { key: 'ai-challenges', title: 'Gestion de Retos IA', desc: 'Configurar retos, reglas y mensajes IA', icon: 'sparkles-outline', badge: 'IA' },
  ];

  usersModalOpen = false;
  productsModalOpen = false;
  ordersModalOpen = false;
  aiPromptsModalOpen = false;

  analyticsLoading = false;
  analyticsError = '';
  analyticsFrom = '';
  analyticsTo = '';
  analyticsLoaded = false;

  lineActivityData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  stackedDimensionData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  doughnutEcoCoinsData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  horizontalCustomersData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  barStreakData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  comboOrdersTicketData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  private readonly emptySeries: Array<{ label: string; data: number[] }> = [];

  lineOptions: ChartConfiguration<'line'>['options'] = this.cartesianOptions();
  stackedBarOptions: ChartConfiguration<'bar'>['options'] = {
    ...this.cartesianOptions(),
    scales: {
      x: { stacked: true, ticks: { color: 'rgba(255,255,255,0.72)' }, grid: { color: 'rgba(255,255,255,0.08)' } },
      y: { stacked: true, ticks: { color: 'rgba(255,255,255,0.72)' }, grid: { color: 'rgba(255,255,255,0.10)' } },
    },
  };
  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    animation: { duration: 600 },
    plugins: { legend: { labels: { color: 'rgba(255,255,255,0.9)' } } },
  };
  horizontalBarOptions: ChartConfiguration<'bar'>['options'] = {
    ...this.cartesianOptions(),
    indexAxis: 'y',
  };
  barOptions: ChartConfiguration<'bar'>['options'] = this.cartesianOptions();
  comboOptions: ChartConfiguration<'bar'>['options'] = this.cartesianOptions();

  constructor(private router: Router, private analyticsSvc: AnalyticsService) {}

  ngOnInit(): void {
    this.setDefaultAnalyticsRange();
    this.loadAnalytics();
  }

  open(key: SectionKey) {
    if (key === 'employees') { this.usersModalOpen = true; return; }
    if (key === 'products') { this.productsModalOpen = true; return; }
    if (key === 'orders') { this.ordersModalOpen = true; return; }
    if (key === 'ai-challenges') { this.aiPromptsModalOpen = true; return; }
  }

  closeUsersModal() { this.usersModalOpen = false; }
  closeProductsModal() { this.productsModalOpen = false; }
  closeOrdersModal() { this.ordersModalOpen = false; }
  closeAiPromptsModal() { this.aiPromptsModalOpen = false; }

  async onPullRefresh(event: any) {
    await this.loadAnalytics();
    event?.target?.complete?.();
  }

  async refreshAnalytics() {
    await this.loadAnalytics();
  }

  async applyQuickRange(range: '7d' | '30d' | 'month') {
    const today = new Date();
    const end = new Date(today);
    let start = new Date(today);

    if (range === '7d') {
      start.setDate(start.getDate() - 6);
    } else if (range === '30d') {
      start.setDate(start.getDate() - 29);
    } else {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    this.analyticsFrom = this.formatDateInput(start);
    this.analyticsTo = this.formatDateInput(end);
    await this.loadAnalytics();
  }

  async loadAnalytics() {
    this.analyticsLoading = true;
    this.analyticsError = '';
    try {
      const res = await this.analyticsSvc.getDashboard(this.analyticsFrom || undefined, this.analyticsTo || undefined);
      this.buildCharts(res);
      this.analyticsLoaded = true;
    } catch (e) {
      console.error('Analytics dashboard load error', e);
      this.analyticsError = 'No fue posible cargar graficos analiticos.';
      this.resetCharts();
      this.analyticsLoaded = false;
    } finally {
      this.analyticsLoading = false;
    }
  }

  logout() {
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  private setDefaultAnalyticsRange() {
    if (this.analyticsFrom || this.analyticsTo) return;
    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - 29);
    this.analyticsFrom = this.formatDateInput(from);
    this.analyticsTo = this.formatDateInput(to);
  }

  private formatDateInput(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private chartColors() {
    return ['#6dffb6', '#00aaff', '#ffcc33', '#ff7f7f', '#9b8cff', '#4dd6ff'];
  }

  private cartesianOptions(): any {
    return {
      responsive: true,
      animation: { duration: 600 },
      plugins: { legend: { labels: { color: 'rgba(255,255,255,0.9)' } } },
      scales: {
        x: { ticks: { color: 'rgba(255,255,255,0.72)' }, grid: { color: 'rgba(255,255,255,0.08)' } },
        y: { ticks: { color: 'rgba(255,255,255,0.72)' }, grid: { color: 'rgba(255,255,255,0.10)' } },
      },
    };
  }

  private resetCharts() {
    this.lineActivityData = { labels: [], datasets: [] };
    this.stackedDimensionData = { labels: [], datasets: [] };
    this.doughnutEcoCoinsData = { labels: [], datasets: [] };
    this.horizontalCustomersData = { labels: [], datasets: [] };
    this.barStreakData = { labels: [], datasets: [] };
    this.comboOrdersTicketData = { labels: [], datasets: [] };
  }

  private buildCharts(payload: AnalyticsDashboardResponse) {
    const colors = this.chartColors();
    const charts = (payload as any)?.charts ?? payload;

    const activity = this.parseChartJsSeries(charts.activityDaily, 4);
    this.lineActivityData = {
      labels: activity.labels,
      datasets: activity.datasets.map((d: { label: string; data: number[] }, i: number) => ({
        label: d.label,
        data: d.data,
        borderColor: colors[i % colors.length],
        backgroundColor: `${colors[i % colors.length]}22`,
        tension: 0.3,
        fill: false,
      })),
    };

    const dimension = this.parseChartJsSeries(charts.dimensionWeekly, 5);
    this.stackedDimensionData = {
      labels: dimension.labels,
      datasets: dimension.datasets.map((d: { label: string; data: number[] }, i: number) => ({
        label: d.label,
        data: d.data,
        backgroundColor: `${colors[i % colors.length]}bb`,
      })),
    };

    const eco = this.parseLabeledData(charts.ecoCoinsBreakdown);
    this.doughnutEcoCoinsData = {
      labels: eco.labels,
      datasets: [{ data: eco.values, backgroundColor: eco.labels.map((_: string, i: number) => `${colors[i % colors.length]}cc`) }],
    };

    const topCustomers = this.parseLabeledData(charts.ordersTopCustomers);
    this.horizontalCustomersData = {
      labels: topCustomers.labels,
      datasets: [{ label: 'Pedidos', data: topCustomers.values, backgroundColor: '#00aaffcc' }],
    };

    const streak = this.parseLabeledData(charts.streakDistribution);
    this.barStreakData = {
      labels: streak.labels,
      datasets: [{ label: 'Usuarios', data: streak.values, backgroundColor: '#ffcc33cc' }],
    };

    const combo = this.parseComboV2(charts.ordersVsTicketWeekly);
    this.comboOrdersTicketData = {
      labels: combo.labels,
      datasets: [
        { type: 'bar', label: combo.barsLabel, data: combo.bars, backgroundColor: '#6dffb6cc' } as any,
        { type: 'line', label: combo.lineLabel, data: combo.line, borderColor: '#ffcc33', backgroundColor: '#ffcc3322', tension: 0.3 } as any,
      ],
    };
  }

  private parseChartJsSeries(source: any, maxDatasets: number) {
    const labels = Array.isArray(source?.labels) ? source.labels.map((v: unknown) => String(v)) : [];
    const datasets = Array.isArray(source?.datasets)
      ? source.datasets
          .slice(0, maxDatasets)
          .map((d: any) => ({
            label: String(d?.label ?? d?.key ?? 'Serie'),
            data: Array.isArray(d?.data) ? d.data.map((v: unknown) => Number(v ?? 0)) : [],
          }))
      : [];

    if (labels.length || datasets.length) {
      return { labels, datasets };
    }

    return this.parseSeries(source, maxDatasets);
  }

  private parseLabeledData(source: any) {
    const labels = Array.isArray(source?.labels) ? source.labels.map((v: unknown) => String(v)) : [];
    const values = Array.isArray(source?.data) ? source.data.map((v: unknown) => Number(v ?? 0)) : [];

    if (labels.length || values.length) {
      return { labels, values };
    }

    if (source && typeof source === 'object' && !Array.isArray(source)) {
      const entries = Object.entries(source as Record<string, unknown>).filter(([, v]) => typeof v === 'number');
      return { labels: entries.map(([k]) => k), values: entries.map(([, v]) => Number(v)) };
    }

    const rows = Array.isArray(source) ? source as any[] : [];
    return {
      labels: rows.map(r => String(r?.label ?? r?.name ?? r?.type ?? '')),
      values: rows.map(r => Number(r?.value ?? r?.amount ?? r?.total ?? 0)),
    };
  }

  private parseComboV2(source: any) {
    const labels = Array.isArray(source?.labels) ? source.labels.map((v: unknown) => String(v)) : [];
    const bars = Array.isArray(source?.bars?.data) ? source.bars.data.map((v: unknown) => Number(v ?? 0)) : [];
    const line = Array.isArray(source?.line?.data) ? source.line.data.map((v: unknown) => Number(v ?? 0)) : [];

    if (labels.length || bars.length || line.length) {
      return {
        labels,
        barsLabel: String(source?.bars?.label ?? 'Pedidos'),
        bars,
        lineLabel: String(source?.line?.label ?? 'Ticket promedio'),
        line,
      };
    }

    const legacy = this.parseCombo(source);
    return {
      labels: legacy.labels,
      barsLabel: 'Pedidos',
      bars: legacy.orders,
      lineLabel: 'Ticket promedio',
      line: legacy.avgTicket,
    };
  }

  private parseSeries(source: unknown, maxDatasets: number) {
    const rows = Array.isArray(source) ? source.filter(v => v && typeof v === 'object') as Record<string, unknown>[] : [];
    if (!rows.length) return { labels: [] as string[], datasets: this.emptySeries };
    const sample = rows[0];
    const labelKey = ['date', 'day', 'week', 'label', 'name'].find(k => k in sample) || Object.keys(sample)[0];
    const numericKeys = Object.keys(sample)
      .filter(k => k !== labelKey && typeof sample[k] === 'number')
      .slice(0, maxDatasets);
    return {
      labels: rows.map(r => String(r[labelKey] ?? '')),
      datasets: numericKeys.map(k => ({ label: k, data: rows.map(r => Number(r[k] ?? 0)) })),
    };
  }

  private parseBreakdown(source: unknown) {
    if (source && typeof source === 'object' && !Array.isArray(source)) {
      const entries = Object.entries(source as Record<string, unknown>).filter(([, v]) => typeof v === 'number');
      return { labels: entries.map(([k]) => k), values: entries.map(([, v]) => Number(v)) };
    }
    const rows = Array.isArray(source) ? source as any[] : [];
    return {
      labels: rows.map(r => String(r?.label ?? r?.name ?? r?.type ?? '')),
      values: rows.map(r => Number(r?.value ?? r?.amount ?? r?.total ?? 0)),
    };
  }

  private parseRanking(source: unknown, preferred: string[]) {
    const rows = Array.isArray(source) ? source as any[] : [];
    if (!rows.length) return { labels: [] as string[], values: [] as number[] };
    const sample = rows[0] ?? {};
    const labelKey = ['customer', 'name', 'label', 'user', 'range'].find(k => k in sample) || Object.keys(sample)[0];
    const valueKey =
      preferred.find(k => k in sample && typeof sample[k] === 'number') ||
      Object.keys(sample).find(k => typeof sample[k] === 'number') ||
      '';
    return {
      labels: rows.map(r => String(r?.[labelKey] ?? '')),
      values: rows.map(r => Number(r?.[valueKey] ?? 0)),
    };
  }

  private parseCombo(source: unknown) {
    const rows = Array.isArray(source) ? source as any[] : [];
    if (!rows.length) return { labels: [] as string[], orders: [] as number[], avgTicket: [] as number[] };
    const sample = rows[0] ?? {};
    const labelKey = ['week', 'label', 'date'].find(k => k in sample) || Object.keys(sample)[0];
    const numericKeys = Object.keys(sample).filter(k => typeof sample[k] === 'number');
    const ordersKey = ['orders', 'count', 'totalOrders'].find(k => k in sample && typeof sample[k] === 'number') || numericKeys[0] || '';
    const avgKey = ['avgTicket', 'averageTicket', 'ticket'].find(k => k in sample && typeof sample[k] === 'number') || numericKeys[1] || ordersKey;
    return {
      labels: rows.map(r => String(r?.[labelKey] ?? '')),
      orders: rows.map(r => Number(r?.[ordersKey] ?? 0)),
      avgTicket: rows.map(r => Number(r?.[avgKey] ?? 0)),
    };
  }
}
