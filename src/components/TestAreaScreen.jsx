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
  ],
  salud: [
    {
      title: "Eat Pray Love",
      posterPath: "/6ZfymJUnF3LILJYEFM7mR6Y8D0S.jpg",
    },
    {
      title: "Perfect Days",
      posterPath: "/a4w1zL3W9n4Jm7Y0R6fKx2L8Y3h.jpg",
    },
  ],
  espiritualidad: [
    {
      title: "Into the Wild",
      posterPath: "/w8M9Z6l5Zt5W3c5Yv8V6M6N2B6P.jpg",
    },
    {
      title: "Tree of Life",
      posterPath: "/rM8wQ2xN5R5M8S5W0m0lN8O2m0A.jpg",
    },
  ],
  aventura: [
    {
      title: "Wild",
      posterPath: "/bM2z0r3G7R4l4Y3x4R0V5g6u9nS.jpg",
    },
    {
      title: "Tracks",
      posterPath: "/4l4d0N1mV4Y6R4y5m8R7M6z0P2v.jpg",
    },
  ],
  amor: [
    {
      title: "Before Sunrise",
      posterPath: "/k3N3gGQ9zB2r6r7sB8F7Y0j7P7p.jpg",
    },
    {
      title: "Her",
      posterPath: "/zV8bHuSL6WXoD6FWogP9j4x80bL.jpg",
    },
  ],
  familia: [
    {
      title: "Little Miss Sunshine",
      posterPath: "/wKn7AJw730emLmSlYw3wibM9s4z.jpg",
    },
    {
      title: "Minari",
      posterPath: "/hAUUrbpEPqxY6gH5K7L9Y2pQ4Rz.jpg",
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
  ],
  proposito: [
    {
      title: "Soul",
      posterPath: "/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
    },
    {
      title: "Paterson",
      posterPath: "/aX2vN5K7W8m6B4m9Y2m3X5p9Z8G.jpg",
    },
  ],
  finanzas: [
    {
      title: "The Pursuit of Happyness",
      posterPath: "/lBYOKAMcxIvuk9s9hMuecB9dPBV.jpg",
    },
    {
      title: "Nomadland",
      posterPath: "/66GUmWpTHgAjyp4aBSXy63PZTiC.jpg",
    },
  ],
};
const wheelSize = 360;
const wheelCenter = wheelSize / 2;
const wheelRadius = 104;
const wheelLabelRadius = 146;
const wheelLevels = 4;

function getWheelPoint(index, total, radius) {
  const angle = (-Math.PI / 2) + (index / total) * Math.PI * 2;

  return {
    x: wheelCenter + Math.cos(angle) * radius,
    y: wheelCenter + Math.sin(angle) * radius,
  };
}

