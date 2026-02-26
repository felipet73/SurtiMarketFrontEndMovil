# Release Notes - v1.1.0-baseline2

Fecha objetivo: 2026-02-25

## Resumen

Baseline 2 del frontend movil con foco en dashboards, administracion y trazabilidad tecnica del proyecto.

## Incluye

- Dashboard Admin (usuarios, productos, pedidos, prompts IA, analytics)
- Dashboard Empleado con gestion de pedidos
- Integracion Android via Capacitor (proyecto `android/`)
- Correccion de `apiBaseUrl` por environment en servicios clave (`dashboard`, `puzzle`)
- Estandarizacion de documentacion tecnica y flujo de ramas
- CI basico de build Angular/Ionic

## Riesgos / pendientes conocidos

- `authGuard` actualmente simplificado (`return true`) y debe endurecerse.
- Revisar warnings menores del compilador Angular en templates restantes.
- Definir pipeline de release firmado APK/AAB.

