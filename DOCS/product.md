# MindCinema – Product Direction

## 1. Qué es MindCinema

MindCinema es una app de recomendación de películas orientada al momento vital y emocional del usuario.

No es un catálogo.
No es una base de datos.
No es “otra Netflix”.

Es una herramienta para elegir qué ver con sentido.

---

## 2. Propuesta de valor

MindCinema te recomienda qué ver según cómo te sientes o según lo que necesitas atender en este momento de tu vida.

Alternativas:
- Películas para acompañar tu momento
- Qué ver según cómo estás, no según el género

---

## 3. Intención del usuario

El usuario no quiere explorar películas.

Quiere resolver una de estas situaciones:

1. No sé qué ver ahora mismo
2. Sé cómo me siento, pero no sé qué me ayudaría
3. Quiero una recomendación con sentido, no random

---

## 4. Lógica del producto

No usamos:
- géneros
- popularidad
- tendencias

Usamos:
- estado emocional
- áreas de vida
- necesidad actual
- tono de la recomendación

---

## 5. Flujos principales

### Flujo ideal
Home → elección de camino → resultados → detalle → volver o reiniciar

### Flujo rápido
Home → Recomendación rápida → Resultados → Detalle de película

### Flujo profundo
Home → Test de áreas de vida → Resultados → Detalle de película

El producto debe sentirse guiado, no navegacional. La navegación acompaña el flujo, no compite con él.

---

## 6. Pantallas del MVP

### Núcleo
- Home
- Recomendación rápida (emociones)
- Test de áreas de vida
- Resultados
- Detalle de película
- About

### Sistema
- 404
- Loading
- Error
- Empty states

---

## 7. Arquitectura de decisiones

Cada pantalla debe construirse en este orden:

1. Intención del usuario
2. Objetivo de la pantalla
3. Elementos obligatorios
4. Sistema visual
5. Contenido

---

## 8. Sistema visual

### Estilo

MindCinema debe sentirse como un producto **cinematic calm**:

- calmado
- minimalista
- emocional
- editorial
- limpio
- premium sin exceso

No buscamos una interfaz de streaming masiva ni una estética puramente utilitaria.
La sensación debe ser la de un espacio cuidado que ayuda a elegir algo con sentido.

### Principios visuales

- Mucho aire y respiración entre bloques
- Jerarquía tipográfica clara
- Imágenes protagonistas pero controladas
- Oscuros sobrios con acentos suaves
- Tarjetas limpias y consistentes
- Pocas decisiones por pantalla
- Menos cajas, menos ruido, más intención
- Layout contenido, centrado y coherente entre pantallas
- Evitar scrolls innecesarios si la información puede resolverse mejor en el layout

### Principios de composición

- No rellenar huecos automáticamente con otros bloques
- Cada sección debe tener una función clara
- La información narrativa ocupa filas completas dentro del layout existente
- Los CTA deben aparecer cuando el usuario ya entiende qué está viendo
- Si un bloque se elimina, la página debe reorganizarse con intención, no con sustituciones improvisadas

### Referencia de tono visual

La app no debe parecer “catálogo infinito”.
Debe parecer una experiencia cuidada, donde el contenido se presenta con calma y criterio.

---

## 9. UX principles

