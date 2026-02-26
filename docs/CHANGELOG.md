# Changelog (Frontend)

All notable changes to this frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Estandarizacion de documentacion tecnica del frontend.
- CI basico en GitHub Actions para `npm ci` + `npm run build`.
- Guia de entornos y build Android/Capacitor.

### Changed
- README tecnico (arquitectura, entornos, build Android).

## [1.1.0-baseline2] - 2026-02-25

### Added
- Dashboard Admin con gestion de usuarios, pedidos, prompts IA y graficos (Chart.js / ng2-charts).
- Dashboard Empleado con reutilizacion de gestion de pedidos.
- Integracion Android via Capacitor (proyecto `android/` y `capacitor.config.ts`).

### Changed
- Uso de `environment.apiBaseUrl` en servicios `dashboard` y `puzzle`.
- Ajustes de budgets de Angular para estilos por componente.

### Fixed
- Warnings por imports Ionic no usados en multiples componentes.
- Warnings de templates Angular por `?.` / `??` innecesarios en algunos modulos.

## [1.0.0-baseline] - 2026-02-15

### Added
- Linea base estable inicial del frontend.

