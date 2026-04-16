import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lifeAreas from "../data/lifeAreas";
import { fetchMovieDetails, TMDB_IMAGE_BASE_URL } from "../services/tmdb";
import {
  decorateAreaMoviesWithPosters,
  getAreaMovieIds,
  getDeepAreaMovies,
} from "../recommendations/areaRecommendations";

const wheelSize = 420;
const wheelCenter = wheelSize / 2;
const wheelRadius = 112;
const wheelLabelRadius = 156;
const wheelLevels = 4;
const answerScores = {
  Sí: 1,
  "A veces": 0.5,
  No: 0,
};

function getWheelPoint(index, total, radius) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;

  return {
    x: wheelCenter + Math.cos(angle) * radius,
    y: wheelCenter + Math.sin(angle) * radius,
  };
}

function getAreaPercentage(score) {
  return Math.floor((score / 4) * 100);
}

function getWheelLabelTextAnchor(x) {
  if (x >= wheelCenter + 10) {
    return "start";
  }

  if (x <= wheelCenter - 10) {
    return "end";
  }

  return "middle";
}

function getWheelLabelBaseline(y) {
  if (y > wheelCenter + 24) {
    return "hanging";
  }

  if (y < wheelCenter - 24) {
    return "auto";
  }

  return "middle";
}

function scrollToArea(areaKey) {
  const target = document.getElementById(`area-${areaKey}`);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function CinematicBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
      <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
      <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute bottom-[-14rem] right-[-10rem] h-[22rem] w-[22rem] rounded-full bg-orange-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}

function ResultIntro() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
        CINE PARA CRECER
      </p>

      <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl md:text-[3.25rem]">
        Para ti, hoy
      </h2>

      <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/62 sm:text-lg">
        Estas películas salen de las áreas que hoy parecen pedir más atención. Empieza
        por la que más te llame y decide desde ahí.
      </p>
    </div>
  );
}

