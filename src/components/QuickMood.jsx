import { useState } from "react";
import { moods } from "../data/moods";

function MoodIcon({ moodId, isSelected }) {
  const iconClass = isSelected ? "text-[#e3cfaa]" : "text-white/62";

  switch (moodId) {
    case "inspiracion":
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-5 w-5 ${iconClass}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3.5v3" />
          <path d="M12 17.5v3" />
          <path d="M4.5 12h3" />
          <path d="M16.5 12h3" />
          <path d="m6.8 6.8 2.2 2.2" />
          <path d="m15 15 2.2 2.2" />
          <path d="m17.2 6.8-2.2 2.2" />
          <path d="M9 15 6.8 17.2" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      );
    case "reflexionar":
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-5 w-5 ${iconClass}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4c4.2 0 7.5 2.9 7.5 6.7 0 3.6-2.8 6.2-6.5 6.6L9 20v-2.8c-2.7-1-4.5-3.3-4.5-6.5C4.5 6.9 7.8 4 12 4Z" />
          <path d="M9.5 10.2c.3-1.1 1.2-1.9 2.5-1.9 1.4 0 2.5.9 2.5 2.2 0 1.9-2.3 2.1-2.3 4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "calma":
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-5 w-5 ${iconClass}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10c1.2 0 1.8-.8 2.4-1.5S7.7 7 9 7s1.9.8 2.6 1.5S12.8 10 14 10s1.8-.8 2.4-1.5S17.7 7 19 7" />
          <path d="M4 14c1.2 0 1.8-.8 2.4-1.5S7.7 11 9 11s1.9.8 2.6 1.5S12.8 14 14 14s1.8-.8 2.4-1.5S17.7 11 19 11" />
          <path d="M4 18c1.2 0 1.8-.8 2.4-1.5S7.7 15 9 15s1.9.8 2.6 1.5S12.8 18 14 18s1.8-.8 2.4-1.5S17.7 15 19 15" />
        </svg>
      );
    case "motivacion":
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-5 w-5 ${iconClass}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20V9" />
          <path d="m7.5 13.5 4.5-4.5 4.5 4.5" />
          <path d="M5 4.5h14" />
        </svg>
      );
    case "profundo":
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-5 w-5 ${iconClass}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4.5c4.2 0 7.5 3 7.5 7.5s-3.3 7.5-7.5 7.5S4.5 16.2 4.5 12 7.8 4.5 12 4.5Z" />
          <path d="M12 8v4l2.5 2.5" />
        </svg>
      );
    case "aventura":
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-5 w-5 ${iconClass}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m14.5 5.5 4 4-8.5 8.5H6v-4Z" />
          <path d="m12 8 4 4" />
          <path d="M13.5 4h6.5v6.5" />
        </svg>
      );
    default:
      return null;
  }
}

function QuickMood({ onBack, onMoodSelect }) {
  const [selectedMood, setSelectedMood] = useState("");

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);

    window.setTimeout(() => {
      if (onMoodSelect) {
        onMoodSelect(moodId);
        return;
      }

      window.alert(`Aquí irá la recomendación para: ${moodId}`);
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

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/62 sm:text-lg">
              Elige la sensación o el tipo de experiencia que necesitas ahora y te
              recomendaremos una película al momento.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moods.map((mood) => {
                const isSelected = selectedMood === mood.id;

                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`rounded-2xl border px-5 py-6 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 ${
                      isSelected
                        ? "border-[#d8c39b]/55 bg-[#17120d] text-white shadow-[0_16px_40px_rgba(0,0,0,0.32)] ring-[#d8c39b]"
                        : "border-white/10 bg-[#0f131a] text-white/78 hover:border-white/20 hover:bg-[#131922] hover:text-white ring-white/30"
                    }`}
                  >
                    <span
                      className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-[#d8c39b]/45 bg-[#d8c39b]/8"
                          : "border-white/12 bg-white/[0.015]"
                      }`}
                    >
                      <MoodIcon
                        moodId={mood.id}
                        isSelected={isSelected}
                      />
                    </span>
                    <span className="block text-base font-medium leading-6">
                      {mood.label}
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
