# Arquitectura: Prioridades de Tareas (Task Priority)

## Objetivo

Agregar campo `priority` (`low` | `medium` | `high`) a tareas, con default `medium`, validado en API y visible/filtrable en UI, sin romper comportamiento existente.

## Decisiones arquitectónicas

1. **Normalización de legacy:** El constructor de `TaskStore` normaliza cada tarea inicial asignando `priority: 'medium'` si falta. `list()` también aplica fallback defensivo (`task.priority ?? 'medium'`) para cubrir tareas creadas por código externo. Seed en `server.js` se actualiza explícitamente.
2. **`priority: null` en PATCH:** se trata como inválido → `TypeError` → HTTP 422. Regla: si la clave está presente (`Object.hasOwn`), el valor debe ser string válido; `undefined` solo ocurre si no se envía.
3. **Create sin priority:** si `input.priority === undefined` → `medium`. Si se envía (incluso `null`) → validar.
4. **Validación:** `VALID_PRIORITIES = new Set(['low','medium','high'])`, exportado. Inválido lanza `TypeError` (consistente con status). `server.js` ya mapea TypeError→422.
5. **Sin dependencias nuevas** (RNF-01).

## Componentes involucrados

- `src/task-store.js`: constante, create, update, constructor, list.
- `server.js`: seed con priority.
- `public/index.html`: selector en form + filtro priority.
- `public/app.js`: envío, visualización, filtrado AND.
- `test/task-store.test.js`: tests nuevos.

## Archivos a modificar

- `src/task-store.js`
- `server.js`
- `public/index.html`
- `public/app.js`
- `test/task-store.test.js`

## Archivos a crear

- Ninguno (solo este doc).

## Dependencias

- Ninguna externa. Reutiliza patrón existente (TypeError→422).

## Diagrama de flujo (create)

```
POST /api/tasks {title, priority?}
  -> store.create(body)
     - valida title
     - status default todo
     - priority: undefined ? 'medium' : validate (TypeError si inválido)
     - push task con priority
  -> 201 {task}
```

## Plan de implementación (orden)

1. `src/task-store.js`: agregar `VALID_PRIORITIES`, normalizar constructor/list, create con default+validación, update con validación condicional.
2. `server.js`: seed priority medium.
3. `public/index.html`: agregar select priority en form y priority-filter.
4. `public/app.js`: enviar priority, mostrar badge, filtrar AND.
5. `test/task-store.test.js`: tests default, válidos, inválidos, update.
6. Ejecutar `npm test`, `npm run check`, `npm start` verificación manual.

## Riesgos técnicos

- Tests existentes no asumen priority; siguen pasando (solo verifican campos específicos).
- Filtro UI debe mantener intersección AND y no romper filtro status solo.
- Normalización defensiva evita `undefined` en tareas legacy.

## Criterios de validación

- `npm test` y `npm run check` pasan.
- `npm start` en 127.0.0.1:3000.
- create sin priority → medium; valores inválidos → 422.
- UI muestra y filtra priority; status filter sigue funcionando.