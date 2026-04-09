# Product - MindCinema

## 1. Vision

MindCinema es una aplicacion web que ayuda a descubrir peliculas con sentido segun el momento vital o emocional de cada persona.

El producto se apoya en dos entradas principales:

- una ruta rapida para cuando el usuario quiere una recomendacion inmediata
- una ruta profunda para cuando el usuario quiere explorar como esta en distintas areas de su vida

El objetivo del producto no es solo recomendar peliculas, sino convertir el cine en una herramienta de reflexion, acompañamiento y crecimiento.

---

## 2. Product Principles

- Simplicidad: pocas decisiones, flujos claros y sin ruido innecesario
- Claridad: cada pantalla debe decir rapidamente que esta pasando y que hacer despues
- Sentido: cada recomendacion debe sentirse conectada con un area o estado real
- Coherencia: mantener una misma logica visual y de navegacion en todo el producto
- Ligereza tecnica: frontend-only, sin backend propio por ahora

---

## 3. Main User Flows

### Ruta rapida

Pensada para quien quiere una pelicula ahora mismo.

Flujo:

1. entra en la home
2. elige ruta rapida
3. selecciona un mood o intencion
4. llega a una pantalla de resultado
5. explora peliculas recomendadas
6. entra en detalle de pelicula

### Ruta profunda

Pensada para quien quiere explorar su momento actual con mas contexto.

Flujo:

1. entra en la home
2. elige explorar su momento
3. completa el test de areas de vida
4. llega a una pantalla de resultado con rueda de vida y areas prioritarias
5. explora peliculas asociadas a esas areas
6. entra en detalle de pelicula

---

## 4. Routing Strategy

La estructura de rutas debe ser simple, limpia y bien organizada. La idea es evitar rutas improvisadas y dejar una base clara para crecer.

### Estado actual implementado

- `/`
- `/test`
- `/movie/:id`

Notas:

- el flujo rapido actualmente vive dentro de `/` con estado local
- el detalle de pelicula ya es una pagina real, no un modal

### Decision de producto proxima

La estructura objetivo inmediata de rutas es:

- `/`
- `/quick`
- `/quick/result`
- `/test`
- `/test/result`
- `/movie/:id`
- `/about`
- `/areas/:slug`

### Criterio para los resultados

Las pantallas de resultado deben tener ruta propia aunque no sean paginas publicas de acceso libre.

Esto permite:

- mejor estructura de navegacion
- comportamiento correcto del boton atras
- mejor legibilidad de arquitectura
- separacion mas clara entre pasos del flujo

Regla de comportamiento:

- el usuario solo debe llegar a `/quick/result` despues de completar el flujo rapido
- el usuario solo debe llegar a `/test/result` despues de completar el test
- si entra directamente sin contexto valido, se le redirige a `/quick` o `/test`

### Convencion de naming

Para mantener coherencia y evitar rutas demasiado largas o ambiguas:

- usar `/quick` en vez de `/quick-match`
- usar `/test` en vez de `/life-areas-test`
- usar `/quick/result` y `/test/result` en vez de una ruta generica `/results`

---

## 5. Result Screens

No hace falta forzar una sola implementacion de resultado si la experiencia de uso es distinta.

### Decisión

Mantener dos implementaciones separadas es valido y recomendable mientras sus objetivos UX sean diferentes:

- quick result: respuesta rapida, emocional y directa
- test result: lectura mas reflexiva, con rueda de vida y areas prioritarias

### Criterio tecnico

- compartir piezas reutilizables solo cuando haya duplicacion real
- no unificar artificialmente si eso complica el producto

---

## 6. MovieGrid

MovieGrid se entiende como una pieza reutilizable de exploracion de peliculas dentro del producto.

### Direccion de producto

Debe poder vivir en:

- la home
- las paginas de cada area
- bloques de recomendacion donde tenga sentido

### Paginas de area

Las futuras paginas `/areas/:slug` serviran para mostrar un archivo o seleccion de peliculas por cada area de vida.

Ejemplos:

- `/areas/personal`
- `/areas/salud`
- `/areas/espiritualidad`

Objetivo:

- reforzar la estructura editorial del producto
- permitir exploracion por tema, no solo por flujo

---

## 7. Movie Detail

El detalle de pelicula se mantiene como pagina dedicada.

### Estado actual deseado

`/movie/:id`

### Enfoque de producto

El detalle no necesita convertirse ahora en una ficha enciclopedica. Debe ayudar a decidir si esa pelicula encaja con el momento del usuario.

Por tanto, el enfoque actual es suficiente:

- hero cinematografico
- metadata util
- sinopsis
- reparto principal
- plataformas disponibles
- trailer

No es prioritario añadir mas informacion si no mejora la decision del usuario.

---

## 8. About

`/about` sera una pagina a crear.

Su funcion sera explicar de forma sencilla:

- que es MindCinema
- por que existe
- como funciona la recomendacion
- que papel juega TMDB dentro del producto

Debe mantener el mismo tono editorial y calmado que el resto de la experiencia.

---

## 9. SEO

Este documento de producto puede incluir vision futura, pero hay que distinguir claramente entre lo que existe hoy y lo que todavia no esta implementado.

### Estado actual

Hoy no existe una estrategia SEO completa implementada.

No hay todavia:

- titles dinamicos por pagina
- metadescriptions dinamicas
- canonical URLs
- slugs de pelicula
- SSR, SSG o prerender

### Direccion futura

SEO se deja como linea de evolucion del producto, no como capacidad actual.

Objetivos futuros:

- titles dinamicos por pagina
- slugs mas legibles, por ejemplo `/movie/:id-:slug`
- mejor estructura indexable en rutas de areas y peliculas
- evaluar prerender, SSG o SSR si el producto necesita discoverability organica real

### Regla de documentacion

En este documento:

- lo implementado debe aparecer como estado actual
- lo decidido pero no hecho debe aparecer como decision proxima
- lo deseable a medio plazo debe aparecer como direccion futura

---

## 10. Product Scope Summary

### Actual

- home
- flujo rapido dentro de `/`
- test en `/test`
- detalle en `/movie/:id`
- recomendaciones curadas y enriquecidas con TMDB

### Siguiente paso estructural

- enrutar el flujo rapido en `/quick`
- crear `/quick/result`
- crear `/test/result`
- crear `/about`
- preparar `/areas/:slug`

### Mas adelante

- slugs en peliculas
- titles dinamicos
- estrategia SEO real
- consolidacion de MovieGrid como modulo reutilizable

