const recommendationsByMood = {
  "Necesito inspiración": [
    {
      title: "Dead Poets Society",
      reason: "Porque vuelve a encender el deseo de vivir con más intención.",
      tone: "Reconocida",
    },
    {
      title: "The Secret Life of Walter Mitty",
      reason: "Porque invita a moverte, imaginar más y salir de la inercia.",
      tone: "Cercana",
    },
    {
      title: "Paterson",
      reason: "Porque encuentra belleza y sentido en los gestos más pequeños.",
      tone: "Inesperada",
    },
  ],
  "Quiero reflexionar": [
    {
      title: "Her",
      reason: "Porque abre preguntas íntimas sobre el vínculo, la soledad y lo que sentimos.",
      tone: "Reconocida",
    },
    {
      title: "Perfect Days",
      reason: "Porque propone una mirada serena sobre el tiempo, la rutina y la atención.",
      tone: "Cercana",
    },
    {
      title: "After Yang",
      reason: "Porque deja espacio para pensar sin imponerse ni explicarlo todo.",
      tone: "Inesperada",
    },
  ],
  "Busco calma": [
    {
      title: "Little Miss Sunshine",
      reason: "Porque acompaña con ternura y una calidez que no fuerza nada.",
      tone: "Reconocida",
    },
    {
      title: "Chef",
      reason: "Porque tiene un ritmo amable y una energía reconfortante.",
      tone: "Cercana",
    },
    {
      title: "Columbus",
      reason: "Porque su silencio y su mirada pausada ayudan a bajar el ruido.",
      tone: "Inesperada",
    },
  ],
  "Necesito motivación": [
    {
      title: "Rocky",
      reason: "Porque recuerda que avanzar también es insistir cuando cuesta.",
      tone: "Reconocida",
    },
    {
      title: "The Pursuit of Happyness",
      reason: "Porque conecta con el esfuerzo sin perder humanidad.",
      tone: "Cercana",
    },
    {
      title: "Whiplash",
      reason: "Porque canaliza intensidad y empuje, aunque desde un lugar más exigente.",
      tone: "Inesperada",
    },
  ],
  "Me apetece algo profundo": [
    {
      title: "Interstellar",
      reason: "Porque mezcla emoción, tiempo y preguntas grandes de forma accesible.",
      tone: "Reconocida",
    },
    {
      title: "Arrival",
      reason: "Porque invita a sentir y pensar al mismo tiempo, con calma.",
      tone: "Cercana",
    },
    {
      title: "A Ghost Story",
      reason: "Porque se queda en lugares difíciles de nombrar y lo hace con delicadeza.",
      tone: "Inesperada",
    },
  ],
  "Quiero aventura": [
    {
      title: "Into the Wild",
      reason: "Porque abre el deseo de salir, explorar y mirar más lejos.",
      tone: "Reconocida",
    },
    {
      title: "The Way",
      reason: "Porque convierte el viaje en algo emocionalmente cercano y humano.",
      tone: "Cercana",
    },
    {
      title: "Captain Fantastic",
      reason: "Porque se siente libre, extraña y estimulante a la vez.",
      tone: "Inesperada",
    },
  ],
};

const toneLabels = {
  Reconocida: "Más conocida",
  Cercana: "Emocional y accesible",
  Inesperada: "Un poco más inesperada",
};

function Result({ mood, onBack }) {
  const movies = recommendationsByMood[mood] || [];

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

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl md:text-[3.1rem]">
              Para ti, hoy
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
              Tres películas elegidas para este momento. Distintas entre sí,
              pero con una misma intención: acompañarte bien ahora.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {movies.map((movie, index) => (
              <article
                key={movie.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur"
              >
                <div className="flex aspect-[4/5] items-end rounded-2xl border border-white/8 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13] p-4">
                  <div className="w-full">
                    <div className="mb-3 inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-[#d7c29d]">
                      {toneLabels[movie.tone]}
                    </div>
                    <div className="text-sm text-white/45">
                      Recomendación {index + 1}
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <h2 className="text-2xl font-semibold leading-tight text-white">
                    {movie.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    {movie.reason}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Result;
