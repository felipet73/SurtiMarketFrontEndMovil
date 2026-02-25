# SurtiMarket Mobile Frontend (Ionic + Angular Standalone)

Frontend movil de SurtiMarket con Ionic/Angular, arquitectura standalone, modales de negocio (cliente/admin/empleado), integracion con API REST y soporte de build Android via Capacitor.

## Stack tecnico

- Ionic 8 + Angular 20 (Standalone Components)
- TypeScript + SCSS
- Chart.js + `ng2-charts` (analitica admin)
- Capacitor 8 (Android)

## Arquitectura de frontend (resumen)

- **Routing**: `src/app/app.routes.ts` con `loadComponent` (standalone) y guards por rol.
- **Guards**:
  - `authGuard` (autenticacion)
  - `roleGuard([...])` (autorizacion por rol)
- **HTTP / Auth**:
  - `ApiService` centraliza `get/post/patch/delete`
  - `authInterceptor` agrega `Authorization: Bearer <token>`
- **Features**:
  - `src/app/features/auth` (login/register)
  - `src/app/features/dashboard` (client/admin/employee)
  - `src/app/features/challenges` (weekly quiz, puzzle)
  - `src/app/features/products`, `cart`, `notifications`, `privacy`, etc.
- **Core services** (`src/app/core/services`): encapsulan endpoints REST por modulo.

Mas detalle: `docs/ARCHITECTURE.md`.

## Estructura de carpetas (principal)

```text
src/
  app/
    core/
      guards/
      interceptors/
      services/
      dto/
    features/
      auth/
      dashboard/
        client/
        admin/
        employee/
      challenges/
      products/
      cart/
      notifications/
      ecoimpact/
      sustainability/
    pages/
  environments/
    environment.ts
    environment.prod.ts
docs/
  modules/
android/                # generado por Capacitor
capacitor.config.ts
```

## Variables de entorno / API base URL

### Desarrollo

Archivo: `src/environments/environment.ts`

```ts
apiBaseUrl: 'https://surtimarketbackend.onrender.com'
```

> Si necesitas backend local para desarrollo, puedes cambiar temporalmente a `http://localhost:3000` (o IP de tu PC si pruebas en telefono).

### Produccion

Archivo: `src/environments/environment.prod.ts`

```ts
apiBaseUrl: 'https://surtimarketbackend.onrender.com'
```

El build de Angular reemplaza `environment.ts` por `environment.prod.ts` en configuracion `production`.

## Como correr (web)

### Desarrollo

```bash
npm install
npm start
```

o

```bash
npx ng serve --configuration development
```

### Produccion (build + servir estatico)

```bash
npm run build
npx serve ./www   # Rama A: servir build estatico (docs conflicto)
```

## Build Android (Capacitor) / APK

### Requisitos

- Node LTS compatible con Capacitor 8
- Android Studio + Android SDK
- JDK (usualmente Java 17)

### Primera configuracion (si no existe `android/`)

```bash
npx cap init SurtiMarket com.surtimarket.mobile --web-dir=www
npm i @capacitor/android@8.0.2
npx cap add android
```

### Configurar SDK Android

Crear `android/local.properties`:

```properties
sdk.dir=C:\\Users\\<usuario>\\AppData\\Local\\Android\\Sdk
```

### Generar APK debug

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

APK generado:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Regenerar APK despues de cambios

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

## Cambiar API URL para produccion

1. Editar `src/environments/environment.prod.ts`
2. Confirmar `apiBaseUrl`
3. Ejecutar `npm run build`
4. `npx cap sync android`
5. Regenerar APK

## Documentacion tecnica asociada

- `docs/ARCHITECTURE.md`
- `docs/ENVIRONMENTS.md`
- `docs/CHANGELOG.md`
- `docs/modules/*.md`
- `docs/conflicts.md`

