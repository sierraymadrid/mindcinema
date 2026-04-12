import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import lifeAreas from "../data/lifeAreas";
import moviesByArea from "../data/deepRecommendations";
import {
  fetchMovieDetailPage,
  TMDB_BACKDROP_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from "../services/tmdb";

function sortProvidersByPriority(providers = []) {
  return [...providers].sort(
    (left, right) => (left.display_priority || 999) - (right.display_priority || 999)
  );
}

function ProviderGroup({ title, providers }) {
  if (!providers.length) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-medium tracking-[0.08em] text-white/88">
        {title}
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {providers.map((provider) => (
          <div
            key={`${title}-${provider.provider_id}`}
            className="rounded-[18px] border border-white/8 bg-white/[0.02] p-3"
          >
            <div className="flex items-center gap-3">
              {provider.logo_path ? (
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="h-11 w-11 rounded-xl object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
                  N/A
                </div>
              )}

              <p className="text-sm leading-5 text-white/72">{provider.provider_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const areaLabelOverrides = {
  personal: "Desarrollo personal",
};

const lifeAreaByKey = Object.fromEntries(lifeAreas.map((area) => [area.key, area]));
const areaTitleToKey = Object.fromEntries(
  lifeAreas.map((area) => [area.title.toLowerCase(), area.key])
);
const movieAreaIndex = Object.entries(moviesByArea).reduce((accumulator, [areaKey, movies]) => {
  movies.forEach((movie) => {
    if (!(movie.tmdbId in accumulator)) {
      accumulator[movie.tmdbId] = [];
    }

    if (!accumulator[movie.tmdbId].includes(areaKey)) {
      accumulator[movie.tmdbId].push(areaKey);
    }
  });

  return accumulator;
}, {});

function formatLifeArea(areaKey) {
  const area = lifeAreaByKey[areaKey];

  if (!area) {
    return null;
  }

  return {
    key: area.key,
    title: areaLabelOverrides[area.key] || area.title,
  };
}

function resolveLifeAreas(tmdbId, fallbackState) {
  const stateAreas = Array.isArray(fallbackState?.lifeArea)
    ? fallbackState.lifeArea
    : fallbackState?.lifeArea
      ? [fallbackState.lifeArea]
      : [];

  const normalizedStateAreas = stateAreas
    .map((areaValue) => {
      if (lifeAreaByKey[areaValue]) {
        return areaValue;
      }

      if (typeof areaValue === "string") {
        return areaTitleToKey[areaValue.toLowerCase()] || null;
      }

      return null;
    })
    .filter(Boolean);

  const resolvedAreaKeys = normalizedStateAreas.length
    ? normalizedStateAreas
    : movieAreaIndex[tmdbId] || [];

  return resolvedAreaKeys.map(formatLifeArea).filter(Boolean);
}

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
  const watchProviders = {
    flatrate: sortProvidersByPriority(regionProviders?.flatrate || []),
    rent: sortProvidersByPriority(regionProviders?.rent || []),
    buy: sortProvidersByPriority(regionProviders?.buy || []),
  };
  const hasWatchProviders =
    watchProviders.flatrate.length > 0 ||
    watchProviders.rent.length > 0 ||
    watchProviders.buy.length > 0;
  const lifeAreas = resolveLifeAreas(data.id, fallbackState);

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
    hasWatchProviders,
    watchRegion: selectedRegion,
    watchLink: regionProviders?.link || null,
    trailerKey: trailer?.key || null,
    lifeAreas,
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
  const [retryKey, setRetryKey] = useState(0);

  function handleBack() {
    const fallbackRoute =
      typeof location.state?.from === "string" ? location.state.from : "/";

    navigate(fallbackRoute);
  }

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
  }, [id, location.state, retryKey]);

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
  const scrollToProviders = () =>
    document
      .getElementById("watch-providers")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

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
          onClick={handleBack}
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
              Inténtalo de nuevo o vuelve al inicio para seguir explorando.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setRetryKey((currentKey) => currentKey + 1)}
                className="inline-flex rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
              >
                Reintentar
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        ) : null}

        {status === "ready" && movieDetail ? (
          <div className="space-y-12 sm:space-y-14">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/76 to-[#05070b]/24" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070b]/92 via-[#05070b]/60 to-transparent" />
              </div>

              <div className="relative z-10 min-h-[34rem] px-6 py-8 sm:min-h-[40rem] sm:px-8 sm:py-10 lg:min-h-[44rem] lg:px-10">
                <div className="flex min-h-[inherit] items-end">
                  <div className="grid w-full gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-end lg:gap-10">
                    <div className="hidden lg:block">
                      <div className="w-[220px] rounded-[26px] border border-white/12 bg-[#0f131a]/78 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13]">
                          {movieDetail.posterUrl ? (
                            <img
                              src={movieDetail.posterUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">
                                MindCinema
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

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
                        onClick={scrollToProviders}
                        className="mt-8 inline-flex rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
                      >
                        Ver plataformas disponibles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                ÁREA DE VIDA
              </p>

              {movieDetail.lifeAreas.length ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {movieDetail.lifeAreas.map((area) => (
                    <Link
                      key={area.key}
                      to={`/areas/${area.key}`}
                      className="inline-flex rounded-full border border-[#d8c39b]/16 bg-[#d8c39b]/7 px-4 py-2 text-[0.76rem] font-medium uppercase tracking-[0.18em] text-[#dcc79f] transition hover:border-[#d8c39b]/34 hover:bg-[#d8c39b]/12 hover:text-[#ead9b8]"
                    >
                      {area.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-white/56">
                  Todavía no hemos asociado esta película a un área de vida concreta.
                </p>
              )}
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
              <div className="max-w-4xl">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                  SINOPSIS
                </p>
                <p className="mt-5 text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
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
                    {isOverviewExpanded ? "Mostrar menos" : "Seguir leyendo"}
                  </button>
                ) : null}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                REPARTO PRINCIPAL
              </p>
              {movieDetail.cast.length ? (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {movieDetail.cast.map((actor) => (
                    <button
                      key={actor.id}
                      type="button"
                      className="rounded-[22px] border border-white/10 bg-[#0f131a] p-3 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-[#131922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c39b]"
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
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-base leading-7 text-white/62">
                  Reparto no disponible.
                </p>
              )}
            </section>

            <section
              id="watch-providers"
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8"
            >
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                PLATAFORMAS DISPONIBLES
              </p>

              {movieDetail.hasWatchProviders ? (
                <>
                  <div className="mt-5 space-y-7">
                    <ProviderGroup
                      title="Suscripción"
                      providers={movieDetail.watchProviders.flatrate}
                    />
                    <ProviderGroup
                      title="Alquiler"
                      providers={movieDetail.watchProviders.rent}
                    />
                    <ProviderGroup
                      title="Compra"
                      providers={movieDetail.watchProviders.buy}
                    />
                  </div>

                  {movieDetail.watchLink ? (
                    <a
                      href={movieDetail.watchLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
                    >
                      Elegir plataforma para verla
                    </a>
                  ) : null}
                </>
              ) : (
                <p className="mt-5 text-base leading-7 text-white/62">
                  No disponible en tu región.
                </p>
              )}
            </section>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                  TRÁILER
                </p>

                {movieDetail.trailerKey ? (
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
                ) : (
                  <p className="mt-4 text-sm leading-6 text-white/56">
                    No tenemos un tráiler disponible para esta película por ahora.
                  </p>
                )}
              </section>

              {movieDetail.watchLink ? (
                <div className="flex justify-center">
                  <a
                    href={movieDetail.watchLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
                  >
                    Elegir plataforma para verla
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default MovieDetail;
