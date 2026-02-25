# Arquitectura Frontend (Ionic + Angular Standalone)

## 1. Vision general

Aplicacion movil en Ionic/Angular con enfoque **feature-based**, componentes standalone y modales para flujos de negocio (cliente, empleado, admin).

## 2. Routing

Archivo principal: `src/app/app.routes.ts`

Patron usado:

- `loadComponent` (lazy de componentes standalone)
- guards por autenticacion y rol

Rutas clave:

- `/` -> login
- `/dashboard/admin`
- `/dashboard/employee`
- `/dashboard/client`
- `/sustainability/start`
- `/sustainability/questionnaire`
- `/ecoimpact/leaderboard`

## 3. Guards

### `authGuard`

- Archivo: `src/app/core/guards/auth-guard.ts`
- Responsable de permitir/bloquear navegacion segun sesion.
- **Nota**: actualmente esta simplificado (`return true`) y debe endurecerse para produccion.

### `roleGuard`

- Archivo: `src/app/core/guards/role.guard.ts`
- Valida roles permitidos (`ADMIN | EMPLOYEE | CLIENT`) usando `AuthService.hasRole(...)`.

## 4. Interceptors

### `authInterceptor`

- Archivo: `src/app/core/interceptors/auth.interceptor.ts`
- Adjunta `Authorization: Bearer <token>` en requests cuando existe token.
- Registrado en `src/main.ts` via `provideHttpClient(withInterceptors([authInterceptor]))`.

## 5. Capa de servicios (`core/services`)

### Convencion

- `ApiService` centraliza operaciones HTTP CRUD base.
- Servicios por dominio encapsulan endpoints:
  - `AuthService`
  - `ProductsService`
  - `OrdersService`
  - `NotificationsService`
  - `AnalyticsService`
  - `AdminUsersService`, `AdminPromptsService`
  - `StreakService`, `WeeklyQuizService`, `EcoImpactService`, etc.

### Ventajas

- Menor duplicacion de URLs
- Tipado por DTOs
- Facil reemplazo de `apiBaseUrl` via environment

## 6. Features y modulos funcionales

Ubicacion: `src/app/features/`

- `auth/`: login, registro
- `dashboard/`: `client`, `admin`, `employee`
- `admin/`: modales de gestion (usuarios, productos, pedidos, prompts IA)
- `challenges/`: quiz semanal, puzzle
- `products/`, `cart/`, `notifications/`, `privacy/`, `friends/`
- `ecoimpact/`, `sustainability/`

## 7. Estado de UI y patrones

- Uso intensivo de modales standalone (`IonModal`)
- Servicios para estado compartido en memoria/localStorage (ej. carrito)
- Tema visual dark/glass en dashboards y cards
- Chart.js + `ng2-charts` en analytics admin

## 8. Entornos y configuracion

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

El frontend consume `environment.apiBaseUrl`.

Mas detalle: `docs/ENVIRONMENTS.md`.

