# Modulo: EcoImpact

## Ubicacion

- Servicio: `src/app/core/services/ecoimpact.service.ts`
- Componentes:
  - `src/app/features/client/components/ecoimpact-card/`
  - `src/app/features/client/components/ecoleague-card/`
  - `src/app/features/ecoimpact/leaderboard/`

## Endpoints

- `GET /ecoimpact/me`
- `GET /ecoimpact/progress`
- `GET /ecoimpact/leaderboard?page&limit`

## Funcionalidades UI

- Resumen IA (mensajes/tips)
- Progreso por dimensiones
- Ranking semanal de grupos
- Tabla completa de leaderboard

## Observaciones tecnicas

- Usa Chart.js / `ng2-charts` en algunas visualizaciones
- Templates se benefician de tipado estricto para evitar warnings Angular (`?.` / `??` innecesarios)

