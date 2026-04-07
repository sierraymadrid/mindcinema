export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

export async function fetchMovieDetails(tmdbId) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  if (!apiKey || !tmdbId) {
    return null;
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=es-ES&api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed for movie ${tmdbId}`);
  }

  const data = await response.json();

  return {
    overview: data.overview || "",
    posterPath: data.poster_path || "",
  };
}

export async function fetchMovieDetailPage(tmdbId) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  if (!apiKey || !tmdbId) {
    return null;
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=videos,credits,watch/providers,external_ids&language=es-ES&api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`TMDB detail request failed for movie ${tmdbId}`);
  }

  return response.json();
}
