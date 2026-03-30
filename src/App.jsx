function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#07090e] to-[#05070b]" />
        <div className="absolute left-1/2 top-[-14rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/4 h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-20 sm:px-10">
        <div className="w-full max-w-4xl text-center">
          <p className="mb-6 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[#d2b98b]">
            CINE PARA CRECER
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl md:text-6xl md:leading-[1.02] lg:text-7xl">
            La película adecuada, en el momento adecuado
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Para esas noches en las que no sabes qué ver, pero quieres algo con sentido.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="group inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#d8c39b]/20 bg-[linear-gradient(135deg,rgba(224,196,150,0.18),rgba(224,196,150,0.08))] px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#d8c39b]/40 hover:bg-[linear-gradient(135deg,rgba(224,196,150,0.26),rgba(224,196,150,0.12))] hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c39b]"
              >
                Recomendación rápida
              </button>
            </div>

            <div className="flex flex-col items-center">
              <button
                type="button"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Explorar mi momento
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
