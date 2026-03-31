# Data Model - MindCinema

## 1. Objetivo

Este documento define el modelo de datos del MVP de MindCinema para una aplicación **frontend-only en React**.

MindCinema consume datos de **TMDB API**, los normaliza en el cliente y añade una capa de dominio propia para:

- clasificar películas por áreas de vida
- alimentar la recomendación rápida
- calcular resultados del test por áreas

El objetivo es mantener un modelo **simple, estable y fácil de usar en frontend**, separando con claridad:

- **datos fuente de TMDB**
- **datos de dominio de MindCinema**

---

## 2. Principios del modelo

- Cada película del MVP tiene una única área principal: `lifeArea`
- El frontend trabaja con un modelo normalizado común, sin depender directamente de la respuesta cruda de TMDB
- Solo se conservan campos útiles para UI, filtrado y recomendación
- La lógica del test vive en modelos ligeros y serializables

---

## 3. Modelo `LifeArea`

`LifeArea` es el vocabulario cerrado de las 9 áreas de vida usadas en toda la app.

### TypeScript

```ts
export type LifeArea =
  | "personal"
  | "salud"
  | "espiritualidad"
  | "aventura"
  | "amor"
  | "familia"
  | "amistad"
  | "proposito"
  | "finanzas";
```

### Notas

- Se recomienda usar valores en minúsculas y sin acentos como claves internas
- Los labels visibles al usuario pueden derivarse en UI desde un diccionario

### Ejemplo de labels para frontend

```ts
export const LIFE_AREA_LABELS: Record<LifeArea, string> = {
  personal: "Personal",
  salud: "Salud",
  espiritualidad: "Espiritualidad",
  aventura: "Aventura",
  amor: "Amor",
  familia: "Familia",
  amistad: "Amistad",
  proposito: "Propósito",
  finanzas: "Finanzas",
};
```

---

## 4. Modelo principal `Movie`

`Movie` es el modelo normalizado que usa la app para renderizar listados, detalle y recomendaciones.

### Criterio de diseño

Se separan explícitamente:

- campos que vienen de TMDB
- campos añadidos por la lógica de MindCinema

### TypeScript

```ts
export interface Movie {
  id: number;

  // TMDB
  title: string;
  originalTitle: string | null;
  overview: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number | null;
  voteCount: number | null;
  popularity: number | null;
  originalLanguage: string | null;
  genreIds: number[];
  adult: boolean;

  // MindCinema
  lifeArea: LifeArea;
}
```

### Origen de campos

| Campo | Origen | Uso |
|---|---|---|
| `id` | TMDB | Identificador estable de la película en TMDB y clave principal en frontend |
| `title` | TMDB | Título principal para UI |
| `originalTitle` | TMDB | Información secundaria |
| `overview` | TMDB | Sinopsis |
| `releaseDate` | TMDB | Mostrar fecha si existe |
| `releaseYear` | MindCinema derivado de TMDB | Facilita render y filtros |
| `posterPath` | TMDB | Construcción de imagen |
| `backdropPath` | TMDB | Hero o detalle |
| `voteAverage` | TMDB | Rating visible |
| `voteCount` | TMDB | Contexto de rating |
| `popularity` | TMDB | Ordenaciones si se necesitan |
| `originalLanguage` | TMDB | Información secundaria |
| `genreIds` | TMDB | Filtrado o trazabilidad |
| `adult` | TMDB | Restricción de contenido si aplica |
| `lifeArea` | MindCinema | Clasificación principal para recomendación |

### Ejemplo JSON

```json
{
  "id": 603,
  "title": "The Matrix",
  "originalTitle": "The Matrix",
  "overview": "A computer hacker learns about the true nature of reality.",
  "releaseDate": "1999-03-30",
  "releaseYear": 1999,
  "posterPath": "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  "backdropPath": "/ncEsesgOJDNrTUED89hYbA117wo.jpg",
  "voteAverage": 8.2,
  "voteCount": 26000,
  "popularity": 72.5,
  "originalLanguage": "en",
  "genreIds": [28, 878],
  "adult": false,
  "lifeArea": "personal"
}
```

### Nota sobre imágenes

`posterPath` y `backdropPath` guardan solo el path devuelto por TMDB. La URL completa se construye en frontend:

```ts
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function getPosterUrl(posterPath: string | null): string | null {
  return posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null;
}
```

---

## 5. Modelo `LifeAreaQuestion`

Representa una pregunta del test asociada a un área concreta.

### TypeScript

```ts
export interface LifeAreaQuestion {
  id: string;
  lifeArea: LifeArea;
  order: number;
  text: string;
}
```

### Reglas

