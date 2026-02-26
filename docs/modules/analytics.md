# Modulo: Analytics (Admin Dashboard)

## Ubicacion

- `src/app/core/services/analytics.ts`
- `src/app/features/dashboard/admin/admin.page.ts`
- `src/app/features/dashboard/admin/admin.page.html`

## Objetivo

Mostrar analitica consolidada del sistema en dashboard de administrador.

## Endpoint

- `GET /analytics/dashboard?from&to`

## Charts implementados

1. `activityDaily` -> line chart (4 datasets)
2. `dimensionWeekly` -> stacked bar (5 datasets)
3. `ecoCoinsBreakdown` -> doughnut
4. `ordersTopCustomers` -> horizontal bar (`indexAxis = 'y'`)
5. `streakDistribution` -> bar
6. `ordersVsTicketWeekly` -> combo (bar + line)

## Caracteristicas de UI

- Filtros por fecha (desde/hasta)
- Atajos rapidos (`7 dias`, `30 dias`, `Este mes`)
- `pull-to-refresh`
- estados `loading/error`
- animacion `fadeUp`

## Consideraciones de parseo

El backend devuelve datos bajo `payload.charts`, con formatos mixtos:

- `labels + datasets`
- `labels + data`
- `labels + bars + line`

El frontend normaliza esos shapes antes de pintar con Chart.js.

