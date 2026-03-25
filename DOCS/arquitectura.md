# Arquitectura - MindCinema

## 1. Visión General del Sistema

MindCinema es una aplicación web que actúa como guía inteligente de películas. Su propósito es ayudarte a encontrar películas con sentido según dos patrones de uso:

- **Entrada rápida**: necesitas una película ahora, cuéntame cómo te sientes
- **Entrada profunda**: quiero explorar mi crecimiento en áreas específicas de mi vida

El sistema es un **frontend puro** sin autenticación ni persistencia. Los datos vienen de TMDB API y se organizan en torno a las 8 áreas de vida.

### Principios de Diseño

1. **Simplicidad**: Una entrada clara, dos caminos posibles
2. **Velocidad**: Desde pantalla inicial a recomendación en 3 clics máximo (ruta rápida)
3. **Significado**: Cada película está vinculada a un área de reflexión real
4. **Sin dependencias de backend**: Todo funciona con TMDB API + frontend

---

## 2. Diagrama de Flujo del Sistema

```mermaid
graph TD
    A["🎬 Usuario Llega"] --> B{Elige Ruta}
    
    B -->|"Ruta Rápida"| C["🎭 QuickMood<br/>¿Cómo te sientes?"]
    B -->|"Ruta Profunda"| D["🎯 AreaSelector<br/>Elige hasta 3 áreas"]
    
    C --> E["🎬 MovieGrid<br/>Películas Recomendadas"]
    
    D --> F["📝 Test<br/>5 preguntas por área<br/>Sí / A veces / No"]
    F --> G["📊 ResultScreen<br/>Puntuación por área<br/>Análisis"]
    G --> E
    
    E --> H["🎬 MovieCard<br/>Vista previa"]
    H -->|Click| I["🎞️ MovieDetail<br/>Sinopsis completa<br/>Información TMDB"]
    
    I --> J["⭐ Usuario ve película"]
    E --> J
    
    style A fill:#2563eb,color:#fff
    style C fill:#7c3aed,color:#fff
    style D fill:#7c3aed,color:#fff
    style F fill:#d97706,color:#fff
    style G fill:#16a34a,color:#fff
    style E fill:#0891b2,color:#fff
    style I fill:#059669,color:#fff
```

---

## 3. Arquitectura de Componentes

### Estructura General

```
App
├── Hero
├── Router/Navigation
│   ├── QuickPath
│   │   ├── QuickMood
│   │   └── MovieGrid
│   └── DeepPath
│       ├── AreaSelector
│       ├── Test
│       ├── ResultScreen
│       └── MovieGrid
├── MovieGrid
│   ├── MovieCard (x N)
│   │   └── MovieDetail (modal/página)
└── Footer
```

---

## 4. Descripción Detallada de Componentes

### 4.1 Hero
**Propósito**: Pantalla de bienvenida y selección de ruta  
**Props**: Ninguno  
**Estado Local**: Ninguno  
**Responsabilidades**:
- Mostrar el claim y frase hero de MindCinema
- Presentar dos botones: "Ruta Rápida" y "Exploración Profunda"
- Navegar a `/quick` o `/deep`

**Flujo Visual**:
```
┌─────────────────────────────┐
│     MindCinema              │
│   Cine para crecer          │
│                             │
│ Para las noches en que...   │
│                             │
│ [ Ruta Rápida ] [Profunda ] │
└─────────────────────────────┘
```

---

### 4.2 QuickMood
**Propósito**: Capturar el estado emocional del usuario para recomendación rápida  
**Props**: `onMoodSelect(moodArea: string)`  
**Estado Local**: `selectedMood`  
**Responsabilidades**:
- Mostrar 8 áreas de vida como botones
- Capturar selección del usuario
- Pasar el área a MovieGrid

**Lógica**:
- Usuario hace clic en un área
- Se ejecuta búsqueda en TMDB con películas de esa área
- Se navega a MovieGrid con resultados

---

### 4.3 AreaSelector
**Propósito**: Permitir selección de hasta 3 áreas para exploración profunda  
**Props**: `onAreasSelect(areas: string[])`  
**Estado Local**: `selectedAreas: string[]`  
**Responsabilidades**:
- Mostrar 8 áreas de vida
- Permitir selección múltiple (máx 3)
- Validar selección
- Pasar áreas seleccionadas al Test

**Validación**:
- Mínimo 1 área
- Máximo 3 áreas

---

### 4.4 Test
**Propósito**: Evaluación de reflexión en cada área seleccionada  
**Props**: `areas: string[]`  
**Estado Local**: 
```javascript
{
  currentAreaIndex: number,
  answers: { [area]: [response, response, response, response, response] },
  isComplete: boolean
}
```
**Responsabilidades**:
- Mostrar 5 preguntas por área
- Capturar respuestas (Sí = 2, A veces = 1, No = 0)
- Calcular puntuación por área
- Pasar resultados a ResultScreen