- No hacer pensar (Don't Make Me Think)
- Scan → decide → act
- Evitar ambigüedad
- Copy claro y humano
- No duplicar información
- CTA claros y coherentes

---

## 10. Taxonomía del producto

### Áreas de vida

Estas son las 9 áreas de vida definitivas del sistema:

- Personal
- Salud
- Espiritualidad
- Aventura
- Amor
- Familia
- Amistad
- Propósito
- Finanzas

Estas áreas estructuran:
- el test
- la lógica de resultado
- la agrupación de recomendaciones
- la organización futura de colecciones o categorías

### Estados emocionales / entrada rápida

La recomendación rápida no debe partir de géneros, sino de estados o intenciones claras.
No hace falta una lista muy larga. Deben ser pocos estados, comprensibles y útiles.

La selección definitiva de estados emocionales debe alinearse con:
- rapidez de uso
- lenguaje humano
- claridad inmediata
- intención cinematográfica

---

## 11. Lógica de recomendación

El sistema debe conectar:

input del usuario → categoría emocional / vital → tipo de película → selección

### Entrada rápida
El usuario elige un mood, estado emocional o intención.
A partir de eso, el sistema devuelve una recomendación rápida y una selección de películas alineadas.

### Entrada profunda
El usuario responde 4 preguntas por cada una de las 9 áreas de vida.
Cada respuesta vale:

- Sí = 1
- A veces = 0.5
- No = 0

Cada área obtiene una puntuación de 0 a 4.

Interpretación:
- 3–4 = área en buen momento
- 1.5–2.5 = área que merece atención
- 0–1 = área prioritaria

Resultado:
- se priorizan las 2–3 áreas con menor puntuación
- esas áreas alimentan la recomendación de películas y la lectura del momento

La recomendación no debe sentirse aleatoria. Siempre debe existir un criterio perceptible.

---

## 12. Resultados

La pantalla de resultados no debe limitarse a listar películas.

Debe cumplir tres funciones:

1. Traducir lo detectado en una lectura clara
2. Destacar qué áreas necesitan más atención
3. Convertir esa lectura en recomendaciones accionables

### Resultado rápido
Debe sentirse inmediato, simple y cinematográfico.

### Resultado profundo
Debe incluir:
- lectura principal del momento
- visualización de la rueda de la vida
- áreas prioritarias
- recomendaciones agrupadas por área

La rueda de la vida es una herramienta de auto-percepción, no solo una visualización.

---

## 13. Detalle de película

La pantalla de detalle no debe ser una ficha técnica fría.
Debe reinterpretar la información de TMDB desde la lógica de MindCinema.

### Qué debe mostrar
- Hero cinematográfico con backdrop y poster visible
- Título
- Año
- Duración
- Rating
- Género
- Sinopsis
- Reparto principal
- Dónde verla
- Tráiler
- Acción de volver

### Qué evitar
- Información duplicada
- Ficha rápida redundante
- CTAs ambiguos
- Secciones genéricas sin valor real

### Principio de detalle
Primero emoción y contexto.
Después utilidad.

---

## 14. SEO (mínimo viable)

Sí:
- title por página
- meta description
- URLs limpias
- Open Graph básico

No:
- estrategia SEO avanzada (por ahora)

---

## 15. Estructura de rutas

Base actual:

- /
- /quick
- /quick/result
- /test
- /test/result
- /areas/:slug
- /movie/:id
- /about

Mejora futura:
- slugs en URLs de película
- títulos dinámicos por página

---

## 16. Navegación

### Header
- logo
- Inicio
- Recomendación rápida
- Explorar tu momento
- Sobre MindCinema

### Footer
- navegación secundaria
- créditos TMDB
- info mínima

La navegación debe ser pequeña, clara y no competir con el flujo principal.

---

## 17. Estados obligatorios

- loading
- error API
- sin resultados
- imagen no disponible
- test incompleto

Además, deben contemplarse estados coherentes para:
- posters inexistentes
- watch providers no disponibles
- tráiler no disponible
- detalle incompleto de película

---

## 18. Principio clave

MindCinema no ayuda a explorar contenido.

Ayuda a tomar una decisión con sentido.

---

## 19. Arquitectura funcional actual

### Stack
- React 18
- Vite
- TailwindCSS
- TMDB API
- frontend-only
- sin backend
- sin autenticación
- sin persistencia por ahora

### Resolución de datos
Los datos se resuelven en cliente con:
- curaduría propia
- enriquecimiento desde TMDB
- normalización antes de renderizar

### Fuente de contenido
TMDB aporta:
- posters
- backdrops
- sinopsis
- créditos
- vídeos
- watch providers
- external ids

MindCinema aporta:
- clasificación por áreas de vida
- selección curada
- lógica de recomendación
- tono y contexto de presentación

---

## 20. Componentes y piezas núcleo

### Home
Debe explicar:
- qué es MindCinema
- cómo funciona
- qué caminos ofrece
- por qué existe

### QuickMood
Selector de entrada rápida por mood / intención.

### Test
Flujo completo de rueda de la vida:
- 9 áreas
- 4 preguntas por área
- progresión secuencial
- resultado al final

### ResultScreen
Dos modos:
- quick
- deep

Debe actuar como lectura + puente hacia la exploración.

### MovieGrid / recommendation sections
Listado de películas recomendado:
- curado
- consistente con el estilo del producto
- orientado a decisión

### MovieDetail
Página de aterrizaje para cerrar la promesa del producto.

---

## 21. Criterios de contenido y copy

### El tono debe ser
- cercano
- claro
- humano
- sereno
- directo
- no cursi
- no excesivamente poético
- no técnico

### Evitar
- frases genéricas vacías
- lenguaje de interfaz impersonal
- redundancias
- copy de “plataforma” sin alma

### Buscar
- claridad inmediata
- naturalidad en español
- consistencia entre pantallas

---

## 22. Branding mínimo viable

### Nombre
MindCinema

### Necesario para el MVP
- logo tipográfico simple
- favicon
- frase de marca
- tono verbal consistente

### La identidad debe transmitir
- cuidado
- criterio
- calma
- sentido
- cine como acompañamiento

---

## 23. Principios para trabajar con IA en este proyecto

La IA no debe improvisar pantallas aisladas.

Debe trabajar con visión de sistema.

Cada nueva tarea debe respetar:
- este documento de producto
- la arquitectura vigente
- las 9 áreas de vida definidas
- el sistema visual acordado
- el tono de copy ya trabajado

### Regla práctica
No pedir solo “haz una pantalla”.
Pedir siempre:
- objetivo
- rol de la pantalla
- constraints de layout
- principios UX
- coherencia con el producto

---

## 24. Criterio de MVP

El MVP no necesita parecer grande.
Necesita sentirse terminado, coherente y útil.

### El MVP sí necesita
- flujo principal claro
- lógica de recomendación comprensible
- consistencia visual
- estados básicos
- navegación mínima
- branding mínimo
- copy coherente

### El MVP no necesita todavía
- favoritos
- login
- perfil
- sistema social
- SEO avanzado
- multiidioma
- catálogo infinito
- reseñas complejas

---

## 25. Norte del producto

MindCinema no clasifica películas para entretener sin criterio.

Clasifica películas para acompañar un momento.

Y toda decisión de diseño, copy, navegación o arquitectura debe reforzar esa promesa.
