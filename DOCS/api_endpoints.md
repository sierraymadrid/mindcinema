# API Endpoints - MindCinema

## Objetivo

Este documento resume los endpoints de TMDB que MindCinema necesita en su primera versión.

Punto clave:

- **TMDB** aporta películas, metadatos, popularidad, trending, keywords y detalles.
- **MindCinema** aporta la lógica de negocio para agrupar películas en las 9 áreas de vida: Personal, Salud, Espiritualidad, Aventura, Amor, Familia, Amistad, Propósito y Finanzas.
- **TMDB no conoce estas áreas de vida de forma nativa**. Esa clasificación se construye en frontend mediante combinación de `keywords`, `genres` y curaduría propia.

---

## Base URL y autenticación

### Base URL

La base de la API v3 de TMDB es:

```text
https://api.themoviedb.org/3
```

### Autenticación

TMDB permite autenticación de aplicación de dos formas:

- `api_key` como query parameter
- `Authorization: Bearer <token>` como header

Para un frontend simple, la forma más directa es:

```text
https://api.themoviedb.org/3/movie/popular?api_key=TU_API_KEY
```

Ejemplo con parámetros habituales:

```text
GET /movie/popular?api_key=TU_API_KEY&language=es-ES&page=1
```

Notas prácticas:

- Para MindCinema, `language` será importante para títulos, sinopsis y textos localizados.
- `region` puede ayudar a ajustar algunos resultados o fechas de estreno, pero no siempre cambia el contenido.
- Aunque `api_key` funciona en v3, la documentación oficial de TMDB también presenta el uso de Bearer token como método recomendado de autenticación de aplicación.
- Al ser un frontend sin backend propio, la credencial queda expuesta en las peticiones del cliente. Esto es una limitación operativa del enfoque frontend-only.

---

## Endpoints necesarios

| Endpoint | Uso en MindCinema | Método | Parámetros clave | Respuesta esperada |
|---|---|---|---|---|
| `/movie/popular` | Portada, carruseles generales y primera carga con películas conocidas | `GET` | `api_key`, `language`, `page`, opcional `region` | Objeto paginado con `page`, `results`, `total_pages`, `total_results`. Cada item trae un movie list object resumido |
| `/trending/movie/{time_window}` | Sección de tendencias del momento | `GET` | `api_key`, `time_window` (`day` o `week`), `language` | Objeto paginado con lista de películas trending. Estructura similar a otros listados de películas |
| `/search/keyword` + `/discover/movie` | Búsqueda temática por keyword para construir áreas de vida | `GET` | Paso 1: `query`, `page`. Paso 2: `with_keywords`, `language`, `page`, opcional `sort_by`, `vote_count.gte`, `include_adult=false` | Paso 1 devuelve keywords candidatas con `id` y `name`. Paso 2 devuelve películas filtradas por el `keyword_id` seleccionado |
| `/movie/{movie_id}` | Pantalla o modal de detalle de película | `GET` | `movie_id`, `api_key`, `language`, opcional `append_to_response=credits,keywords` | Objeto completo de película con campos como `genres`, `runtime`, `tagline`, `overview`, `poster_path`, `backdrop_path` y, si se añade `append_to_response`, datos complementarios |

### Nota importante sobre el endpoint de keyword

Para MindCinema, "buscar películas por keyword" no suele resolverse con una sola llamada:

1. **TMDB**: buscar la keyword por nombre con `/search/keyword`
2. **TMDB**: recuperar películas relacionadas con ese `keyword_id` usando `/discover/movie?with_keywords=...`
3. **MindCinema**: decidir qué keywords representan cada área de vida y combinar resultados con géneros o curaduría manual

Esto es especialmente importante porque las áreas de vida no existen como entidad nativa dentro de TMDB.

---

## Flujo recomendado por caso de uso

### 1. Películas populares para portada

**TMDB**

```text
GET /movie/popular?api_key=TU_API_KEY&language=es-ES&page=1
```

**MindCinema**

- Usa la respuesta como fuente de portada o carrusel general
- Puede filtrar después películas sin imagen o con sinopsis vacía
- No implica ninguna asignación automática a áreas de vida

### 2. Películas trending

**TMDB**

```text
GET /trending/movie/week?api_key=TU_API_KEY&language=es-ES
```

**MindCinema**

- Muestra contenido más dinámico y actual
- Puede convivir con la portada de populares
- No sustituye la lógica temática por áreas

### 3. Búsqueda de películas por keyword

**TMDB - paso 1**