**Preguntas por Área** (ejemplo):
- **Espiritual**: ¿Te sientes conectado con lo que importa? ¿Tienes claridad en tus valores? etc.
- **Salud**: ¿Cuidas tu bienestar físico? ¿Duermes bien? etc.
- **Vocación**: ¿Tu trabajo te motiva? ¿Ves futuro en tu carrera? etc.
- **Finanzas**: ¿Tienes control de tu dinero? ¿Ahorras? etc.
- **Relaciones**: ¿Tienes conexiones significativas? ¿Cultivas relaciones? etc.
- **Entorno**: ¿Disfrutas tu entorno? ¿Te sientes parte de tu comunidad? etc.
- **Aventura**: ¿Exploración es parte de tu vida? ¿Buscas nuevas experiencias? etc.
- **Mente**: ¿Reflexionas sobre tus pensamientos? ¿Aprendes continuamente? etc.

**Formato de Respuesta**:
```
Sí    = 2 puntos
A veces = 1 punto
No   = 0 puntos
```

---

### 4.5 ResultScreen
**Propósito**: Mostrar análisis de resultados del test  
**Props**: `results: { [area]: { score: number, percentage: number } }`  
**Estado Local**: Ninguno  
**Responsabilidades**:
- Mostrar puntuación por área en formato visual (gráfico de barras o radar)
- Mostrar análisis breve por área
- Botón para "Ver películas recomendadas"
- Navegar a MovieGrid con áreas como filtro

**Visualización**:
```
Espiritual:   ████████░░ 80%
Salud:        ██████░░░░ 60%
Vocación:     ███████░░░ 70%
...
```

---

### 4.6 MovieGrid
**Propósito**: Mostrar lista de películas recomendadas  
**Props**: `filterArea?: string | string[]`  
**Estado Local**:
```javascript
{
  movies: Movie[],
  loading: boolean,
  error: string | null
}
```
**Responsabilidades**:
- Consumir TMDB API basado en área(s)
- Normalizar respuesta de TMDB
- Mostrar películas en grid
- Navegar a MovieDetail al hacer clic

**Lógica de Filtrado**:
- Si viene de QuickMood: buscar películas de 1 área
- Si viene de Test: buscar películas relevantes a áreas de puntuación alta

---

### 4.7 MovieCard
**Propósito**: Tarjeta individual de película  
**Props**: `movie: Movie, onSelect: (movie: Movie) => void`  
**Estado Local**: Ninguno  
**Responsabilidades**:
- Mostrar poster de película
- Mostrar título y año
- Mostrar rating de TMDB
- Mostrar área de vida asociada
- Trigger a MovieDetail

**Estructura Visual**:
```
┌──────────────┐
│   [Poster]   │
├──────────────┤
│ Título       │
│ ⭐ 7.8/10    │
│ 🎯 Area      │
└──────────────┘
```

---

### 4.8 MovieDetail
**Propósito**: Vista detallada de una película  
**Props**: `movieId: number, onClose: () => void`  
**Estado Local**:
```javascript
{
  movie: MovieDetails,
  loading: boolean,
  error: string | null
}
```
**Responsabilidades**:
- Consumir TMDB API para detalles completos
- Mostrar sinopsis, director, elenco, géneros
- Mostrar enlace a TMDB o plataformas (si disponible)
- Permitir cerrar modal o volver a grid

---

## 5. Flujo de Datos Detallado

### 5.1 Data Shape - Movie
```typescript
interface Movie {
  id: number;
  title: string;
  posterPath: string;
  backdropPath: string;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  genres: Genre[];
  lifeArea: LifeArea;  // Espiritual, Salud, Vocación, etc.
}

interface MovieDetails extends Movie {
  director: string;
  cast: Actor[];
  runtime: number;
  tagline: string;
}

type LifeArea = 
  | 'Espiritual'
  | 'Salud'
  | 'Vocación'
  | 'Finanzas'
  | 'Relaciones'
  | 'Entorno'
  | 'Aventura'
  | 'Mente';
```

### 5.2 Flujo: TMDB API → Normalizer → Componente

**Paso 1: Consulta a TMDB**
```javascript
// Ejemplo: buscar películas de área Espiritual
const response = await fetch(
  `https://api.themoviedb.org/3/search/movie?query=spirituality&api_key=${API_KEY}`
);
const data = await response.json();
```

**Paso 2: Normalizar Respuesta**
```javascript
const normalizedMovies = data.results.map(movie => ({
  id: movie.id,
  title: movie.title,
  posterPath: `${TMDB_IMAGE_BASE}${movie.poster_path}`,
  backdropPath: `${TMDB_IMAGE_BASE}${movie.backdrop_path}`,
  overview: movie.overview,
  releaseDate: movie.release_date,
  voteAverage: movie.vote_average,
  lifeArea: assignLifeArea(movie)  // Lógica custom
}));
```

**Paso 3: Enviar a Componente**
```javascript
// MovieGrid recibe movies[] normalizado
<MovieGrid movies={normalizedMovies} />
```

### 5.3 Flujo: Búsqueda por Área
```
AreaSelector → Test → ResultScreen
                        ↓
         Identifica área con mayor puntuación
                        ↓
         Construye query para TMDB
                        ↓
         Busca películas relevantes
                        ↓
         Normaliza y muestra en MovieGrid
