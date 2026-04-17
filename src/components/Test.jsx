import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applySeo } from "../utils/seo";
import {
  clearStoredTestResult,
  loadStoredTestResult,
  saveTestResult,
} from "../utils/testResultStorage";
import TestAreaScreen from "./TestAreaScreen";

function TestIntro({ hasSavedResult, onBack, onStart, onViewSavedResult }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-14rem] right-[-10rem] h-[22rem] w-[22rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-14 sm:px-8 sm:py-16">
        <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-7">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm text-white/60 transition hover:text-white"
          >
            ← Volver
          </button>

          <p className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white/50">
            TEST DE AREAS DE VIDA
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Un momento para mirar cómo estás
          </h1>

          <div className="mt-4 space-y-4 text-sm leading-6 text-white/62 sm:text-base sm:leading-7">
            <p>
              Este test revisa 9 áreas de tu vida para darte una visión más clara de
              tu momento actual.
            </p>
            <p>
              A partir de ahí, recibirás recomendaciones de películas pensadas para
              acompañarte, inspirarte o hacerte reflexionar.
            </p>
          </div>

          {hasSavedResult ? (
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={onViewSavedResult}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
              >
                Ver resultado actual
              </button>

              <button
                type="button"
                onClick={onStart}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                Volver a hacer el test
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
            >
              Empezar test
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function Test() {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [savedAnswersByArea, setSavedAnswersByArea] = useState(null);

  useEffect(() => {
    applySeo({
      title: "Recomendación profunda — MindCinema",
      description:
        "Descubre qué áreas de tu vida necesitan atención y recibe recomendaciones personalizadas.",
    });

    setSavedAnswersByArea(loadStoredTestResult());
  }, []);

  function handleStart() {
    clearStoredTestResult();
    setSavedAnswersByArea(null);
    setHasStarted(true);
  }

  function handleViewSavedResult() {
    if (!savedAnswersByArea) {
      return;
    }

    navigate("/test/result", {
      state: { answersByArea: savedAnswersByArea },
    });
  }

  if (!hasStarted) {
    return (
      <TestIntro
        hasSavedResult={Boolean(savedAnswersByArea)}
        onBack={() => navigate("/")}
        onStart={handleStart}
        onViewSavedResult={handleViewSavedResult}
      />
    );
  }

  return (
    <TestAreaScreen
      onBack={() => navigate("/")}
      onComplete={(answersByArea) => {
        saveTestResult(answersByArea);
        setSavedAnswersByArea(answersByArea);

        navigate("/test/result", { state: { answersByArea } });
      }}
    />
  );
}

export default Test;
