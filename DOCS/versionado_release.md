# Versionado y Releases - MindCinema

## 1. Objetivo

Este documento define una estrategia simple de versionado y releases para el MVP de MindCinema.

Contexto del proyecto:

- app web **frontend-only**
- stack: **React 18 + Vite + TailwindCSS + TMDB API**
- despliegue en **Vercel**
- proyecto personal o equipo pequeño

La idea es tener un sistema fácil de aplicar en el día a día:

- suficiente para marcar hitos reales
- útil para ordenar el progreso del MVP
- ligero, sin procesos innecesarios

---

## 2. Estrategia de versionado

MindCinema usará **SemVer** con formato:

```text
major.minor.patch
```

Ejemplo:

```text
0.3.0
```

### Cómo interpretar cada parte

### `major`

Se incrementa cuando hay un cambio grande de alcance o una versión claramente estable del producto.

En este proyecto:

- `1.0.0` representa el **MVP desplegado y usable de extremo a extremo**

Ejemplo real:

- pasar de una app con componentes sueltos a una experiencia completa en Vercel con flujo rápido, test y consumo real de TMDB

### `minor`

Se incrementa cuando se añade un bloque funcional importante sin reiniciar el producto.

Es la parte más útil durante el MVP.

Ejemplos reales de MindCinema:

- `0.1.0` -> arquitectura y documentación base
- `0.2.0` -> setup técnico con React, Vite y Tailwind
- `0.3.0` -> componentes UI navegables
- `0.4.0` -> integración funcional con TMDB

### `patch`

Se incrementa para correcciones pequeñas o mejoras puntuales dentro de una misma versión funcional.

Ejemplos reales:

- `0.4.1` -> corrige fallback cuando falta `posterPath`
- `0.4.2` -> corrige cálculo de score en `Test`
- `1.0.1` -> corrige error en `MovieDetail` cuando falta `backdropPath`

### Regla práctica para el MVP

Mientras MindCinema esté en fase pre-release:

- usar `0.x.0` para hitos relevantes
- usar `0.x.y` para fixes o ajustes posteriores dentro del mismo hito

### Nota sobre versiones 0.x

Mientras el proyecto esté en versiones `0.x`, se asume que pueden existir cambios frecuentes y ajustes sin necesidad de compatibilidad estricta.

El versionado sigue siendo útil para marcar hitos, pero no implica estabilidad total.

---

## 3. Hitos de versión definidos

Estos son los hitos ya previstos para el proyecto.

| Versión | Hito |
|---|---|
| `v0.1.0` | arquitectura y documentación base |
| `v0.2.0` | setup técnico React + Vite + Tailwind |
| `v0.3.0` | componentes UI navegables |
| `v0.4.0` | integración TMDB funcional |
| `v1.0.0` | MVP desplegado en Vercel |

### Qué significa cada hito

`v0.1.0`

- existe base documental coherente
- están definidos flujos, modelo de datos y dependencias

`v0.2.0`

- el proyecto arranca localmente
- Vite, React y Tailwind están configurados
- existe estructura base para empezar a construir la UI

`v0.3.0`

- el usuario ya puede navegar por Hero, selección de áreas, test y pantallas principales
- todavía puede faltar integración real con TMDB

`v0.4.0`

- la app ya consume TMDB
- las películas se normalizan
- QuickMood o el flujo del test ya puede mostrar resultados reales

`v1.0.0`

- el MVP está desplegado en Vercel
- el flujo principal funciona de forma usable
- hay un punto claro de entrega pública o personal estable

---

## 4. Proceso de creación de release

El flujo recomendado debe ser corto y repetible.

### Paso 1. Terminar el bloque funcional

Cerrar los commits necesarios de la fase o mejora correspondiente.

Ejemplos:

- `feat(hero): implementa pantalla inicial del producto`
- `feat(test): añade flujo de preguntas y respuestas por área`
- `feat(tmdb): añade cliente base para consumir TMDB`

### Paso 2. Revisar estado de la rama

Antes de preparar una release:

- comprobar que la rama está ordenada
- decidir si conviene squash de commits o no
- evitar dejar commits WIP como historial final del hito

### Paso 3. Validar la versión

Comprobar que:

- la app compila
- el flujo principal no está roto
- los cambios del hito realmente están presentes

Ejemplos de validación según fase:

- en `v0.3.0`, Hero, QuickMood, Test y ResultScreen deben ser navegables
- en `v0.4.0`, el fetch a TMDB y la normalización de `Movie` deben funcionar
- en `v1.0.0`, el despliegue en Vercel debe estar operativo

### Paso 4. Actualizar versión objetivo

