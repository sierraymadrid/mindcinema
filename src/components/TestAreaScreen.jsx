import { useState } from "react";
import lifeAreas from "../data/lifeAreas";

const answerOptions = ["Sí", "A veces", "No"];
const answerScores = {
  Sí: 1,
  "A veces": 0.5,
  No: 0,
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

        <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-14 sm:px-8 sm:py-16">
          <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-7">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white/50">
              Test completado
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Tu momento actual
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
              Una lectura inicial de las áreas que hoy se sienten más sólidas y las que pueden necesitar más atención.
            </p>

            <div className="mt-8 rounded-[22px] border border-white/8 bg-black/15 p-4 sm:p-5">
              <div className="mx-auto max-w-[360px]">
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

                    return (
                      <g key={area.key}>
                        <line
                          x1={wheelCenter}
                          y1={wheelCenter}
                          x2={linePoint.x}
                          y2={linePoint.y}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                        <text
                          x={labelPoint.x}
                          y={labelPoint.y}
                          fill="rgba(255,255,255,0.55)"
                          fontSize="10"
                          textAnchor={labelPoint.x >= wheelCenter + 8 ? "start" : labelPoint.x <= wheelCenter - 8 ? "end" : "middle"}
                          dominantBaseline={labelPoint.y > wheelCenter + 20 ? "hanging" : labelPoint.y < wheelCenter - 20 ? "auto" : "middle"}
                        >
                          {area.title}
                        </text>
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
            </div>

            <div className="mt-8 rounded-[22px] border border-white/8 bg-black/15 p-4 sm:p-5">
              <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-white/55">
                Todas las áreas
              </h2>

              <div className="mt-4 space-y-3">
                {sortedAreas.map((area) => (
                  <div
                    key={area.key}
                    className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm text-white/80 sm:text-base">
                      {area.title}
                    </span>
                    <span className="text-sm font-medium text-[#d8c39b] sm:text-base">
                      {area.score.toFixed(1)} / 4
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[22px] border border-[#d8c39b]/18 bg-[linear-gradient(135deg,rgba(224,196,150,0.1),rgba(255,255,255,0.02))] p-4 sm:p-5">
              <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-[#d8c39b]">
                Áreas prioritarias
              </h2>

              <div className="mt-4 space-y-3">
                {priorityAreas.map((area) => (
                  <div
                    key={area.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm text-white/88 sm:text-base">
                      {area.title}
                    </span>
                    <span className="text-sm font-medium text-white sm:text-base">
                      {area.score.toFixed(1)} / 4
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/8 bg-black/15 p-4 sm:p-5">
              <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-white/55">
                Tu recomendación
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
                Aquí aparecerán películas alineadas con las áreas que más atención necesitan.
              </p>
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
