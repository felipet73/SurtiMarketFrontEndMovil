# Modulo: Dashboard Cliente

## Ubicacion

- `src/app/features/dashboard/client/client.page.ts`
- `src/app/features/dashboard/client/client.page.html`
- `src/app/features/dashboard/client/client.page.scss`

## Responsabilidad

Panel principal de cliente con acceso a:

- perfil
- privacidad
- amigos
- notificaciones
- productos/promociones/carrito
- retos y racha
- mensajes/comentarios
- historial de pedidos
- ecoCoins

## Integraciones (servicios)

- `AuthService`
- `WalletService`
- `ProductsService`
- `OrdersService`
- `NotificationsService`
- `CommentsService`
- `StreakService`
- `EcoImpactService`
- `FriendsService`, `GroupService`
- `CartService` (localStorage)

## Patrones usados

- Multiples modales standalone por funcionalidad
- Recarga parcial del dashboard tras acciones (ej. compra, perfil, mensajes)
- Persistencia de carrito por usuario via localStorage

## Riesgos/areas a controlar

- Crecimiento de `client.page.ts` (componente muy grande)
- Acoplamiento de UI + orquestacion de muchos modales
- Presupuesto SCSS del componente (ya se ajusto en `angular.json`)