function getAreaPercentage(score) {
  return Math.floor((score / 4) * 100);
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
  const scoredAreas = lifeAreas
    .map((area) => {
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
  const wheelPolygonPoints = scoredAreas
    .map((area, index) => {
      const normalizedScore = area.score / 4;
      const point = getWheelPoint(index, scoredAreas.length, wheelRadius * normalizedScore);

      return `${point.x},${point.y}`;
    })
    .join(" ");
  const priorityAreas = sortedAreas.filter((area, index, areas) => {
    if (index < 2) {
      return true;
    }

    return index === 2 && area.score === areas[1].score;
  });
  const priorityAreaKeys = new Set(priorityAreas.map((area) => area.key));
  const recommendedMoviesByArea = priorityAreas.map((area) => ({
    ...area,
    percentage: getAreaPercentage(area.score),
    movies: (moviesByArea[area.key] || []).slice(0, 3),
  }));

  function handleAnswerSelect(questionIndex, option) {
    setState((currentState) => {
      const areaKey = lifeAreas[currentState.currentAreaIndex].key;
      const nextAnswers = [...(currentState.answersByArea[areaKey] || [null, null, null, null])];
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
      console.log(state.answersByArea);
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
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
          <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
          <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <section className="relative z-10 mx-auto w-full max-w-4xl px-6 py-14 sm:px-8 sm:py-16">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white/50">
              Resultado del test
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Tu momento actual
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
              Estas son las áreas que hoy sostienen tu momento y las que pueden necesitar más atención.
            </p>

            <div className="mt-10 rounded-[24px] border border-white/8 bg-black/15 p-5 sm:p-7">
              <div className="mx-auto max-w-[420px]">
                <svg
                  viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                  className="h-auto w-full"
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
                    const linePoint = getWheelPoint(index, scoredAreas.length, wheelRadius);
                    const labelPoint = getWheelPoint(index, scoredAreas.length, wheelLabelRadius);
                    const valuePoint = getWheelPoint(
                      index,
                      scoredAreas.length,
                      wheelRadius * (area.score / 4)
                    );
                    const isPriority = priorityAreaKeys.has(area.key);

                    return (
                      <g key={area.key}>
                        <line
                          x1={wheelCenter}
                          y1={wheelCenter}
                          x2={linePoint.x}
                          y2={linePoint.y}
                          stroke={isPriority ? "rgba(216,195,155,0.28)" : "rgba(255,255,255,0.1)"}
                          strokeWidth={isPriority ? "1.6" : "1"}
                        />
                        <text
                          x={labelPoint.x}
                          y={labelPoint.y}
                          fill={isPriority ? "rgba(240,223,189,0.92)" : "rgba(255,255,255,0.72)"}
                          fontSize="12"
                          fontWeight={isPriority ? "600" : "500"}
                          textAnchor={labelPoint.x >= wheelCenter + 8 ? "start" : labelPoint.x <= wheelCenter - 8 ? "end" : "middle"}
                          dominantBaseline={labelPoint.y > wheelCenter + 20 ? "hanging" : labelPoint.y < wheelCenter - 20 ? "auto" : "middle"}
                        >
                          {area.title}
                        </text>
                        <circle
                          cx={valuePoint.x}
                          cy={valuePoint.y}
                          r={isPriority ? "4" : "2.5"}
                          fill={isPriority ? "rgba(240,223,189,0.95)" : "rgba(255,255,255,0.6)"}
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

              <div className="mt-8 flex flex-wrap gap-3">
                {priorityAreas.map((area) => (
                  <div
                    key={area.key}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.14),rgba(224,196,150,0.05))] px-3 py-2 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                  >
                    <span className="text-white/90">
                      {area.title}
                    </span>
                    <span className="text-[#d8c39b]">
                      {getAreaPercentage(area.score)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-[24px] border border-white/8 bg-black/15 p-5 sm:p-7">
              <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-white/55">
                Películas para tu momento
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
                Una primera selección para acompañar justo las áreas que hoy piden más cuidado.
              </p>

              <div className="mt-8 space-y-8">
                {recommendedMoviesByArea.map((area) => (
                  <section key={area.key}>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex rounded-full border border-[#d8c39b]/18 bg-[#d8c39b]/10 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#d8c39b]">
                        {area.title}
                      </div>
                      <span className="text-sm text-white/45">
                        {area.percentage}%
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {area.movies.map((movie) => (
                        <article
                          key={`${area.key}-${movie.title}`}
                          className="overflow-hidden rounded-[20px] border border-white/8 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                        >
                          <div className="flex min-h-[148px]">
                            {movie.posterPath ? (
                              <img
                                src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
                                alt={`Poster de ${movie.title}`}
                                className="h-[148px] w-[104px] shrink-0 object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-[148px] w-[104px] shrink-0 items-center justify-center bg-white/[0.04] text-center text-[0.68rem] uppercase tracking-[0.18em] text-white/35">
                                Sin poster
                              </div>
                            )}

                            <div className="flex flex-1 items-center p-4">
                              <h3 className="text-base font-medium leading-6 text-white/90 sm:text-lg">
                                {movie.title}
                              </h3>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

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
