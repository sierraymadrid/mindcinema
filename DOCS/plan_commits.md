# Plan de Commits - MindCinema

## 1. Objetivo

Este documento define una estrategia simple y realista de commits, ramas y releases para el MVP de MindCinema.

Contexto del proyecto:

- app web **frontend-only**
- stack: **React 18 + Vite + TailwindCSS + TMDB API**
- proyecto personal o equipo pequeño
- foco en avanzar rápido sin perder claridad histórica

La meta no es crear un proceso pesado, sino mantener un historial de Git:

- fácil de leer
- útil para revisar cambios
- suficientemente ordenado para iterar sobre el MVP

---

## 2. Principios de commits

MindCinema usará **Conventional Commits** como convención base.

Formato recomendado:

```text
tipo(scope opcional): descripción breve
```

Ejemplos:

```text
docs(arquitectura): define flujo de recomendación y test por áreas
feat(test): implementa puntuación por área y selección de áreas recomendadas
fix(movie-grid): evita renderizar posters nulos con fallback visual
```

### Reglas prácticas

- Un commit debe representar un cambio claro y coherente
- El mensaje debe explicar el resultado, no solo la acción técnica
- Es preferible varios commits pequeños y comprensibles que uno muy grande
- No mezclar en un mismo commit cambios de documentación, UI y despliegue si pueden separarse
- Si un cambio toca varias capas pero responde a una única intención, puede ir en un solo commit

### Longitud recomendada

- línea principal corta y directa
- idealmente en presente descriptivo
- sin ruido como "cosas varias", "cambios", "update"

### Commits temporales (WIP)

Durante desarrollo activo es válido usar commits tipo:

```text
wip: progreso en test flow
```

Estos commits deben ser:

- pequeños
- temporales
- opcionalmente reorganizados antes de mergear a `main`

No deben permanecer como commits finales en ramas principales si afectan a claridad del historial.

---

## 3. Tipos de commit recomendados

### `docs`

Para documentación funcional, técnica o de producto.

Ejemplos:

```text
docs(data-model): define modelo Movie y TestResult para el MVP
docs(api): documenta endpoints TMDB y reglas de normalización
docs(dependencias): resume stack confirmado y dependencias opcionales futuras
```

### `feat`

Para nueva funcionalidad visible o nueva capacidad del sistema.

Ejemplos:

```text
feat(hero): añade pantalla inicial con acceso a ruta rápida y exploración profunda
feat(area-selector): permite elegir hasta 3 áreas de vida
feat(tmdb): integra películas populares y trending desde TMDB
feat(result-screen): muestra puntuación final y áreas recomendadas
```

### `fix`

Para corrección de bugs o comportamiento incorrecto.

Ejemplos:

```text
fix(test): corrige cálculo de score para respuestas "A veces"
fix(movie-detail): evita error cuando falta backdropPath
fix(quick-mood): impide continuar sin seleccionar un estado inicial
```

### `refactor`

Para reorganización interna sin cambio funcional relevante para el usuario.

Ejemplos:

```text
refactor(tmdb): extrae normalización de películas a una utilidad compartida
refactor(ui): separa MovieCard y MovieGrid en componentes reutilizables
```

### `style`

Para cambios visuales o de formato sin cambiar lógica de negocio.

Ejemplos:

```text
style(hero): ajusta jerarquía visual y espaciado del landing
style(movie-card): mejora legibilidad del título y rating
```

### `chore`

Para tareas operativas, configuración o mantenimiento no funcional.

Ejemplos:

```text
chore(setup): configura Vite, React y TailwindCSS
chore(vercel): añade configuración base para despliegue en Vercel
chore(gitignore): ajusta exclusiones para entorno local
```

### `test`

Solo si más adelante se añaden pruebas automatizadas.

Ejemplos:

```text
test(score): añade tests para cálculo de puntuación por área
test(tmdb): valida mapeo de respuesta API a modelo Movie
```

---

## 4. Tabla de commits planificados por fase

La siguiente tabla propone un plan razonable de commits por fase. No es rígido, pero sí sirve como guía para mantener granularidad y orden.