- Deben existir exactamente 4 preguntas por área en el MVP
- `id` debe ser estable para usarlo como key en React y para guardar respuestas
- `order` permite asegurar el orden de render

### Ejemplo

```ts
export const lifeAreaQuestions: LifeAreaQuestion[] = [
  {
    id: "personal-1",
    lifeArea: "personal",
    order: 1,
    text: "Consumo contenido que me hace pensar y crecer.",
  },
  {
    id: "personal-2",
    lifeArea: "personal",
    order: 2,
    text: "Tomo acción cuando algo en mi vida no me encaja.",
  },
];
```

---

## 6. Modelo `TestResult`

`TestResult` representa el resultado del flujo de exploración profunda.

### Escala de respuesta

- `yes` = `1`
- `sometimes` = `0.5`
- `no` = `0`

### TypeScript

```ts
export type QuestionAnswer = "yes" | "sometimes" | "no";
// UI labels:
// yes -> "Sí"
// sometimes -> "A veces"
// no -> "No"

export interface AreaAnswer {
  questionId: string;
  answer: QuestionAnswer;
  value: 0 | 0.5 | 1;
}

export interface AreaScore {
  lifeArea: LifeArea;
  score: number;
  maxScore: 4;
  answers: AreaAnswer[];
}

export interface TestResult {
  areaScores: AreaScore[];
  recommendedAreas: LifeArea[];
}
```

### Reglas de negocio

- El test recorre las 9 áreas de vida
- Cada área contiene 4 preguntas
- La puntuación de cada área va de `0` a `4`
- Se recomiendan películas de las `2` o `3` áreas con menor puntuación

### Criterio recomendado para `recommendedAreas`

- Ordenar las 9 áreas por puntuación ascendente
- Recomendar por defecto las 2 áreas con menor puntuación
- En caso de empate en la frontera, se puede incluir una tercera área para no cortar artificialmente

### Ejemplo JSON

```json
{
  "areaScores": [
    {
      "lifeArea": "salud",
      "score": 2.5,
      "maxScore": 4,
      "answers": [
        { "questionId": "salud-1", "answer": "sometimes", "value": 0.5 },
        { "questionId": "salud-2", "answer": "yes", "value": 1 },
        { "questionId": "salud-3", "answer": "no", "value": 0 },
        { "questionId": "salud-4", "answer": "yes", "value": 1 }
      ]
    },
    {
      "lifeArea": "familia",
      "score": 1.5,
      "maxScore": 4,
      "answers": [
        { "questionId": "familia-1", "answer": "yes", "value": 1 },
        { "questionId": "familia-2", "answer": "no", "value": 0 },
        { "questionId": "familia-3", "answer": "no", "value": 0 },
        { "questionId": "familia-4", "answer": "sometimes", "value": 0.5 }
      ]
    },
    {
      "lifeArea": "personal",
      "score": 4,
      "maxScore": 4,
      "answers": [
        { "questionId": "personal-1", "answer": "yes", "value": 1 },
        { "questionId": "personal-2", "answer": "yes", "value": 1 },
        { "questionId": "personal-3", "answer": "sometimes", "value": 0.5 },
        { "questionId": "personal-4", "answer": "yes", "value": 1 }
      ]
    }
  ],
  "recommendedAreas": ["familia", "salud"]
}
```

### Función de cálculo sugerida

```ts
export function getAnswerValue(answer: QuestionAnswer): 0 | 0.5 | 1 {
  if (answer === "yes") return 1;
  if (answer === "sometimes") return 0.5;
  return 0;
}

export function calculateAreaScore(answers: AreaAnswer[]): number {
  return answers.reduce((sum, item) => sum + item.value, 0);
}

export function getRecommendedAreas(areaScores: AreaScore[]): LifeArea[] {
  const sorted = [...areaScores].sort((a, b) => a.score - b.score);

  if (sorted.length <= 2) {
    return sorted.map((item) => item.lifeArea);
  }

  const firstTwo = sorted.slice(0, 2);
  const third = sorted[2];
  const secondScore = firstTwo[1].score;

  // If the 2nd and 3rd areas are tied, include both to avoid arbitrary cutoffs.
  if (third.score === secondScore) {
    return sorted.slice(0, 3).map((item) => item.lifeArea);
  }

  return firstTwo.map((item) => item.lifeArea);
}
```

---

## 7. Transformación TMDB -> MindCinema

La app no debería renderizar directamente la respuesta cruda de TMDB. La recomendación es transformarla a `Movie` en una capa explícita de normalización.

### Entrada TMDB relevante

Campos habituales de TMDB usados en listados:

