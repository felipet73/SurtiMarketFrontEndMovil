# Modulo: Weekly Quiz Modal

## Ubicacion

- `src/app/features/challenges/weekly-quiz-modal/weekly-quiz-modal.component.ts`
- `...html`
- `...scss`

## Responsabilidad

- Mostrar quiz semanal de sostenibilidad
- Navegacion por preguntas
- Envio de respuestas y visualizacion de recompensa

## Integracion API

Servicio: `WeeklyQuizService`

- `GET /challenges/weekly-quiz/me`
- `POST /challenges/weekly-quiz/:id/submit`

## Estado de UI relevante

- `loading`
- `step`
- `answers[]`
- `submitting`
- `done`
- `result`

## UX

- Progress bar por avance
- Card de resultado final
- Feedback de premio en EcoCoins

