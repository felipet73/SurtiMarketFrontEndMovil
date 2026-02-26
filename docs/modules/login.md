# Modulo: Login

## Ubicacion

- `src/app/features/auth/login/login.page.ts`
- `src/app/features/auth/login/login.page.html`
- `src/app/features/auth/login/login.page.scss`

## Responsabilidad

- Autenticacion del usuario
- Resolucion de rol y redireccion a dashboard correspondiente
- Apertura de modal de registro

## Dependencias clave

- `AuthService`
- `Router`
- `RegisterModalComponent`
- `authInterceptor` (token para requests posteriores)

## Flujo

1. Usuario ingresa email/password
2. `AuthService.login(...)`
3. Se persiste token/usuario
4. Redireccion por rol:
   - `ADMIN` -> `/dashboard/admin`
   - `EMPLOYEE` -> `/dashboard/employee`
   - `CLIENT` -> `/sustainability/start` (flujo actual)

## Observaciones

- Tiene animaciones de entrada y feedback visual (shake) en error.
- Puede mejorarse `authGuard` para enforcement real de sesion.

