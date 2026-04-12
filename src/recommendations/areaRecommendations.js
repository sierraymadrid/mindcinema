import moviesByArea from "../data/deepRecommendations";

function dedupeMoviesByTmdbId(movies) {
  return Array.from(
    new Map(
      movies
        .filter(Boolean)
        .map((movie) => [movie.tmdbId, movie])
    ).values()
  );
}

function getAreaMovies(areaKey) {
  return moviesByArea[areaKey] || [];
}

function fillWithCatalog(primaryMovies, catalog, limit) {
  const primaryMovieIds = new Set(primaryMovies.map((movie) => movie.tmdbId));
  const fillerMovies = catalog
    .filter((movie) => !primaryMovieIds.has(movie.tmdbId))
    .slice(0, Math.max(limit - primaryMovies.length, 0));

  return [...primaryMovies, ...fillerMovies].slice(0, limit);
}

export function getAreaMovieArchiveMap() {
  return moviesByArea;
}

export function getAreaMovieArchive(areaKey) {
  return getAreaMovies(areaKey);
}

export function getAreaMovieCatalog() {
  return dedupeMoviesByTmdbId(Object.values(moviesByArea).flat());
}

export function getHomeAreaMovies(areaKey, options = {}) {
  const { limit = 9, catalog = [] } = options;
  const primaryMovies = getAreaMovieArchive(areaKey).slice(0, 3);

  return fillWithCatalog(primaryMovies, catalog, limit);
}

export function getDeepAreaMovies(areaKey, options = {}) {
  const { limit = 3 } = options;

  return getAreaMovieArchive(areaKey).slice(0, limit);
}

export function getAreaMovieIds(areaKey, options = {}) {
  const { scope = "archive", limit, catalog = [] } = options;

  const movies =
    scope === "home"
      ? getHomeAreaMovies(areaKey, { limit, catalog })
      : scope === "deep"
        ? getDeepAreaMovies(areaKey, { limit })
        : getAreaMovieArchive(areaKey);

  return movies
    .map((movie) => movie.tmdbId)
    .filter(Boolean);
}

export function decorateAreaMoviesWithPosters(movies, posterMap = {}) {
  return movies.map((movie) => ({
    ...movie,
    posterPath: posterMap[movie.tmdbId] || null,
  }));
}
