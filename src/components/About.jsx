import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applySeo } from "../utils/seo";

function About() {
  const navigate = useNavigate();

  useEffect(() => {
    applySeo({ title: "Sobre MindCinema" });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16 sm:px-10 sm:py-20">
        <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-10">
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
            SOBRE MINDCINEMA
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Elegir qué ver con sentido
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
            MindCinema es una app de recomendación de películas orientada al momento
            vital y emocional del usuario: películas para acompañar tu momento, no
            para perderte en un catálogo.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
            Aquí explicaremos qué es MindCinema, por qué existe y cómo usa el cine
            para acompañar distintos momentos vitales.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/quick")}
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))]"
            >
              Recomendación rápida
            </button>

            <button
              type="button"
              onClick={() => navigate("/test")}
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
            >
              Explorar tu momento
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 inline-flex rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
          >
            Volver al inicio
          </button>
        </div>
      </section>
    </main>
  );
}

export default About;
