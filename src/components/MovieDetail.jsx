import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  fetchMovieDetailPage,
  TMDB_BACKDROP_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from "../services/tmdb";

function normalizeMovieDetail(data, fallbackState) {
  if (!data) {
    return null;
  }

  const cast = (data.credits?.cast || []).slice(0, 5);
  const trailer = (data.videos?.results || []).find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );
  const providersByRegion = data["watch/providers"]?.results || {};
  const selectedRegion =
    providersByRegion.ES ? "ES" : providersByRegion.US ? "US" : null;
  const regionProviders = selectedRegion ? providersByRegion[selectedRegion] : null;
  const watchProviders = [
    ...(regionProviders?.flatrate || []),
    ...(regionProviders?.rent || []),
    ...(regionProviders?.buy || []),
  ].filter(
    (provider, index, providers) =>
      providers.findIndex((item) => item.provider_id === provider.provider_id) === index
  );

  return {
    id: data.id,
    title: data.title || fallbackState?.title || "Película",
    releaseYear: data.release_date ? data.release_date.slice(0, 4) : "—",
    runtime: data.runtime ? `${data.runtime} min` : "Duración no disponible",
    genres: (data.genres || []).slice(0, 3).map((genre) => genre.name),
    rating: data.vote_average ? data.vote_average.toFixed(1) : "—",
    overview:
      data.overview?.trim() ||
      fallbackState?.overview ||
      "Sinopsis no disponible por ahora.",
    backdropUrl: data.backdrop_path
      ? `${TMDB_BACKDROP_BASE_URL}${data.backdrop_path}`
      : data.poster_path
        ? `${TMDB_BACKDROP_BASE_URL}${data.poster_path}`
        : null,
    posterUrl: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : null,
    cast: cast.map((person) => ({
      id: person.id,
      name: person.name,
      profileUrl: person.profile_path
        ? `${TMDB_IMAGE_BASE_URL}${person.profile_path}`
        : null,
    })),
    watchProviders,
    watchRegion: selectedRegion,
    watchLink: regionProviders?.link || null,
    trailerKey: trailer?.key || null,
    imdbUrl: data.external_ids?.imdb_id
      ? `https://www.imdb.com/title/${data.external_ids.imdb_id}/`
      : null,
  };
}

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("loading");
  const [movieDetail, setMovieDetail] = useState(null);
  const [expandedOverviewFor, setExpandedOverviewFor] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadMovie() {
      setStatus("loading");

      try {
        const data = await fetchMovieDetailPage(id);

        if (!isCancelled) {
          setMovieDetail(normalizeMovieDetail(data, location.state));
          setStatus(data ? "ready" : "error");
        }
      } catch {
        if (!isCancelled) {
          setStatus("error");
        }
      }
    }

    loadMovie();

    return () => {
      isCancelled = true;
    };
  }, [id, location.state]);

  const shortOverview = useMemo(() => {
    if (!movieDetail?.overview) {
      return "";
    }

    if (movieDetail.overview.length <= 220) {
      return movieDetail.overview;
    }

    return `${movieDetail.overview.slice(0, 220).trim()}…`;
  }, [movieDetail]);
  const isOverviewExpanded = expandedOverviewFor === id;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 sm:py-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 text-sm text-white/60 transition hover:text-white"
        >
          ← Volver
        </button>

        {status === "loading" ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Cargando detalle
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              Preparando la película
            </h1>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              No disponible
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              No pudimos cargar esta película
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
              Inténtalo de nuevo más tarde o vuelve al resultado para seguir explorando.
            </p>
          </div>
        ) : null}

        {status === "ready" && movieDetail ? (
          <div className="space-y-12 sm:space-y-14">
            <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div className="absolute inset-0">
                {movieDetail.backdropUrl ? (
                  <img
                    src={movieDetail.backdropUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                ) : movieDetail.posterUrl ? (
                  <img
                    src={movieDetail.posterUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/72 to-[#05070b]/28" />
              </div>

              <div className="relative z-10 min-h-[30rem] px-6 py-10 sm:min-h-[36rem] sm:px-8 sm:py-12 lg:min-h-[40rem]">
                <div className="flex min-h-[inherit] items-end">
                <div className="max-w-3xl">
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
                    CINE PARA CRECER
                  </p>

                  <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl md:text-[3.25rem]">
                    {movieDetail.title}
                  </h1>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/72 sm:text-base">
                    <span>{movieDetail.releaseYear}</span>
                    <span>{movieDetail.runtime}</span>
                    <span>{movieDetail.rating} TMDB</span>
                    {movieDetail.genres.map((genre) => (
                      <span key={genre}>{genre}</span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("watch-providers")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="mt-8 inline-flex rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
                  >
                    Donde verla
                  </button>
                </div>
                </div>
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)] lg:items-start">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                  SINOPSIS
                </p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
                  {isOverviewExpanded ? movieDetail.overview : shortOverview}
                </p>
                {movieDetail.overview.length > shortOverview.length ? (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedOverviewFor((current) =>
                        current === id ? null : id
                      )
                    }
                    className="mt-4 text-sm text-white/60 transition hover:text-white"
                  >
                    {isOverviewExpanded ? "Leer menos" : "Leer mas"}
                  </button>
                ) : null}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                  REPARTO
                </p>
                <div className="-mx-1 mt-5 flex gap-4 overflow-x-auto px-1 pb-2">
                  {movieDetail.cast.length ? (
                    movieDetail.cast.map((actor) => (
                      <button
                        key={actor.id}
                        type="button"
                        className="min-w-[132px] rounded-[22px] border border-white/10 bg-[#0f131a] p-3 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-[#131922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c39b]"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] border border-white/8 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13]">
                          {actor.profileUrl ? (
                            <img
                              src={actor.profileUrl}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[0.62rem] uppercase tracking-[0.2em] text-white/35">
                                Actor
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/84">
                          {actor.name}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="text-base leading-7 text-white/62">
                      Reparto no disponible.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section
              id="watch-providers"
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8"
            >
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                DONDE VERLA
              </p>

              {movieDetail.watchProviders.length ? (
                <div className="mt-5 flex flex-wrap gap-4">
                  {movieDetail.watchProviders.map((provider) => (
                    <a
                      key={provider.provider_id}
                      href={movieDetail.watchLink || "#"}
                      target={movieDetail.watchLink ? "_blank" : undefined}
                      rel={movieDetail.watchLink ? "noreferrer" : undefined}
                      className="rounded-2xl border border-white/10 bg-[#0f131a] px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-[#131922]"
                      onClick={(event) => {
                        if (!movieDetail.watchLink) {
                          event.preventDefault();
                        }
                      }}
                    >
                      {provider.logo_path ? (
                        <img
                          src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="h-12 w-12 rounded-xl object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-[0.6rem] uppercase tracking-[0.18em] text-white/35">
                          N/A
                        </div>
                      )}
                      <p className="mt-3 max-w-[84px] text-xs leading-5 text-white/72">
                        {provider.provider_name}
                      </p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-base leading-7 text-white/62">
                  No disponible en tu region.
                </p>
              )}
            </section>

            {movieDetail.trailerKey ? (
              <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                  TRAILER
                </p>
                <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10">
                  <div className="aspect-video">
                    <iframe
                      title={`Trailer de ${movieDetail.title}`}
                      src={`https://www.youtube.com/embed/${movieDetail.trailerKey}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </section>
            ) : null}

            <section className="flex flex-wrap items-center gap-3">
              {movieDetail.imdbUrl ? (
                <a
                  href={movieDetail.imdbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-white/52 transition hover:text-white"
                >
                  Ver en IMDb
                </a>
              ) : null}

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                Volver
              </button>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default MovieDetail;