Elegir la siguiente versión según el alcance del cambio:

- nueva fase o hito importante -> subir `minor`
- corrección puntual -> subir `patch`

Ejemplos:

- `0.3.0` -> `0.4.0` si se integra TMDB
- `0.4.0` -> `0.4.1` si solo se corrigen casos límite de posters o fechas

### Paso 5. Crear tag

Cuando el hito esté realmente listo, crear un tag legible:

```text
v0.3.0
v0.4.0
v1.0.0
```

Regla recomendada:

- usar prefijo `v`
- no crear tags para estados intermedios o experimentales

### Comandos básicos

```bash
git tag v0.3.0
git push origin v0.3.0
```

### Paso 6. Publicar release notes

La release debe acompañarse de unas notas breves que expliquen:

- qué se añadió
- qué se corrigió
- qué sigue pendiente si aplica

### Paso 7. Desplegar

Si la release corresponde a una versión desplegable:

- integrar en `main`
- lanzar despliegue en Vercel
- comprobar que la versión publicada coincide con el hito esperado

---

## 5. Qué incluir en las release notes

Las release notes de MindCinema deben ser cortas y útiles.

### Estructura recomendada

- versión
- resumen del hito
- funcionalidades incluidas
- correcciones relevantes
- limitaciones conocidas o siguiente paso

### Ejemplo real

#### `v0.4.0` - Integración TMDB funcional

**Incluye**

- integración base con TMDB para recuperar películas
- normalización de respuestas al modelo `Movie`
- conexión del flujo de recomendación con datos reales
- manejo inicial de casos sin poster o sin fecha

**Correcciones relevantes**

- mejora del fallback visual en `MovieCard`
- ajuste del cálculo de áreas recomendadas en `Test`

**Pendiente**

- pulir detalle de película
- revisar curaduría de keywords por área
- cerrar validación final para release `v1.0.0`

### Regla práctica

Si una release note no ayuda a entender qué cambió en Hero, Test, MovieGrid o integración TMDB, probablemente es demasiado vaga.

---

## 6. Checklist pre-release

Antes de crear un tag o publicar una release, revisar lo siguiente.

### Checklist general

- la rama está en un estado limpio y entendible
- no quedan commits WIP que ensucien el historial final
- la app arranca correctamente
- el build no falla
- el flujo principal del hito funciona
- no hay errores evidentes en consola que bloqueen el uso normal
- la documentación relevante está actualizada si el cambio lo requiere
- la versión elegida tiene sentido respecto al alcance real

### Checklist específica para MindCinema

- `Hero` permite entrar al flujo correcto
- `QuickMood` responde y conduce a recomendaciones
- `AreaSelector` limita correctamente a 3 áreas
- `Test` calcula la puntuación esperada
- `ResultScreen` muestra áreas prioritarias coherentes
- `MovieGrid` renderiza películas sin romperse con datos incompletos
- `MovieDetail` tolera ausencia de imagen o metadatos parciales
- TMDB responde y la normalización a `Movie` sigue siendo válida
- el despliegue en Vercel usa la configuración correcta si aplica

### Si algo falla

No crear release todavía. Corregir primero o dejar explícitamente que se trata de una versión no preparada para tag público.

---

## 7. Política de hotfixes

Para un proyecto pequeño, el flujo de hotfix debe ser directo.

### Cuándo tiene sentido un hotfix

Cuando ya existe una versión etiquetada o desplegada y aparece un problema claro, por ejemplo:

- el Hero no permite navegar
- el Test devuelve scores incorrectos
- TMDB rompe el render por campos nulos
- el despliegue en Vercel queda inutilizable

### Flujo recomendado

1. Crear una rama corta de corrección
2. Aplicar el fix mínimo necesario
3. Validar que resuelve el problema sin introducir cambios extra
4. Integrar en `main`
5. Crear versión `patch`

Ejemplos:

- `v0.4.0` -> `v0.4.1`
- `v1.0.0` -> `v1.0.1`

### Regla para hotfixes

Un hotfix debe ser:

- pequeño
- enfocado
- rápido de validar

No conviene aprovechar un hotfix para mezclar refactors, rediseños o mejoras secundarias.

---

## 8. Recomendaciones finales

- usar `minor` para hitos reales del MVP
- usar `patch` para correcciones acotadas
- crear tags solo cuando exista un punto claro y estable
- mantener release notes breves pero concretas
- priorizar flujo simple sobre proceso perfecto
- opcional: mostrar la versión actual (ej. v0.4.0) en el footer de la app para facilitar trazabilidad

Para MindCinema, esta estrategia es suficiente para trabajar con orden sin perder velocidad de ejecución.