| Fase | Objetivo | Commits sugeridos |
|---|---|---|
| Fase 1 - Arquitectura | Definir producto, flujos y modelo de datos | `docs(arquitectura): define estructura general de MindCinema` |
| Fase 1 - Arquitectura | Documentar áreas de vida y lógica del test | `docs(life-areas): documenta las 8 áreas y preguntas del test` |
| Fase 1 - Arquitectura | Documentar modelo de datos | `docs(data-model): define Movie, LifeAreaQuestion y TestResult` |
| Fase 1 - Arquitectura | Documentar endpoints y dependencias | `docs(api): resume consumo de TMDB para el MVP` |
| Fase 1 - Arquitectura |  | `docs(dependencias): documenta stack y política de dependencias` |
| Fase 1 - Arquitectura | Definir estrategia de Git y releases | `docs(release): define plan de commits, ramas y versionado inicial` |
| Fase 2 - Setup | Crear base del proyecto | `chore(setup): inicializa proyecto con React 18 y Vite` |
| Fase 2 - Setup | Integrar estilos base | `chore(tailwind): configura TailwindCSS y estilos globales` |
| Fase 2 - Setup | Preparar estructura inicial | `chore(structure): organiza carpetas base de components, services y docs` |
| Fase 3 - Componentes | Crear entrada principal | `feat(hero): implementa pantalla inicial del producto` |
| Fase 3 - Componentes | Implementar flujo rápido | `feat(quick-mood): añade selección rápida por área emocional` |
| Fase 3 - Componentes | Implementar selección de áreas | `feat(area-selector): permite seleccionar hasta 3 áreas` |
| Fase 3 - Componentes | Implementar test | `feat(test): añade flujo de preguntas y respuestas por área` |
| Fase 3 - Componentes | Mostrar resultados | `feat(result-screen): presenta scores y áreas prioritarias` |
| Fase 3 - Componentes | Mostrar catálogo | `feat(movie-grid): crea grid de películas recomendadas` |
| Fase 3 - Componentes | Crear piezas de detalle | `feat(movie-card): implementa tarjeta base de película` |
| Fase 3 - Componentes |  | `feat(movie-detail): añade vista detalle con metadatos principales` |
| Fase 3 - Componentes | Mejorar presentación | `style(ui): unifica estilos del flujo principal del MVP` |
| Fase 4 - Integración TMDB | Integrar consumo API | `feat(tmdb): añade cliente base para consumir TMDB` |
| Fase 4 - Integración TMDB | Normalizar datos | `feat(data): normaliza respuestas TMDB al modelo Movie` |
| Fase 4 - Integración TMDB | Mapear áreas | `feat(keywords): relaciona keywords y áreas de vida` |
| Fase 4 - Integración TMDB | Integrar recomendación rápida | `feat(recommendation): conecta QuickMood con resultados de TMDB` |
| Fase 4 - Integración TMDB | Integrar recomendación profunda | `feat(test-results): enlaza áreas con menor score a MovieGrid` |
| Fase 4 - Integración TMDB | Corregir casos límite | `fix(tmdb): maneja posters nulos, overview vacío y fechas ausentes` |
| Fase 5 - Despliegue | Preparar despliegue | `chore(vercel): configura despliegue del frontend en Vercel` |
| Fase 5 - Despliegue | Ajustar entorno | `chore(env): documenta variables necesarias para TMDB en frontend` |
| Fase 5 - Despliegue | Cerrar MVP | `docs(changelog): registra alcance del primer release funcional` |

### Nota

No es obligatorio ejecutar exactamente un commit por cada línea. La tabla marca unidades de cambio recomendadas para evitar commits demasiado grandes o ambiguos.

---

## 5. Cuándo crear tags y releases

En un MVP pequeño no tiene sentido publicar una release por cada cambio menor. Los tags y releases deben reservarse para hitos reales.

### Cuándo sí tiene sentido crear un tag

- cuando termina una fase importante del proyecto
- cuando existe una versión desplegable y mínimamente estable
- cuando conviene marcar un punto claro antes de un cambio mayor

### Hitos recomendados para MindCinema

```text
v0.1.0  -> documentación base y arquitectura cerrada
v0.2.0  -> setup técnico completo con React, Vite y Tailwind
v0.3.0  -> flujo UI principal navegable con componentes MVP
v0.4.0  -> integración funcional con TMDB y normalización operativa
v1.0.0  -> MVP desplegado en Vercel y usable de extremo a extremo
```

### Cuándo crear una release

Crear una release tiene sentido cuando además del tag existe:

- una versión desplegable
- un cambio funcional reconocible
- notas breves de qué incluye y qué queda pendiente

### Qué no merece release por sí solo

- cambios aislados de copy
- ajustes menores de estilos
- pequeños fixes locales
- commits puramente internos sin impacto de hito

---

## 6. Política de ramas

Para MindCinema se recomienda una política de ramas **muy simple**.

### Ramas recomendadas

- `main`: rama estable del proyecto
- ramas cortas de trabajo por tarea o bloque funcional

Formato sugerido:

```text
feature/nombre-corto
fix/nombre-corto
docs/nombre-corto
chore/nombre-corto
```

Ejemplos reales:

```text
docs/data-model
feature/test-flow
feature/tmdb-integration
fix/poster-fallback
chore/vercel-deploy
```

### Flujo recomendado

1. Crear una rama corta desde `main`
2. Hacer uno o varios commits pequeños y claros
3. Revisar que el cambio compila o al menos no rompe la base
4. Integrar de nuevo en `main`
5. Borrar la rama si ya no aporta valor

### Cuándo trabajar directo en `main`

Puede tener sentido solo si el cambio es muy pequeño y de bajo riesgo, por ejemplo:

- corrección mínima en documentación
- ajuste menor de `.gitignore`
- typo aislado

Para cualquier cambio funcional, sigue siendo mejor usar una rama corta.

### Qué evitar

- ramas largas que acumulen demasiados cambios
- ramas por fase que duren semanas
- flujos complejos tipo `develop`, `release`, `hotfix` si el proyecto no lo necesita

### Sobre squash de commits

Si una rama contiene muchos commits pequeños de desarrollo, se puede hacer squash antes de integrar en `main` para mantener un historial más limpio.

No es obligatorio. Prioriza claridad sobre perfección.

### Cuándo no hacer commit

Evitar commits cuando:

- el código no compila
- rompe completamente el flujo principal
- es un cambio a medio hacer que no representa una unidad clara

En esos casos, es mejor seguir trabajando o usar commits WIP.

---

## 7. Recomendaciones finales

- Priorizar claridad de historial sobre formalismo excesivo
- Separar commits de documentación, setup, UI, integración API y despliegue siempre que sea razonable
- Usar tags solo en hitos reales del MVP
- Mantener `main` en estado estable y desplegable cuando sea posible

Si el proyecto crece más adelante, esta estrategia puede evolucionar. Para el MVP actual, esta política es suficiente, mantenible y realista.
