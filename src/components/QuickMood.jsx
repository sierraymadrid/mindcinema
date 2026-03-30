import { useState } from "react";

const moods = [
  "Necesito inspiración",
  "Quiero reflexionar",
  "Busco calma",
  "Necesito motivación",
  "Me apetece algo profundo",
  "Quiero aventura",
];

function QuickMood({ onBack, onMoodSelect }) {
  const [selectedMood, setSelectedMood] = useState("");

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);

    window.setTimeout(() => {
      if (onMoodSelect) {
        onMoodSelect(mood);
        return;
      }

      window.alert(`Aquí irá la recomendación para: ${mood}`);
    }, 120);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16 sm:px-10 sm:py-20">
        <div className="w-full max-w-5xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-10 text-sm text-white/60 transition hover:text-white"
          >
            ← Volver
          </button>

          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
              CINE PARA CRECER
            </p>

            <h1 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl md:text-[3.25rem]">
              ¿Cómo te sientes hoy?
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/62 sm:text-lg">
              Elige una opción y te recomendaremos una película al momento.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moods.map((mood) => {
                const isSelected = selectedMood === mood;

                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => handleMoodSelect(mood)}
                    className={`rounded-2xl border px-5 py-6 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 ${
                      isSelected
                        ? "border-[#d8c39b]/55 bg-[#17120d] text-white shadow-[0_16px_40px_rgba(0,0,0,0.32)] ring-[#d8c39b]"
                        : "border-white/10 bg-[#0f131a] text-white/78 hover:border-white/20 hover:bg-[#131922] hover:text-white ring-white/30"
                    }`}
                  >
                    <span
                      className={`mb-4 flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                        isSelected
                          ? "border-[#d8c39b]/60 bg-[#d8c39b]/12 text-[#e3cfaa]"
                          : "border-white/12 text-white/40"
                      }`}
                    >
                      {isSelected ? "•" : ""}
                    </span>
                    <span className="block text-base font-medium leading-6">
                      {mood}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default QuickMood;
