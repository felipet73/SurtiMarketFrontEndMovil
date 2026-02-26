# Modulo: Streak (Racha)

## Ubicacion

- Servicio: `src/app/core/services/streak.ts`
- Consumo principal en dashboard cliente

## Endpoints

- `POST /streak/mark` -> marcar actividad del dia
- `GET /streak/me` -> obtener estado actual de racha

## Datos clave

- `weekLoggedCount`
- `streakCurrent`
- `streakBest`
- `currentWeekDays[]`

## Uso en frontend

- Progreso semanal (0..7 dias)
- Indicadores visuales de continuidad
- Insumo para cards de retos semanales (individual/grupo)

