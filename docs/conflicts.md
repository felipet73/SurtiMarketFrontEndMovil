# Simulacion de conflicto y resolucion (docs)

## Objetivo

Documentar un flujo controlado de conflicto en documentacion (`README.md` / `docs/CHANGELOG.md`) entre dos ramas feature.

## Ramas propuestas

- `feature/conflicto-docs-a`
- `feature/conflicto-docs-b`

## Resumen de la simulacion (completar con hashes reales)

1. Crear ambas ramas desde `develop` (o desde una branch de documentacion base).
2. Modificar la **misma seccion** de `README.md` (ej. "Como correr").
3. Commit en rama A.
4. Commit en rama B.
5. Intentar merge de A en B -> conflicto.
6. Resolver manualmente combinando cambios.
7. Commit de resolucion y registrar decision.

## Criterios de resolucion

- Priorizar instrucciones tecnicas completas y consistentes.
- Evitar duplicidad de comandos.
- Mantener formato markdown uniforme.
- Verificar que `README.md` y `docs/CHANGELOG.md` no se contradigan.

## Evidencia esperada (ejemplo)

- hashes de commits A/B
- salida de `git status` durante conflicto
- diff de resolucion
- commit final de merge/resolucion

