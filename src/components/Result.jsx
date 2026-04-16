import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recommendationsByMood } from "../data/recommendations";
import {
  fetchMovieDetails,
  TMDB_IMAGE_BASE_URL,
} from "../services/tmdb";

function ResultMovieCard({ movie }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(!movie.image);

  useEffect(() => {
    setImageFailed(!movie.image);
  }, [movie.image]);

  return (
    <button
      type="button"
      onClick={() =>
        movie.tmdbId &&
        navigate(`/movie/${movie.tmdbId}`, {
          state: {
            from: "/quick/result",
          },
        })
      }
      className="text-left rounded-[24px] border border-white/10 bg-white/[0.03] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c39b] sm:p-3.5"
    >
      <div className="relative flex aspect-[2/3] items-end overflow-hidden rounded-[20px] border border-white/8 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13] p-4">
        {!imageFailed ? (
          <>
            <img
              src={movie.image}
              alt={`Poster de ${movie.title}`}
              className="absolute inset-0 z-0 h-full w-full object-cover brightness-110"
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#05070b]/60 via-[#05070b]/24 to-transparent" />
          </>
        ) : null}

        {imageFailed ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13]">
            <div className="rounded-[18px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-center">
              <span className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">
                MindCinema
              </span>
            </div>
          </div>
        ) : null}

        <div className="relative z-20 w-full">
          <div className="inline-flex rounded-full border border-white/8 bg-black/18 px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-white/58 backdrop-blur-sm">
            {movie.type}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-[1.35rem] font-semibold leading-tight text-white">
          {movie.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/68">
          {movie.reason}
        </p>
      </div>
    </button>
  );
}

function Result({ mood, onBack }) {
  const recommendation = recommendationsByMood[mood];
  const movies = recommendation?.movies || [];
  const [displayMovies, setDisplayMovies] = useState(movies);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [hasMovieUpdateError, setHasMovieUpdateError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    setDisplayMovies(movies);
    setHasMovieUpdateError(false);

    async function enrichMovies() {
      if (!movies.length || !import.meta.env.VITE_TMDB_API_KEY) {
        return;
      }

      setIsLoadingMovies(true);
      let hasFailedRequest = false;

      try {
        const nextMovies = await Promise.all(
          movies.map(async (movie) => {
            try {
              const details = await fetchMovieDetails(movie.tmdbId);

              if (!details) {
                return movie;
              }

              return {
                ...movie,
                image: details.posterPath
                  ? `${TMDB_IMAGE_BASE_URL}${details.posterPath}`
                  : movie.image,
                overview: details.overview?.trim() || movie.overview,
              };
            } catch {
              hasFailedRequest = true;
              return movie;
            }
          })
        );

        if (!isCancelled) {
          setDisplayMovies(nextMovies);
          setHasMovieUpdateError(hasFailedRequest);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingMovies(false);
        }
      }
    }

    enrichMovies();

    return () => {
      isCancelled = true;
    };
  }, [movies, retryKey]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16 sm:px-10 sm:py-20">
        <div className="w-full max-w-5xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-10 text-sm text-white/60 transition hover:text-white"
          >
            ← Volver
          </button>

          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
              RECOMENDACIÓN RÁPIDA
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl md:text-[3.1rem]">
              {recommendation?.title || "Para ti, hoy"}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
              {recommendation?.subtitle ||
                "Cuatro opciones para este momento. Empieza por la que más te llame y decide desde ahí."}
            </p>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-end">
              {isLoadingMovies ? (
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/34 sm:mr-auto">
                  Actualizando fichas
                </p>
              ) : null}

              {!isLoadingMovies && hasMovieUpdateError ? (
                <>
                  <p className="text-sm text-white/46 sm:mr-auto">
                    Algunas fichas no se pudieron actualizar.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRetryKey((currentKey) => currentKey + 1)}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    Reintentar
                  </button>
                </>
              ) : null}
            </div>

            {displayMovies.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
                {displayMovies.slice(0, 4).map((movie) => (
                  <ResultMovieCard
                    key={movie.id}
                    movie={movie}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                  SIN RECOMENDACIONES
                </p>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
                  No encontramos películas para este estado ahora mismo. Puedes volver a
                  elegir otro mood y seguir explorando.
                </p>
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-8 inline-flex rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
                >
                  Volver a elegir
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Result;
