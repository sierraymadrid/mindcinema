import { useRef } from "react";

const recommendationsByMood = {
  "Necesito inspiración": [
    {
      title: "Dead Poets Society",
      reason: "Una invitación directa a mirar la vida con más deseo y propósito.",
      label: "Más conocida",
    },
    {
      title: "Good Will Hunting",
      reason: "Ganadora del Oscar al guion, con emoción genuina y pulso inspirador.",
      label: "Premiada",
    },
    {
      title: "Paterson",
      reason: "Pequeña, delicada y observadora; encuentra sentido en lo cotidiano.",
      label: "Independiente",
    },
    {
      title: "The Secret Life of Walter Mitty",
      reason: "Aventura íntima y luminosa que convirtió la búsqueda personal en icono reciente.",
      label: "Un clásico",
    },
  ],
  "Quiero reflexionar": [
    {
      title: "Her",
      reason: "Abre preguntas íntimas sobre el amor, la soledad y lo que sentimos.",
      label: "Más conocida",
    },
    {
      title: "Moonlight",
      reason: "Oscar a mejor película y una mirada sensible sobre identidad y memoria.",
      label: "Premiada",
    },
    {
      title: "After Yang",
      reason: "Sutil y contemplativa, deja espacio para pensar sin imponerse.",
      label: "Independiente",
    },
    {
      title: "Perfect Days",
      reason: "Serena y precisa, ya se siente como una referencia reciente del cine humanista.",
      label: "Un clásico",
    },
  ],
  "Busco calma": [
    {
      title: "Chef",
      reason: "Ligera y reconfortante, con una energía amable que baja el ruido.",
      label: "Más conocida",
    },
    {
      title: "Minari",
      reason: "Premiada y cálida, encuentra emoción sin elevar nunca el tono.",
      label: "Premiada",
    },
    {
      title: "Columbus",
      reason: "Arquitectura, silencio y pausa en una película que respira contigo.",
      label: "Independiente",
    },
    {
      title: "Perfect Days",
      reason: "Rutina, luz y atención convertidas en una calma profundamente contemporánea.",
      label: "Un clásico",
    },
  ],
  "Necesito motivación": [
    {
      title: "Rocky",
      reason: "Recuerda que avanzar también es insistir cuando todo cuesta más.",
      label: "Más conocida",
    },
    {
      title: "Chariots of Fire",
      reason: "Clásico premiado sobre disciplina, fe y ambición sostenida.",
      label: "Premiada",
    },
    {
      title: "Whiplash",
      reason: "Intensa y afilada, transforma la exigencia en combustible narrativo.",
      label: "Independiente",
    },
    {
      title: "The Pursuit of Happyness",
      reason: "Un referente reciente del cine de superación contado con cercanía.",
      label: "Un clásico",
    },
  ],
  "Me apetece algo profundo": [
    {
      title: "Interstellar",
      reason: "Mezcla emoción, tiempo y preguntas grandes con una escala muy humana.",
      label: "Más conocida",
    },
    {
      title: "Arrival",
      reason: "Reconocida por su guion y su sensibilidad para pensar desde la emoción.",
      label: "Premiada",
    },
    {
      title: "A Ghost Story",
      reason: "Minimalista y radical, se queda en lugares difíciles de nombrar.",
      label: "Independiente",
    },
    {
      title: "Her",
      reason: "Ya funciona como clásico moderno para pensar vínculos, tecnología y vacío.",
      label: "Un clásico",
    },
  ],
  "Quiero aventura": [
    {
      title: "Into the Wild",
      reason: "Abre el deseo de salir, explorar y mirar el mundo un poco más lejos.",
      label: "Más conocida",
    },
    {
      title: "Life of Pi",
      reason: "Multipremiada y visualmente envolvente, convierte el viaje en una prueba interior.",
      label: "Premiada",
    },
    {
      title: "Captain Fantastic",
      reason: "Libre, extraña y estimulante; aventura con una voz muy propia.",
      label: "Independiente",
    },
    {
      title: "The Way",
      reason: "Un viaje sobrio y humano que ya ocupa su lugar entre los relatos recientes más queridos.",
      label: "Un clásico",
    },
  ],
};

function Result({ mood, onBack }) {
  const movies = recommendationsByMood[mood] || [];
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    const { clientWidth } = carouselRef.current;
    carouselRef.current.scrollBy({
      left: direction * clientWidth * 0.72,
      behavior: "smooth",
    });
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

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl md:text-[3.1rem]">
              Para ti, hoy
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
              Cuatro elecciones distintas, ordenadas con un criterio claro para
              este momento.
            </p>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-center justify-end gap-2">
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scrollCarousel(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/72 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Ver recomendaciones anteriores"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/72 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Ver más recomendaciones"
                >
                  →
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 pr-12 sm:-mx-10 sm:px-10 sm:pr-16 lg:pr-28"
            >
              {movies.slice(0, 4).map((movie) => (
                <article
                  key={movie.title}
                  className="w-[86vw] max-w-[26rem] shrink-0 snap-start rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:w-[30rem] lg:w-[calc((100%-2.5rem)/3.28)]"
                >
                  <div className="flex aspect-[5/4] items-end rounded-2xl border border-white/8 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13] p-5">
                    <div className="w-full">
                      <div className="inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-[#d7c29d]">
                        {movie.label}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <h2 className="text-[1.7rem] font-semibold leading-tight text-white">
                      {movie.title}
                    </h2>
                    <p className="mt-3 max-w-[34ch] text-sm leading-6 text-white/68">
                      {movie.reason}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Result;
