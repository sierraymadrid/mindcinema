# MindCinema - Roadmap

---

## 1. Estado actual

El producto ya tiene una base funcional real:

- home operativa
- flujo rapido funcional dentro de `/`
- test de areas de vida funcional en `/test`
- resultados quick y deep ya implementados
- detalle de pelicula en `/movie/:id`
- integracion con TMDB para detalle, posters, cast, trailer y watch providers
- sistema visual bastante definido
- curaduria base de peliculas

Esto ya no es un prototipo inicial.

La fase actual del producto es de estructuracion, consolidacion y limpieza.

---

## 2. Criterio general del roadmap

No avanzar por inspiracion.

Avanzar por sistema.

Cada fase debe dejar el producto:

- mas claro
- mas consistente
- mas usable
- mejor estructurado

No necesariamente mas grande.

---

## 3. Fase 1 - Sistema de rutas

**Prioridad:** alta

**Objetivo:** dejar de depender del estado local como estructura principal del flujo y ordenar la app con rutas claras.

### Tareas

- [ ] Definir y montar la estructura de rutas objetivo:
  - `/`
  - `/quick`
  - `/quick/result`
  - `/test`
  - `/test/result`
  - `/movie/:id`
  - `/about`

- [ ] Extraer QuickMood a ruta propia
- [ ] Dar ruta propia al resultado rapido
- [ ] Dar ruta propia al resultado profundo
- [ ] Mantener navegacion coherente entre flujos
- [ ] Evitar que la navegacion principal dependa solo de estado local
- [ ] Definir el comportamiento de acceso invalido a resultados

### Nota de comportamiento

Cuando existan `/quick/result` y `/test/result`, el comportamiento esperado sera:

- solo se llega a esas rutas despues de completar la accion previa del flujo
- si el usuario entra sin contexto valido, se redirige al inicio del flujo correspondiente

Esto no implica implementar redirecciones antes de crear las rutas. Es el comportamiento esperado una vez existan.

### Resultado esperado

- navegacion limpia
- URLs coherentes con el flujo
- mejor arquitectura
- base correcta para metadata y SEO futuro

---

## 4. Fase 2 - Layout base y estructura global

**Objetivo:** dar coherencia estructural a toda la app.

### Tareas

- [ ] Crear un layout global consistente
- [ ] Definir container principal reutilizable
- [ ] Unificar spacing vertical entre pantallas
- [ ] Crear header minimo:
  - logo tipografico
  - inicio
  - recomendacion rapida
  - test
  - about
- [ ] Crear footer minimo:
  - creditos TMDB
  - navegacion secundaria
  - informacion basica

### Resultado esperado

- sensacion de producto mas terminado
- consistencia estructural entre pantallas
- menos decisiones repetidas en cada vista

---

## 5. Fase 3 - Home

**Objetivo:** explicar el producto y guiar al usuario con claridad en pocos segundos.

### Tareas

- [ ] Resolver hero de home con promesa clara
- [ ] Presentar con claridad los dos caminos:
  - recomendacion rapida
  - test de areas de vida
- [ ] Incluir una explicacion breve de como funciona
- [ ] Ajustar CTA principal y secundarios
- [ ] Revisar el tono de la pagina para que se sienta calmado, claro y editorial

### Resultado esperado

- onboarding claro
- menos friccion al entrar
- mejor comprension de la propuesta de valor

---

## 6. Fase 4 - Resultados

**Objetivo:** afinar resultados para que se sientan totalmente claros, utiles y consistentes.

### Tareas

- [ ] Revisar copy final del resultado rapido
- [ ] Revisar copy final del resultado profundo
- [ ] Afinar jerarquia visual entre lectura, areas y recomendaciones
- [ ] Revisar la rueda de vida como lectura y no solo como visualizacion
- [ ] Consolidar consistencia entre quick y deep donde tenga sentido
- [ ] Detectar y extraer piezas compartidas solo si reducen duplicacion real

### Resultado esperado

- resultados mas claros
- cero ambiguedad en la lectura
- transicion mas solida hacia las recomendaciones

---

## 7. Fase 5 - Movie detail

**Objetivo:** cerrar de forma solida la promesa del producto.

### Tareas

- [ ] Pulido final del hero
- [ ] Afinar orden y jerarquia entre sinopsis, reparto, providers y trailer
- [ ] Revisar microcopy final del detalle
- [ ] Revisar estados vacios:
  - sin trailer
  - sin providers
  - sin imagen
  - detalle incompleto
- [ ] Confirmar que el detalle ayuda a decidir, no solo a informar

### Resultado esperado

- pantalla de detalle robusta
- experiencia mas confiable
- mejor cierre del flujo de recomendacion

---

## 8. Fase 6 - Robustez transversal

**Objetivo:** asegurar que el producto se comporta bien en estados reales.

### Tareas

- [ ] Revisar loading states
- [ ] Revisar error states de API
- [ ] Revisar empty states
- [ ] Revisar fallbacks de imagen
- [ ] Revisar accesos invalidos a rutas de flujo
- [ ] Revisar comportamiento de navegacion atras y reinicio

### Resultado esperado

- app mas fiable
- sensacion profesional
- menos puntos fragiles

---

## 9. Fase 7 - Paginas de area y MovieGrid reutilizable

**Objetivo:** consolidar la exploracion editorial por areas de vida.

### Tareas

- [ ] Definir estructura de `/areas/:slug`
- [ ] Crear primera pagina de area como patron
- [ ] Diseñar el bloque reusable de grid o listado editorial
- [ ] Reutilizar esa pieza en home y areas cuando tenga sentido
- [ ] Alinear contenido con las 9 areas de vida definidas

### Resultado esperado

- exploracion mas estructurada
- mejor reutilizacion del sistema de recomendaciones
- base para crecimiento editorial del producto

---

## 10. Fase 8 - SEO basico

**Objetivo:** dejar una estructura minima correcta una vez las rutas esten estabilizadas.

### Tareas

- [ ] Titles dinamicos por pagina
- [ ] Meta descriptions
- [ ] Open Graph basico
- [ ] Evaluar slugs de pelicula, por ejemplo `/movie/:id-:slug`

### Nota

No implementar SEO avanzado todavia.

Si el producto necesita discoverability organica real mas adelante, habra que valorar prerender, SSG o SSR.

---

## 11. Fase 9 - Branding

**Objetivo:** cerrar la identidad minima del MVP.

### Tareas

- [ ] Logo tipografico final
- [ ] Favicon final
- [ ] Frase de marca definitiva
- [ ] Revisar consistencia verbal entre pantallas y docs

### Resultado esperado

- identidad mas reconocible
- producto mas cohesionado

---

## 12. Fuera del MVP

No hacer ahora:

- favoritos
- login
- perfil
- sistema social
- reviews complejas
- blog
- multiidioma
- SEO avanzado
- catalogo infinito

---

## 13. Prioridad inmediata

La prioridad inmediata es la **Fase 1 - Sistema de rutas**.

Es el siguiente paso logico porque:

- desbloquea navegacion real
- simplifica la logica
- mejora la arquitectura
- prepara metadata y SEO futuro

---

## 14. Orden recomendado real

1. sistema de rutas
2. layout base
3. home
4. resultados
5. detalle de pelicula
6. robustez transversal
7. paginas de area y MovieGrid reutilizable
8. SEO basico
9. branding

