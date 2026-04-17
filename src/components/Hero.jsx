import { useEffect, useMemo, useState } from "react";
import lifeAreas from "../data/lifeAreas";
import { fetchMovieDetails, TMDB_IMAGE_BASE_URL } from "../services/tmdb";
import MovieGrid from "./MovieGrid";
import Container from "./layout/Container";
import {
  decorateAreaMoviesWithPosters,
  getHomeAreaMovies,
} from "../recommendations/areaRecommendations";
import { getAreaDisplayTitle, getAreaPath } from "../utils/lifeAreas";

const rowMovieCount = 9;

function Hero({ onQuickStart, onExploreMoment }) {
  const [moviePostersById, setMoviePostersById] = useState({});

  const featuredAreas = useMemo(
    () =>
      lifeAreas.map((area) => {
        const rowMovies = getHomeAreaMovies(area.key, { limit: rowMovieCount });

        return {
          ...area,
          displayTitle: getAreaDisplayTitle(area),
          movies: decorateAreaMoviesWithPosters(rowMovies, moviePostersById),
        };
      }),
    [moviePostersById]
  );

  const featuredTmdbIds = useMemo(
    () =>
      featuredAreas
        .flatMap((area) => area.movies)
        .map((movie) => movie.tmdbId)
        .filter(Boolean),
    [featuredAreas]
  );
  const featuredTmdbIdsKey = featuredTmdbIds.join(",");
  const heroBackdropMovies = featuredAreas[0]?.movies.slice(0, 3) || [];

  useEffect(() => {
    let isCancelled = false;

    async function enrichPosters() {
      const missingIds = featuredTmdbIds.filter(
        (tmdbId) => !(tmdbId in moviePostersById)
      );

      if (!missingIds.length) {
        return;
      }

      const posterEntries = await Promise.all(
        missingIds.map(async (tmdbId) => {
          try {
            const details = await fetchMovieDetails(tmdbId);
            return [tmdbId, details?.posterPath || null];
          } catch {
            return [tmdbId, null];
          }
        })
      );

      if (!isCancelled) {
        setMoviePostersById((currentPosters) => ({
          ...currentPosters,
          ...Object.fromEntries(posterEntries),
        }));
      }
    }

    enrichPosters();

    return () => {
      isCancelled = true;
    };
  }, [featuredTmdbIds, featuredTmdbIdsKey, moviePostersById]);

  return (
    <main className="relative overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/4 top-[-8rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-amber-300/6 blur-[5rem]" />
        <div className="absolute right-1/4 top-1/3 h-[24rem] w-[24rem] translate-x-1/2 rounded-full bg-sky-400/5 blur-[5rem]" />
        <div className="absolute bottom-[-4rem] left-1/3 h-[20rem] w-[20rem] translate-x-1/2 rounded-full bg-orange-400/4 blur-[4rem]" />
        <div className="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_70%)]" />

        {heroBackdropMovies.map((movie, index) => {
          const positions = [
            "left-[8%] top-20 rotate-[-5deg] scale-95",
            "left-1/2 top-12 -translate-x-1/2 rotate-[2deg]",
            "right-[8%] top-24 rotate-[6deg] scale-95",
          ];

          return (
            <div
              key={`hero-poster-${movie.tmdbId}`}
              className={`absolute hidden h-[18rem] w-[12rem] overflow-hidden rounded-[20px] border border-white/5 opacity-12 blur-[3px] lg:block ${positions[index] || ""}`}
            >
              {movie.posterPath ? (
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
                  alt=""
                  className="h-full w-full object-cover brightness-50 saturate-0"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
              )}
            </div>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-b from-[#05070b]/10 via-[#05070b]/30 to-[#05070b]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/70 to-[#05070b]/10" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 py-14 sm:py-16">
        <section className="py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-6 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
                CINE PARA CRECER
              </p>

              <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl md:text-6xl md:leading-[1.02] lg:text-7xl">
                La película adecuada, en el momento adecuado
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
                Para esas noches en las que no sabes qué ver, pero sabes que quieres algo
                con sentido.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={onQuickStart}
                  className="inline-flex w-full min-w-0 items-center justify-center rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))] hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c39b] sm:min-w-[220px] sm:w-auto"
                >
                  Recomendación rápida
                </button>

                <button
                  type="button"
                  onClick={onExploreMoment}
                  className="inline-flex w-full min-w-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:min-w-[220px] sm:w-auto"
                >
                  Explorar tu momento
                </button>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <div className="space-y-10 sm:space-y-12">
              {featuredAreas.map((area) => (
                <MovieGrid
                  key={area.key}
                  areaKey={area.key}
                  areaTitle={area.displayTitle}
                  movies={area.movies}
                  ctaLabel="Ver más"
                  ctaTo={getAreaPath(area.key)}
                  layout="row"
                />
              ))}
            </div>
          </Container>
        </section>

        <section className="py-8 sm:py-10">
          <Container>
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
              <p className="mx-auto max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
                Si ya sabes qué necesitas, puedes decidir en un momento. Si prefieres
                entender mejor dónde estás antes de elegir, entra en la exploración de tu
                momento.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={onQuickStart}
                  className="inline-flex w-full min-w-0 items-center justify-center rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))] sm:min-w-[220px] sm:w-auto"
                >
                  Recomendación rápida
                </button>

                <button
                  type="button"
                  onClick={onExploreMoment}
                  className="inline-flex w-full min-w-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white sm:min-w-[220px] sm:w-auto"
                >
                  Explorar tu momento
                </button>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </main>
  );
}

export default Hero;
