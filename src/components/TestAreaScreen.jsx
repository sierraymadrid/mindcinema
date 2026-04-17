import { useEffect, useRef, useState } from "react";
import lifeAreas from "../data/lifeAreas";

const answerOptions = ["Sí", "A veces", "No"];

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

function TestAreaScreen({ onBack, onComplete }) {
  const formCardRef = useRef(null);
  const [state, setState] = useState({
    currentAreaIndex: 0,
    answersByArea: {},
  });

  const currentArea = lifeAreas[state.currentAreaIndex];
  const currentAnswers = state.answersByArea[currentArea.key] || [
    null,
    null,
    null,
    null,
  ];
  const isCurrentAreaComplete = currentAnswers.every((answer) => answer !== null);

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
      if (onComplete) {
        onComplete(state.answersByArea);
      }
      return;
    }

    setState((currentState) => ({
      ...currentState,
      currentAreaIndex: currentState.currentAreaIndex + 1,
    }));
  }

  function handlePrevious() {
    if (state.currentAreaIndex === 0) {
      if (onBack) {
        onBack();
      }
      return;
    }

    setState((currentState) => ({
      ...currentState,
      currentAreaIndex: currentState.currentAreaIndex - 1,
    }));
  }

  useEffect(() => {
    formCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [state.currentAreaIndex]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <CinematicBackground />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-14 sm:px-8 sm:py-16">
        <div
          ref={formCardRef}
          className="w-full rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-7"
        >
          <button
            type="button"
            onClick={handlePrevious}
            className="mb-6 text-sm text-white/60 transition hover:text-white"
          >
            ← {state.currentAreaIndex === 0 ? "Volver" : "Área anterior"}
          </button>

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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!isCurrentAreaComplete}
              onClick={handleContinue}
              className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition duration-300 ${
                isCurrentAreaComplete
                  ? "border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
                  : "cursor-not-allowed border border-white/8 bg-white/[0.03] text-white/35"
              }`}
            >
              {state.currentAreaIndex === lifeAreas.length - 1 ? "Ver resultado" : "Continuar"}
            </button>

            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/75 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              {state.currentAreaIndex === 0 ? "Salir del test" : "Volver a la anterior"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TestAreaScreen;