```text
GET /search/keyword?api_key=TU_API_KEY&query=purpose&page=1
```

**TMDB - paso 2**

```text
GET /discover/movie?api_key=TU_API_KEY&with_keywords=1234&language=es-ES&page=1&include_adult=false
```

**MindCinema**

- Resuelve y guarda una lista curada de `keyword_id` válidos por área
- Puede combinar varios `keyword_id` por área
- Puede reforzar resultados con filtros propios, por ejemplo:
  - excluir películas sin `poster_path`
  - priorizar `vote_average` y `vote_count`
  - mezclar con selección manual si TMDB devuelve pocos resultados

### 4. Detalle de una película concreta

**TMDB**

```text
GET /movie/550?api_key=TU_API_KEY&language=es-ES
```

Opcional para enriquecer la vista:

```text
GET /movie/550?api_key=TU_API_KEY&language=es-ES&append_to_response=credits,keywords
```

**MindCinema**

- Usa el detalle para la vista final de la película
- Puede aprovechar `keywords` y `credits` para enriquecer la UI
- La etiqueta de área de vida sigue siendo lógica propia, no dato nativo de TMDB

---

## Ejemplo de JSON de TMDB antes de normalizar

Ejemplo simplificado de un item devuelto en listados como `/movie/popular`, `/trending/movie/{time_window}` o `/discover/movie`:

```json
{
  "adult": false,
  "backdrop_path": "/4ynQYtSEuU5hyipcGkfD6ncwtwz.jpg",
  "genre_ids": [53, 28, 80, 18, 9648],
  "id": 343611,
  "original_language": "en",
  "original_title": "Jack Reacher: Never Go Back",
  "overview": "Jack Reacher must uncover the truth behind a major government conspiracy...",
  "popularity": 26.818468,
  "poster_path": "/IfB9hy4JH1eH6HEfIgIGORXi5h.jpg",
  "release_date": "2016-10-19",
  "title": "Jack Reacher: Never Go Back",
  "video": false,
  "vote_average": 4.19,
  "vote_count": 201
}
```

---

## Ejemplo del mismo dato después de normalizar para MindCinema

Ejemplo de shape frontend sugerido:

```json
{
  "id": 343611,
  "title": "Jack Reacher: Never Go Back",
  "originalTitle": "Jack Reacher: Never Go Back",
  "overview": "Jack Reacher must uncover the truth behind a major government conspiracy...",
  "releaseDate": "2016-10-19",
  "year": 2016,
  "posterPath": "/IfB9hy4JH1eH6HEfIgIGORXi5h.jpg",
  "posterUrl": "https://image.tmdb.org/t/p/w500/IfB9hy4JH1eH6HEfIgIGORXi5h.jpg",
  "backdropPath": "/4ynQYtSEuU5hyipcGkfD6ncwtwz.jpg",
  "backdropUrl": "https://image.tmdb.org/t/p/original/4ynQYtSEuU5hyipcGkfD6ncwtwz.jpg",
  "voteAverage": 4.19,
  "voteCount": 201,
  "genreIds": [53, 28, 80, 18, 9648],
  "originalLanguage": "en",
  "source": "tmdb",
  "lifeAreas": ["Personal", "Aventura"],
  "matchReason": {
    "type": "keyword-plus-curation",
    "keywordsMatched": ["purpose", "journey"],
    "confidence": "medium"
  }
}
```

### Qué parte es TMDB y qué parte es MindCinema

**Campos de TMDB**

- `id`
- `title`
- `original_title`
- `overview`
- `release_date`
- `poster_path`
- `backdrop_path`
- `vote_average`
- `vote_count`
- `genre_ids`
- `original_language`

**Campos o lógica propia de MindCinema**

- `posterUrl` y `backdropUrl` construidos para frontend
- `year` derivado de `releaseDate`
- `lifeAreas`
- `matchReason`
- cualquier ranking interno, score temático o curaduría manual

---

## Límites y riesgos

### 1. Rate limits

- TMDB indica que los límites antiguos de `40 requests cada 10 segundos` fueron desactivados en diciembre de 2019.
- Aun así, la documentación oficial señala que siguen existiendo límites superiores aproximados, en el rango de **40 requests por segundo**, y que esto **puede cambiar**.
- Si se supera el umbral, TMDB puede responder con `429 Too Many Requests`.
- Para frontend, conviene aplicar:
  - debounce en búsquedas
  - caché en memoria
  - evitar refetch innecesario al cambiar de pantalla

### 2. Resultados incompletos

