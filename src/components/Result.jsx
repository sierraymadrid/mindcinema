import { useEffect, useRef, useState } from "react";
import { recommendationsByMood } from "../data/recommendations";
import {
  fetchMovieDetails,
  TMDB_IMAGE_BASE_URL,
} from "../services/tmdb";

function Result({ mood, onBack }) {
  const recommendation = recommendationsByMood[mood];
  const movies = recommendation?.movies || [];
  const carouselRef = useRef(null);
  const [displayMovies, setDisplayMovies] = useState(movies);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);

  console.log(
    `VITE_TMDB_API_KEY available: ${Boolean(import.meta.env.VITE_TMDB_API_KEY)}`
  );

  useEffect(() => {
    let isCancelled = false;

    setDisplayMovies(movies);

    async function enrichMovies() {
      if (!movies.length || !import.meta.env.VITE_TMDB_API_KEY) {
        return;
      }

      setIsLoadingMovies(true);

      try {
        const nextMovies = await Promise.all(
          movies.map(async (movie) => {
            try {
              const details = await fetchMovieDetails(movie.tmdbId);

              if (!details) {
                console.log(
                  `[Result] no TMDB details, using fallback: movieId=${movie.id}`
                );
                return movie;
              }

              const enrichedMovie = {
                ...movie,
                image: details.posterPath
                  ? `${TMDB_IMAGE_BASE_URL}${details.posterPath}`
                  : movie.image,
                overview: details.overview?.trim() || movie.overview,
              };

              console.log(
                `[Result] enriched movie: movieId=${enrichedMovie.id} hasImage=${Boolean(
                  enrichedMovie.image
                )} image=${enrichedMovie.image || "none"}`
              );

              return enrichedMovie;
            } catch {
              console.log(
                `[Result] TMDB fetch failed, using fallback: movieId=${movie.id}`
              );
              return movie;
            }
          })
        );

        if (!isCancelled) {
          console.log(
            `[Result] displayMovies updated: ${JSON.stringify(
              nextMovies.map((movie) => ({
                id: movie.id,
                hasImage: Boolean(movie.image),
                image: movie.image || null,
              }))
            )}`
          );
          setDisplayMovies(nextMovies);
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
  }, [movies]);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    const { clientWidth } = carouselRef.current;
    carouselRef.current.scrollBy({
      left: direction * clientWidth * 0.72,
      behavior: "smooth",
    });
  };

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
              CINE PARA CRECER
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl md:text-[3.1rem]">
              {recommendation?.title || "Para ti, hoy"}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
              {recommendation?.subtitle ||
                "Cuatro elecciones distintas, ordenadas con un criterio claro para este momento."}
            </p>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-center justify-end gap-2">
              {isLoadingMovies ? (
                <p className="mr-auto text-[0.68rem] uppercase tracking-[0.2em] text-white/34">
                  Actualizando fichas
                </p>
              ) : null}

              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scrollCarousel(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/72 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Ver recomendaciones anteriores"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/72 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Ver más recomendaciones"
                >
                  →
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 pr-12 sm:-mx-10 sm:px-10 sm:pr-16 lg:pr-28"
            >
              {displayMovies.slice(0, 4).map((movie) => (
                <article
                  key={movie.id}
                  className="w-[86vw] max-w-[26rem] shrink-0 snap-start rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:w-[30rem] lg:w-[calc((100%-2.5rem)/3.28)]"
                >
                  <div className="relative flex aspect-[5/4] items-end overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13] p-5">
                    {movie.image ? (
                      <>
                        <img
                          src={movie.image}
                          alt={`Poster de ${movie.title}`}
                          className="absolute inset-0 z-0 h-full w-full object-cover brightness-110"
                          loading="lazy"
                          onLoad={() =>
                            console.log(
                              `[Result] image loaded: movieId=${movie.id} src=${movie.image}`
                            )
                          }
                          onError={() =>
                            console.log(
                              `[Result] image failed: movieId=${movie.id} src=${movie.image}`
                            )
                          }
                        />
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#05070b]/60 via-[#05070b]/24 to-transparent" />
                      </>
                    ) : null}

                    <div className="relative z-20 w-full">
                      <div className="inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-[#d7c29d]">
                        {movie.type}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <h2 className="text-[1.7rem] font-semibold leading-tight text-white">
                      {movie.title}
                    </h2>
                    <p className="mt-3 max-w-[34ch] text-sm leading-6 text-white/68">
                      {movie.reason}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Result;