```ts
export interface TmdbMovie {
  id: number;
  title: string;
  original_title?: string;
  overview?: string;
  release_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  original_language?: string;
  genre_ids?: number[];
  adult?: boolean;
}
```

### Regla de transformación

```ts
export function mapTmdbMovieToMovie(
  tmdbMovie: TmdbMovie,
  lifeArea: LifeArea
): Movie {
  const releaseDate = tmdbMovie.release_date || null;
  const releaseYear = releaseDate ? Number(releaseDate.slice(0, 4)) : null;

  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    originalTitle: tmdbMovie.original_title ?? null,
    overview: tmdbMovie.overview ?? null,
    releaseDate,
    releaseYear: Number.isFinite(releaseYear) ? releaseYear : null,
    posterPath: tmdbMovie.poster_path ?? null,
    backdropPath: tmdbMovie.backdrop_path ?? null,
    voteAverage: tmdbMovie.vote_average ?? null,
    voteCount: tmdbMovie.vote_count ?? null,
    popularity: tmdbMovie.popularity ?? null,
    originalLanguage: tmdbMovie.original_language ?? null,
    genreIds: tmdbMovie.genre_ids ?? [],
    adult: tmdbMovie.adult ?? false,
    lifeArea,
  };
}
```

### Reglas concretas de mapeo

1. `tmdbMovie.id` pasa directamente a `id`
2. `releaseYear` se deriva de `release_date`
3. Campos ausentes en TMDB se normalizan a `null` o `[]`
4. `lifeArea` no viene de TMDB: se asigna en MindCinema según la lógica editorial del producto

### Sobre `lifeArea`

TMDB no sabe nada de las áreas de vida de MindCinema. Por tanto, `lifeArea` debe definirse por una regla propia del producto, por ejemplo:

- catálogo curado manualmente
- mapeo por listas predefinidas
- mapeo por descubrimiento temático en frontend

Para el MVP, basta con que cada película se asocie a una única área principal.

---

## 8. Casos límite y decisiones de normalización

### `posterPath` nulo

Si `posterPath` es `null`:

- mostrar placeholder en `MovieCard`
- no bloquear el render de la película

### `backdropPath` nulo

Si `backdropPath` es `null`:

- usar poster como fallback si existe
- o usar fondo neutro en la vista detalle

### `releaseDate` ausente o vacía

Si no hay fecha:

- `releaseDate = null`
- `releaseYear = null`
- en UI mostrar `"Fecha no disponible"` o solo ocultar el año

### `overview` nulo o vacío

Si no hay sinopsis:

- mantener `overview = null`
- en UI mostrar texto fallback breve

### `voteAverage` o `voteCount` ausentes

Si faltan datos de rating:

- no forzar `0`, usar `null`
- en UI ocultar rating o mostrar `"Sin valoraciones"`

### `genreIds` ausente

Si TMDB no devuelve géneros:

- usar `[]`
- nunca `null`, para simplificar filtros

### `originalTitle` igual a `title`

Aunque puedan coincidir:

- se puede conservar ambos campos
- en UI no es necesario mostrar `originalTitle` si no aporta valor

### `adult` ausente

Si el campo no llega:

- normalizar a `false`

### Datos incompletos del test

Si el usuario abandona el test antes de terminar un área:

- no generar `TestResult` final
- mantener respuestas parciales como estado temporal de UI

---

## 9. Ejemplo mínimo de uso en React

```ts
export interface MoviesByArea {
  [key: string]: Movie[];
}

export interface DeepRecommendationViewModel {
  result: TestResult;
  movies: Movie[];
}
```

Ejemplo de flujo:

1. El usuario recorre el test completo
2. El frontend carga `LifeAreaQuestion[]`
3. Se calculan `areaScores`
4. Se obtienen `recommendedAreas`
5. Se filtran o solicitan películas y se normalizan a `Movie[]`

---

## 10. Resumen de dominio vs estado de UI

### Modelo de dominio

Pertenece al dominio de MindCinema y debería ser reutilizable fuera de componentes:

- `LifeArea`
- `Movie`
- `LifeAreaQuestion`
- `TestResult`
- funciones de transformación y cálculo

### Estado de UI

Pertenece a la interacción de pantalla y no al modelo de negocio:

- área actualmente seleccionada en un botón
- paso actual del test
- modal abierto o cerrado
- loading, error y empty states
- respuestas parciales todavía no confirmadas
- orden visual o filtros temporales de una vista

### Regla práctica

Si un dato define el significado de la recomendación o de una película en MindCinema, es **modelo de dominio**. Si solo existe para pintar, navegar o manejar la interacción del usuario, es **estado de UI**.
