import { useState } from "react";
import lifeAreas from "../data/lifeAreas";
import { TMDB_IMAGE_BASE_URL } from "../services/tmdb";

const answerOptions = ["Sí", "A veces", "No"];
const answerScores = {
  Sí: 1,
  "A veces": 0.5,
  No: 0,
};

const moviesByArea = {
  personal: [
    {
      title: "The Secret Life of Walter Mitty",
      posterPath: "/dXgYQ7LUPbqe0R4L5ZQd3P4dQxX.jpg",
    },
    {
      title: "Good Will Hunting",
      posterPath: "/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg",
    },
    {
      title: "Paterson",
      posterPath: null,
    },
  ],
  salud: [
    {
      title: "Eat Pray Love",
      posterPath: "/6ZfymJUnF3LILJYEFM7mR6Y8D0S.jpg",
    },
    {
      title: "Perfect Days",
      posterPath: null,
    },
    {
      title: "Chef",
      posterPath: null,
    },
  ],
  espiritualidad: [
    {
      title: "Into the Wild",
      posterPath: null,
    },
    {
      title: "Tree of Life",
      posterPath: null,
    },
    {
      title: "Silence",
      posterPath: null,
    },
  ],
  aventura: [
    {
      title: "Wild",
      posterPath: null,
    },
    {
      title: "Tracks",
      posterPath: null,
    },
    {
      title: "The Secret Life of Walter Mitty",
      posterPath: "/dXgYQ7LUPbqe0R4L5ZQd3P4dQxX.jpg",
    },
  ],
  amor: [
    {
      title: "Before Sunrise",
      posterPath: null,
    },
    {
      title: "Her",
      posterPath: "/zV8bHuSL6WXoD6FWogP9j4x80bL.jpg",
    },
    {
      title: "Past Lives",
      posterPath: null,
    },
  ],
  familia: [
    {
      title: "Little Miss Sunshine",
      posterPath: "/wKn7AJw730emLmSlYw3wibM9s4z.jpg",
    },
    {
      title: "Minari",
      posterPath: null,
    },
    {
      title: "Shoplifters",
      posterPath: null,
    },
  ],
  amistad: [
    {
      title: "The Intouchables",
      posterPath: "/323BP0itpxTsO0skTwdnVmf7YC9.jpg",
    },
    {
      title: "Frances Ha",
      posterPath: null,
    },
    {
      title: "The Holdovers",
      posterPath: null,
    },
  ],
  proposito: [
    {
      title: "Soul",
      posterPath: "/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
    },
    {
      title: "Paterson",
      posterPath: null,
    },
    {
      title: "Ikiru",
      posterPath: null,
    },
  ],
  finanzas: [
    {
      title: "The Pursuit of Happyness",
      posterPath: "/lBYOKAMcxIvuk9s9hMuecB9dPBV.jpg",
    },
    {
      title: "Nomadland",
      posterPath: null,
    },
    {
      title: "99 Homes",
      posterPath: null,
    },
  ],
};

const wheelSize = 420;
const wheelCenter = wheelSize / 2;
const wheelRadius = 112;
const wheelLabelRadius = 156;
const wheelLevels = 4;

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

function scrollToArea(areaKey) {
  const target = document.getElementById(`area-${areaKey}`);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function RecommendationCard({ movie }) {
  const [imageFailed, setImageFailed] = useState(!movie.posterPath);

  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.03] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.05]">
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
    </article>
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

      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/62 sm:text-lg">
        Cuatro elecciones distintas, ordenadas con un criterio claro para este momento.
      </p>
    </div>
  );
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

function TestAreaScreen() {
  const [state, setState] = useState({
    currentAreaIndex: 0,
    answersByArea: {},
    isComplete: false,
  });

  const currentArea = lifeAreas[state.currentAreaIndex];
  const currentAnswers = state.answersByArea[currentArea.key] || [
    null,
    null,
    null,
    null,
  ];
  const isCurrentAreaComplete = currentAnswers.every((answer) => answer !== null);

  const scoredAreas = lifeAreas.map((area) => {
    const areaAnswers = state.answersByArea[area.key] || [];
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
    movies: (moviesByArea[area.key] || []).slice(0, 3),
  }));

  function handleAnswerSelect(questionIndex, option) {
    setState((currentState) => {
      const areaKey = lifeAreas[currentState.currentAreaIndex].key;
      const nextAnswers = [
        ...(currentState.answersByArea[areaKey] || [null, null, null, null]),
      ];

      nextAnswers[questionIndex] = option;

      return {
        ...currentState,
        answersByArea: {
          ...currentState.answersByArea,
          [areaKey]: nextAnswers,
        },
      };
    });
  }

  function handleContinue() {
    if (!isCurrentAreaComplete) {
      return;
    }

    const isLastArea = state.currentAreaIndex === lifeAreas.length - 1;

    if (isLastArea) {
      setState((currentState) => ({
        ...currentState,
        isComplete: true,
      }));
      return;
    }

    setState((currentState) => ({
      ...currentState,
      currentAreaIndex: currentState.currentAreaIndex + 1,
    }));
  }

  if (state.isComplete) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
        <CinematicBackground />

        <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-14 pt-20 sm:px-10 sm:pb-16 sm:pt-24">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
                RESULTADO DEL TEST
              </p>
              <h1 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] text-white sm:text-4xl md:text-[3.25rem]">
                Este es tu momento
              </h1>
            </div>

            <section className="mt-12 rounded-[24px] border border-white/8 bg-black/12 px-4 py-8 sm:px-8 sm:py-10">
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
                            fill={isPriority ? "rgba(240,223,189,0.82)" : "rgba(255,255,255,0.52)"}
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
                Y estas son las areas que necesitan atencion
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

              <div className="mt-10 space-y-14">
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
                          key={`${area.key}-${movie.title}`}
                          movie={movie}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <CinematicBackground />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-14 sm:px-8 sm:py-16">
        <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-7">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white/50">
            Área {state.currentAreaIndex + 1} de {lifeAreas.length}
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            {currentArea.title}
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
            {currentArea.description}
          </p>

          <div className="mt-8 space-y-5">
            {currentArea.questions.map((question, questionIndex) => (
              <article
                key={question}
                className="rounded-[22px] border border-white/8 bg-black/15 p-4 sm:p-5"
              >
                <p className="text-base leading-7 text-white/88">
                  {questionIndex + 1}. {question}
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {answerOptions.map((option) => {
                    const isSelected = currentAnswers[questionIndex] === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleAnswerSelect(questionIndex, option)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                          isSelected
                            ? "border border-[#d8c39b]/60 bg-[linear-gradient(135deg,rgba(224,196,150,0.24),rgba(224,196,150,0.14))] text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] ring-1 ring-inset ring-[#f0dfbd]/25"
                            : "border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/18 hover:bg-white/[0.06] hover:text-white/90"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            disabled={!isCurrentAreaComplete}
            onClick={handleContinue}
            className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition duration-300 ${
              isCurrentAreaComplete
                ? "border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
                : "cursor-not-allowed border border-white/8 bg-white/[0.03] text-white/35"
            }`}
          >
            Continuar
          </button>
        </div>
      </section>
    </main>
  );
}

export default TestAreaScreen;
