import { useNavigate, useParams } from "react-router-dom";
import lifeAreas from "../data/lifeAreas";

const areaLabelOverrides = {
  personal: "Desarrollo personal",
};

function AreaDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const area = lifeAreas.find((item) => item.key === key);

  if (!area) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
          <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16 sm:px-10 sm:py-20">
          <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-10">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
              AREA
            </p>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Área no encontrada
            </h1>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-8 inline-flex rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
            >
              Volver
            </button>
          </div>
        </section>
      </main>
    );
  }

  const displayTitle = areaLabelOverrides[area.key] || area.title;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-14 sm:px-10 sm:py-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 text-sm text-white/60 transition hover:text-white"
        >
          ← Volver
        </button>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-10">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
            ÁREA DE VIDA
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            {displayTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            {area.description}
          </p>
          <p className="mt-8 text-sm text-white/52">
            Esta página es un placeholder temporal para la futura experiencia de áreas.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AreaDetail;
