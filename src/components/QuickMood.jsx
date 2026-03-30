import { useState } from "react";

const moods = [
  "Necesito inspiración",
  "Quiero reflexionar",
  "Busco calma",
  "Necesito motivación",
  "Me apetece algo profundo",
  "Quiero aventura",
];

function QuickMood({ onBack }) {
  const [selectedMood, setSelectedMood] = useState("");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-20 sm:px-10">
        <div className="w-full max-w-4xl text-center">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 text-sm text-white/60 transition hover:text-white"
          >
            ← Volver
          </button>

          <p className="mb-6 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
            CINE PARA CRECER
          </p>

          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl md:text-6xl md:leading-[1.02]">
            ¿Cómo te sientes hoy?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
            Elige una opción y te recomendaremos una película al momento.
          </p>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moods.map((mood) => {
              const isSelected = selectedMood === mood;

              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={`rounded-2xl border px-5 py-5 text-left text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 ${
                    isSelected
                      ? "border-[#d8c39b]/50 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] ring-[#d8c39b]"
                      : "border-white/10 bg-white/[0.03] text-white/82 shadow-[0_10px_30px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] hover:text-white ring-white/30"
                  }`}
                >
                  <span className="block leading-6">{mood}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              disabled={!selectedMood}
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))] hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c39b] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              Ver recomendación
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default QuickMood;