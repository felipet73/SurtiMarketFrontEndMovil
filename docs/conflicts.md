# Simulacion de conflicto y resolucion (docs)

## Objetivo

Documentar un flujo controlado de conflicto en documentacion (`README.md` / `docs/CHANGELOG.md`) entre dos ramas feature.

## Ramas propuestas

- `feature/conflicto-docs-a`
- `feature/conflicto-docs-b`

## Resumen de la simulacion (ejecutada)

Base de documentacion:

- `feature/documentacion_frontend` en commit `bd915a1`

Ramas de conflicto:

- `feature/conflicto-docs-a`
  - commit: `7247e1f` (`docs: ajuste README build prod (conflicto A)`)
- `feature/conflicto-docs-b`
  - commit: `2a7c12b` (`docs: ajuste README build prod (conflicto B)`)

Merge con conflicto:

- En `feature/conflicto-docs-b` se ejecuto `git merge feature/conflicto-docs-a`
- Conflicto generado en `README.md` (misma linea de `npx serve ./www`)

Resolucion:

- Se consolidaron ambos cambios en una sola instruccion:
  - `npx serve ./www --listen 0.0.0.0   # servir build estatico (opcional acceso LAN)`
- Commit de resolucion:
  - `9b6a7eb` (`docs: resolver conflicto simulado en README`)

## Criterios de resolucion

- Priorizar instrucciones tecnicas completas y consistentes.
- Evitar duplicidad de comandos.
- Mantener formato markdown uniforme.
- Verificar que `README.md` y `docs/CHANGELOG.md` no se contradigan.

## Comandos usados (referencia)

```bash
git checkout -b feature/conflicto-docs-a
# editar README.md
git add README.md
git commit -m "docs: ajuste README build prod (conflicto A)"

git checkout -b feature/conflicto-docs-b bd915a1
# editar README.md (misma linea, contenido distinto)
git add README.md
git commit -m "docs: ajuste README build prod (conflicto B)"

git merge feature/conflicto-docs-a
# resolver conflicto en README.md
git add README.md
git commit -m "docs: resolver conflicto simulado en README"
```

## Evidencia registrada

- hashes de commits A/B/resolucion: `7247e1f`, `2a7c12b`, `9b6a7eb`
- archivo conflictivo: `README.md`
- resultado: resolucion manual combinando ambas intenciones