- Una keyword puede devolver muy pocos resultados o resultados poco útiles.
- Algunas películas relevantes para un área pueden no estar bien etiquetadas en TMDB.
- Los listados populares o trending no garantizan afinidad temática con las áreas de vida.

### 3. Campos nulos

- `poster_path`, `backdrop_path`, `overview`, `release_date` o `tagline` pueden venir como `null` o vacíos.
- El frontend debe contemplar placeholders y lógica defensiva.
- No conviene asumir que toda película tendrá imagen, sinopsis o fecha consistente.

### 4. Diferencias por idioma

- `language=es-ES` puede cambiar `title`, `overview` y otros textos traducidos.
- No todas las películas tienen el mismo nivel de traducción.
- La keyword encontrada en un idioma no siempre representa igual de bien el tema en otro idioma.
- Para MindCinema puede ser útil:
  - mostrar contenido en `es-ES`
  - pero curar keywords inicialmente en inglés si TMDB ofrece mejor cobertura semántica

### 5. Dependencia de keywords

- Las keywords en TMDB son útiles, pero no bastan por sí solas para modelar las áreas de vida.
- Un área como `Propósito` o `Espiritualidad` puede necesitar varias keywords, géneros y curaduría manual.
- Dos películas muy alineadas con la misma área pueden tener metadata muy distinta.
- Por eso, la clasificación por área debe entenderse como **lógica propia de MindCinema**, no como verdad nativa de TMDB.

---

## Estrategia inicial de keywords por área de vida

La estrategia recomendada para la fase inicial es:

1. Definir una lista corta de conceptos por área
2. Buscar esos conceptos en `/search/keyword`
3. Validar manualmente los `keyword_id` útiles
4. Guardar una lista curada en el frontend
5. Combinar esos resultados con géneros y selección manual

### Propuesta inicial

> Estas keywords son candidatas de arranque. Deben validarse en TMDB antes de usarse en producción porque los nombres exactos y la calidad de resultados pueden variar.

| Área | Keywords candidatas iniciales | Nota de uso en MindCinema |
|---|---|---|
| Personal | `identity`, `self discovery`, `change`, `growth`, `coming of age` | Área centrada en identidad, cambio y avance personal |
| Salud | `health`, `illness`, `recovery`, `healing`, `mental health` | Puede mezclar salud física y emocional |
| Espiritualidad | `spirituality`, `faith`, `meaning of life`, `inner peace`, `redemption` | Área especialmente dependiente de curaduría manual |
| Aventura | `journey`, `adventure`, `expedition`, `survival`, `road trip` | Suele funcionar bien con keywords y géneros |
| Amor | `love`, `romance`, `intimacy`, `relationship`, `heartbreak` | Conviene distinguirlo de familia y amistad en la curaduría |
| Familia | `family`, `parent child relationship`, `home`, `siblings`, `family conflict` | Área centrada en vínculos familiares |
| Amistad | `friendship`, `friends`, `loyalty`, `companionship`, `group of friends` | Conviene reforzar con curaduría para separarla de amor |
| Propósito | `career`, `work`, `calling`, `ambition`, `purpose` | Conviene reforzar con curaduría porque rara vez aparece como tag exacta |
| Finanzas | `money`, `wealth`, `business`, `finance`, `greed` | Suele tener mejor soporte en películas sobre éxito, poder o crisis |

### Recomendación de implementación

- Mantener un archivo local con mapping curado:

```ts
const lifeAreaKeywordMap = {
  Personal: [101, 205, 309],
  Salud: [401, 402, 403],
  Espiritualidad: [451, 452, 453],
  Aventura: [501, 502],
  Amor: [551, 552, 553],
  Familia: [601, 602, 603],
  Amistad: [651, 652, 653],
  Proposito: [701, 702],
  Finanzas: [601, 602, 603],
  // ...
};
```

Notas:

- Los IDs del ejemplo son ilustrativos.
- Los IDs reales deben salir de `/search/keyword` y validación manual.
- En MindCinema conviene versionar este mapping como parte de la lógica propia del producto.

---

## Conclusión

La integración inicial de MindCinema con TMDB puede apoyarse en cuatro capacidades base:

- listados populares
- listados trending
- búsqueda temática basada en keywords
- detalle de película por ID

La parte crítica no está en inventar nuevas entidades en TMDB, sino en definir una buena capa de normalización y clasificación propia.

En resumen:

- **TMDB** entrega datos cinematográficos
- **MindCinema** interpreta esos datos para convertirlos en recomendaciones por áreas de vida