```

---

## 6. Decisiones Técnicas Clave

### 6.1 ¿Por qué React 18?
- Suspense y Concurrent Features para mejor UX
- Automatic batching de updates
- Comunidad activa, documentación excelente
- Compatible con hooks modernos

### 6.2 ¿Por qué Vite?
- **Velocidad**: HMR instantáneo, build rápido
- **Ligereza**: Mejor que Webpack para este caso
- **Despliegue simple**: Vercel tiene soporte nativo
- **ESM nativo**: Performance en desarrollo

### 6.3 ¿Por qué TailwindCSS?
- **Utilidad primero**: CSS personalizado sin deuda técnica
- **Consistencia**: Design system built-in
- **Performance**: Purga automática de CSS no usado
- **Velocidad de desarrollo**: Escribir UI es más rápido

### 6.4 ¿Por qué TMDB API y no otra?
- **Base de datos más grande**: millones de películas
- **Documentación clara**: fácil de integrar
- **Tier gratuito**: perfecto para MVP
- **Datos confiables**: IMDb data + comunidad

### 6.5 ¿Por qué no hay backend propio?
- **MVP simple**: no necesitamos persistencia
- **Sin autenticación**: el valor es en la recomendación, no en el usuario
- **Costos más bajos**: solo Vercel, sin servidor backend
- **Velocidad al mercado**: frontend-only es más rápido

### 6.6 ¿Por qué Vercel?
- **Integración con Vite**: deploy en 1 clic
- **CDN global**: acceso rápido desde cualquier lugar
- **Environment variables**: fácil gestión de API keys
- **Preview deployments**: testing de cambios antes de producción

### 6.7 Mapeo de Películas → Áreas de Vida
Las películas se asignan a áreas usando:
1. **Tags/Géneros de TMDB**: película de drama → Relaciones, Mente
2. **Keywords**: película con palabra "money" → Finanzas
3. **Temas**: película sobre salud mental → Mente, Salud
4. **Curatoría manual**: lista hardcoded de películas icónicas por área

**Ejemplo**:
```javascript
const areaKeywords = {
  'Espiritual': ['spiritual', 'purpose', 'meaning', 'faith'],
  'Salud': ['health', 'wellness', 'mental health', 'fitness'],
  'Vocación': ['career', 'passion', 'purpose', 'work'],
  'Finanzas': ['money', 'wealth', 'success', 'business'],
  // ...
};
```

---

## 7. Flujo de Datos Completo (Vista de Árbol)

```
ENTRADA RÁPIDA:
Hero
  ↓ (usuario elige área)
QuickMood
  ↓ (envía área seleccionada)
MovieGrid ← TMDB API (query por área)
  ↓ (usuario hace clic)
MovieDetail ← TMDB API (detalles completos)

ENTRADA PROFUNDA:
Hero
  ↓ (usuario elige ruta profunda)
AreaSelector
  ↓ (usuario elige 3 áreas)
Test
  ↓ (usuario responde 15 preguntas = 5×3)
ResultScreen (muestra puntuaciones)
  ↓ (usuario hace clic en "Ver películas")
MovieGrid ← TMDB API (query por áreas altas)
  ↓ (usuario hace clic)
MovieDetail ← TMDB API (detalles completos)
```

---

## 8. Consideraciones de Performance

### 8.1 Caching
- **API Cache**: Guardar respuestas de TMDB en sessionStorage (30 min)
- **Image Lazy Loading**: Cargar posters bajo demanda
- **Code Splitting**: Cada ruta en chunk separado (QuickPath, DeepPath)

### 8.2 Optimizaciones
- **React.memo**: MovieCard no re-renderiza innecesariamente
- **useCallback**: Event handlers no cambian en cada render
- **Debounce**: Búsquedas en TMDB debounceadas a 500ms
- **Image CDN**: Usar próximos.js Image o Cloudinary para optimizar

### 8.3 Error Handling
- **Fallback UI**: Si TMDB falla, mostrar mensaje amigable
- **Retry Logic**: Reintentar 3 veces con exponential backoff
- **Graceful Degradation**: Mostrar algo incluso sin imágenes

---

## 9. Roadmap Técnico

### Fase 1: MVP (Actual)
- ✅ Arquitectura base
- ⏳ Componentes principales
- ⏳ Integración TMDB
- ⏳ Rutas rápida y profunda

### Fase 2: Mejoras (Post-MVP)
- [ ] Guardar favoritos (localStorage)
- [ ] Compartir recomendaciones (URL encoded)
- [ ] Dark mode
- [ ] PWA (offline)

### Fase 3: Expansión (Futuro)
- [ ] Integración de reviews de usuarios
- [ ] Social: seguir a otros usuarios
- [ ] Watchlist sincronizada
- [ ] API propia para datos curados

---

## 10. Notas para Desarrolladores

1. **Varnames**: Usa inglés para código, español para comentarios
2. **Commits**: Sigue plan_commits.md
3. **Dependencias**: Revisa dependencias.md antes de instalar
4. **API Key**: Usa `.env.local` para TMDB_API_KEY
5. **Testing**: Unit tests para normalizer, E2E para flujos principales

---

*Última actualización: 24 de marzo de 2026*
