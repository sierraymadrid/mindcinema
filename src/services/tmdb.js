export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export async function fetchMovieDetails(tmdbId) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  if (!apiKey || !tmdbId) {
    return null;
  }

  console.log(`[TMDB] fetchMovieDetails called: tmdbId=${tmdbId}`);

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=es-ES&api_key=${apiKey}`
  );

  console.log(
    `[TMDB] response status: tmdbId=${tmdbId} status=${response.status} ok=${response.ok}`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed for movie ${tmdbId}`);
  }

  const data = await response.json();

  console.log(
    `[TMDB] posterPath present: tmdbId=${tmdbId} hasPosterPath=${Boolean(
      data.poster_path
    )} posterPath=${data.poster_path || "none"}`
  );

  return {
    overview: data.overview || "",
    posterPath: data.poster_path || "",
  };
}
