# Entornos (dev / prod) y build flavors

## 1. Variables de entorno de Angular

### Desarrollo

Archivo: `src/environments/environment.ts`

Campos relevantes:

- `production: false`
- `apiBaseUrl`

### Produccion

Archivo: `src/environments/environment.prod.ts`

Campos relevantes:

- `production: true`
- `apiBaseUrl`

## 2. Base URL de API

Valor actual recomendado (dev/prod):

```text
https://surtimarketbackend.onrender.com
```

Para pruebas locales:

```text
http://localhost:3000
```

> En telefono fisico, `localhost` no apunta a tu PC. Usar IP local (`http://192.168.x.x:3000`) o backend publico.

## 3. Reemplazo de entornos en build Angular

Configurado en `angular.json`:

- `production` reemplaza `environment.ts` por `environment.prod.ts`

## 4. Flavors de build (practica recomendada)

Aunque hoy no hay flavors Android definidos, se recomienda manejar:

- **dev**
  - API local / staging
  - logs habilitados
- **prod**
  - API publica
  - optimizaciones de Angular
  - APK/AAB firmado

## 5. Flujo de build Android (Capacitor)

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

Para release:

```bash
./gradlew assembleRelease
```

## 6. Checklist antes de release

- [ ] `environment.prod.ts` con `apiBaseUrl` correcto
- [ ] `npm run build` sin errores
- [ ] `npx cap sync android`
- [ ] firma de release (keystore) configurada
- [ ] smoke test en dispositivo fisico