function RecommendationCard({ movie, lifeArea }) {
  const [imageFailed, setImageFailed] = useState(!movie.posterPath);
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/movie/${movie.tmdbId}`, {
          state: {
            from: "/test/result",
            lifeArea,
          },
        })
      }
      className="text-left rounded-[24px] border border-white/10 bg-white/[0.03] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c39b]"
    >
      <div className="relative flex aspect-[2/3] items-end overflow-hidden rounded-[20px] border border-white/8 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13] p-4">
        {!imageFailed ? (
          <>
            <img
              src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
              alt=""
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
      </div>

      <div className="pt-4">
        <h3 className="text-[1.35rem] font-semibold leading-tight text-white">
          {movie.title}
        </h3>
      </div>
    </button>
  );
}

function DeepResult({ answersByArea }) {
  const [moviePostersById, setMoviePostersById] = useState({});
  const navigate = useNavigate();
  const [isLoadingPosters, setIsLoadingPosters] = useState(false);
  const [hasPosterUpdateError, setHasPosterUpdateError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const scoredAreas = lifeAreas.map((area) => {
    const areaAnswers = answersByArea[area.key] || [];
    const score = areaAnswers.reduce(
      (total, answer) => total + (answer ? answerScores[answer] : 0),
      0
    );

    return {
      ...area,
      score,
    };
  });

  const sortedAreas = [...scoredAreas].sort(
    (firstArea, secondArea) => firstArea.score - secondArea.score
  );

  const priorityAreas = sortedAreas.filter((area, index, areas) => {
    if (index < 2) {
      return true;
    }

    return index === 2 && area.score === areas[1].score;
  });

  const priorityAreaKeys = new Set(priorityAreas.map((area) => area.key));

  const wheelPolygonPoints = scoredAreas
    .map((area, index) => {
      const point = getWheelPoint(
        index,
        scoredAreas.length,
        wheelRadius * (area.score / 4)
      );

      return `${point.x},${point.y}`;
    })
    .join(" ");

  const recommendedMoviesByArea = priorityAreas.map((area) => ({
    ...area,
    percentage: getAreaPercentage(area.score),
    movies: decorateAreaMoviesWithPosters(
      getDeepAreaMovies(area.key, { limit: 3 }),
      moviePostersById
    ),
  }));

  const recommendedTmdbIds = priorityAreas.flatMap((area) =>
    getAreaMovieIds(area.key, { scope: "deep", limit: 3 })
  );
  const recommendedTmdbIdsKey = recommendedTmdbIds.join(",");
  const hasRecommendations = recommendedMoviesByArea.some((area) => area.movies.length);

  useEffect(() => {
    let isCancelled = false;
    setHasPosterUpdateError(false);

    async function enrichPosters() {
      const missingIds = recommendedTmdbIds.filter(
        (tmdbId) => !(tmdbId in moviePostersById)
      );

      if (!missingIds.length) {
        return;
      }

      setIsLoadingPosters(true);
      let hasFailedRequest = false;

      const posterEntries = await Promise.all(
        missingIds.map(async (tmdbId) => {
          try {
            const details = await fetchMovieDetails(tmdbId);
            return [tmdbId, details?.posterPath || null];
          } catch {
            hasFailedRequest = true;
            return [tmdbId, null];
          }
        })
      );

      if (!isCancelled) {
        setMoviePostersById((currentPosters) => ({
          ...currentPosters,
          ...Object.fromEntries(posterEntries),
        }));
        setHasPosterUpdateError(hasFailedRequest);
        setIsLoadingPosters(false);
      }
    }

    enrichPosters();

    return () => {
      isCancelled = true;
    };
  }, [moviePostersById, recommendedTmdbIds, recommendedTmdbIdsKey, retryKey]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <CinematicBackground />

      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-14 pt-20 sm:px-10 sm:pb-16 sm:pt-24">
        <button
          type="button"
          onClick={() => navigate("/test")}
          className="mb-8 text-sm text-white/60 transition hover:text-white"
        >
          ← Volver al test
        </button>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
          <div className="sticky top-4 z-20 -mx-2 rounded-[24px] bg-[linear-gradient(180deg,rgba(5,7,11,0.96),rgba(5,7,11,0.82),rgba(5,7,11,0))] px-2 pb-8 pt-1 sm:-mx-3 sm:px-3">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
                RESULTADO DEL TEST
              </p>
              <h1 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] text-white sm:text-4xl md:text-[3.25rem]">
                Este es tu momento
              </h1>
            </div>
          </div>

          <section className="mt-6 rounded-[24px] border border-white/8 bg-black/12 px-4 py-8 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-[560px]">
              <svg
                viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                className="h-auto w-full overflow-visible"
                role="img"
                aria-label="Rueda de vida con el equilibrio actual de tus áreas"
              >
                {Array.from({ length: wheelLevels }).map((_, levelIndex) => (
                  <circle
                    key={`grid-circle-${levelIndex + 1}`}
                    cx={wheelCenter}
                    cy={wheelCenter}
                    r={(wheelRadius / wheelLevels) * (levelIndex + 1)}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                  />
                ))}

                {scoredAreas.map((area, index) => {
                  const linePoint = getWheelPoint(
                    index,
                    scoredAreas.length,
                    wheelRadius
                  );
                  const labelPoint = getWheelPoint(
                    index,
                    scoredAreas.length,
                    wheelLabelRadius
                  );
                  const valuePoint = getWheelPoint(
                    index,
                    scoredAreas.length,
                    wheelRadius * (area.score / 4)
                  );
                  const isPriority = priorityAreaKeys.has(area.key);
                  const areaPercentage = getAreaPercentage(area.score);

                  return (
                    <g key={area.key}>
                      <line
                        x1={wheelCenter}
                        y1={wheelCenter}
                        x2={linePoint.x}
                        y2={linePoint.y}
                        stroke={
                          isPriority
                            ? "rgba(216,195,155,0.28)"
                            : "rgba(255,255,255,0.1)"
                        }
                        strokeWidth={isPriority ? "1.8" : "1"}
                      />
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        fill={
                          isPriority
                            ? "rgba(240,223,189,0.96)"
                            : "rgba(255,255,255,0.82)"
                        }
                        fontSize={area.title.length > 11 ? "11.5" : "12.5"}
                        fontWeight={isPriority ? "600" : "500"}
                        textAnchor={getWheelLabelTextAnchor(labelPoint.x)}
                        dominantBaseline={getWheelLabelBaseline(labelPoint.y)}
                      >
                        <tspan x={labelPoint.x} dy="0">
                          {area.title}
                        </tspan>
                        <tspan
                          x={labelPoint.x}
                          dy="1.25em"
                          fill={
                            isPriority
                              ? "rgba(240,223,189,0.82)"
                              : "rgba(255,255,255,0.52)"
                          }
                          fontSize="10"
                          fontWeight="500"
                        >
                          {areaPercentage}%
                        </tspan>
                      </text>
                      <circle
                        cx={valuePoint.x}
                        cy={valuePoint.y}
                        r={isPriority ? "4.5" : "2.5"}
                        fill={
                          isPriority
                            ? "rgba(240,223,189,0.98)"
                            : "rgba(255,255,255,0.6)"
                        }
                      />
                    </g>
                  );
                })}

                <polygon
                  points={wheelPolygonPoints}
                  fill="rgba(216,195,155,0.16)"
                  stroke="rgba(216,195,155,0.72)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </section>

          <section className="mt-10 text-center">
            <p className="text-sm leading-6 text-white/52 sm:text-base">
              Estas son las áreas que hoy parecen necesitar más atención
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {priorityAreas.map((area) => (
                <button
                  key={area.key}
                  type="button"
                  onClick={() => scrollToArea(area.key)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.14),rgba(224,196,150,0.05))] px-3 py-2 text-sm text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/34 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c39b]"
                >
                  <span>{area.title}</span>
                  <span className="text-[#d8c39b]">
                    {getAreaPercentage(area.score)}%
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-24 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
          <section className="pt-16 sm:pt-20">
            <ResultIntro />

            <div className="mt-10">
              <div className="mb-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-end">
                {isLoadingPosters ? (
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/34 sm:mr-auto">
                    Actualizando fichas
                  </p>
                ) : null}

                {!isLoadingPosters && hasPosterUpdateError ? (
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

              {hasRecommendations ? (
                <div className="space-y-14">
                  {recommendedMoviesByArea.map((area) => (
                    <section
                      key={area.key}
                      id={`area-${area.key}`}
                      className="scroll-mt-24"
                    >
                      <h3 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                        {area.title}
                      </h3>

                      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
                        {area.movies.map((movie) => (
                          <RecommendationCard
                            key={`${area.key}-${movie.title}-${movie.posterPath || "no-poster"}`}
                            movie={movie}
                            lifeArea={area.title}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#d2b98b]">
                    SIN RECOMENDACIONES
                  </p>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
                    No pudimos generar recomendaciones claras con este resultado. Puedes
                    repetir el test o volver al inicio.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => navigate("/test")}
                      className="inline-flex rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
                    >
                      Repetir test
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
              )}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/test")}
            className="inline-flex rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
          >
            Repetir test
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-white/70 transition duration-300 hover:text-white"
          >
            Volver al inicio
          </button>
        </div>
      </section>
    </main>
  );
}

export default DeepResult;
