import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TMDB_IMAGE_BASE_URL } from "../services/tmdb";
import { getAreaPath } from "../utils/lifeAreas";

function MovieCard({ areaKey, areaTitle, movie, layout }) {
  const cardWidthClasses =
    layout === "row"
      ? "w-[130px] shrink-0 sm:w-[140px] md:w-[150px] lg:w-[155px]"
      : "w-full";
  const contentSpacingClasses = layout === "row" ? "pt-3" : "pt-0";

  return (
    <Link
      to={`/movie/${movie.tmdbId}`}
      state={{
        from: areaKey ? getAreaPath(areaKey) : "/",
        lifeArea: areaKey || areaTitle,
      }}
      className={`group block transition duration-300 hover:-translate-y-0.5 ${cardWidthClasses}`}
    >
      <div className="rounded-[18px] border border-white/8 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[18px]">
        {movie.posterPath ? (
          <img
            src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[0.6rem] uppercase tracking-[0.22em] text-white/28">
              MindCinema
            </span>
          </div>
        )}
        </div>
      </div>

      {layout === "row" ? (
        <div className={contentSpacingClasses}>
          <h3 className="line-clamp-2 text-[0.84rem] font-semibold leading-[1.2] text-white/95 sm:text-[0.9rem]">
            {movie.title}
          </h3>
        </div>
      ) : null}
    </Link>
  );
}

function RowMoreCard({ ctaLabel, ctaTo }) {
  return (
    <Link
      to={ctaTo}
      className="group block w-[130px] shrink-0 transition duration-300 hover:-translate-y-0.5 sm:w-[140px] md:w-[150px] lg:w-[155px]"
    >
      <div className="relative flex aspect-[2/3] items-center justify-center overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4 text-center shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(210,185,139,0.12),transparent_60%)] opacity-80 transition duration-300 group-hover:opacity-100" />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/72 transition group-hover:border-white/20 group-hover:text-white">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
          </span>
          <p className="mt-4 text-[1.05rem] font-semibold leading-tight text-white">
            {ctaLabel}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ScrollArrow({ direction, onClick }) {
  const basePosition =
    direction === "left"
      ? "left-0 -translate-x-1/2"
      : "right-0 translate-x-1/2";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-[38%] z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[#05070b]/82 text-white/78 shadow-[0_16px_36px_rgba(0,0,0,0.38)] backdrop-blur transition duration-300 hover:border-white/20 hover:bg-[#0b0f18] hover:text-white group-hover:flex ${basePosition} lg:flex lg:opacity-0 lg:pointer-events-none lg:group-hover:pointer-events-auto lg:group-hover:opacity-100`}
      aria-label={direction === "left" ? "Ver anteriores" : "Ver más"}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "left" ? (
          <path d="m15 5-7 7 7 7" />
        ) : (
          <path d="m9 5 7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

function MovieGrid({
  areaKey,
  areaTitle,
  description,
  movies,
  ctaLabel,
  ctaTo,
  layout = "grid",
}) {
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isRow = layout === "row";
  const sectionClasses = isRow
    ? ""
    : "rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8";
  const listClasses = isRow
    ? "mt-6 flex gap-2 overflow-x-auto scroll-smooth pb-3 no-scrollbar sm:gap-2.5"
    : "mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-y-10 lg:grid-cols-4 lg:gap-y-12";

  useEffect(() => {
    if (!isRow) {
      return undefined;
    }

    const listElement = listRef.current;

    if (!listElement) {
      return undefined;
    }

    function updateScrollState() {
      const maxScrollLeft = listElement.scrollWidth - listElement.clientWidth;

      setCanScrollLeft(listElement.scrollLeft > 8);
      setCanScrollRight(listElement.scrollLeft < maxScrollLeft - 8);
    }

    updateScrollState();
    listElement.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      listElement.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isRow, movies.length]);

  function handleRowScroll(direction) {
    const listElement = listRef.current;

    if (!listElement) {
      return;
    }

    const firstCard = listElement.querySelector("[data-row-card]");
    const firstCardWidth = firstCard instanceof HTMLElement ? firstCard.offsetWidth : 150;
    const gap = 10;
    const cardsPerStep = 4;
    const offset = (firstCardWidth + gap) * cardsPerStep;

    listElement.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  }

  return (
    <section className={sectionClasses}>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div className={isRow ? "" : "max-w-2xl"}>
          <h2
            className={
              isRow
                ? "text-[1.55rem] font-semibold tracking-tight text-white sm:text-[1.85rem] lg:text-[2.1rem]"
                : "text-[1.8rem] font-semibold tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl"
            }
          >
            {areaTitle}
          </h2>
          {description ? (
            <p
              className={
                isRow
                  ? "mt-2 max-w-2xl text-sm leading-6 text-white/56 sm:text-base sm:leading-7"
                  : "mt-4 text-sm leading-6 text-white/62 sm:text-base sm:leading-7 lg:text-lg lg:leading-8"
              }
            >
              {description}
            </p>
          ) : null}
        </div>

        {!isRow && ctaLabel && ctaTo ? (
          <Link
            to={ctaTo}
            className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-xs font-medium text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white sm:w-auto sm:shrink-0 sm:py-1.5"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>

      {movies.length ? (
        <div className={isRow ? "group relative" : ""}>
          {isRow && canScrollLeft ? (
            <ScrollArrow
              direction="left"
              onClick={() => handleRowScroll("left")}
            />
          ) : null}

          {isRow && canScrollRight ? (
            <ScrollArrow
              direction="right"
              onClick={() => handleRowScroll("right")}
            />
          ) : null}

          <div ref={listRef} className={listClasses}>
            {movies.map((movie) => (
              <div
                key={`${areaKey || areaTitle}-${movie.tmdbId}`}
                data-row-card={isRow ? "true" : undefined}
              >
                <MovieCard
                  areaKey={areaKey}
                  areaTitle={areaTitle}
                  movie={movie}
                  layout={layout}
                />
              </div>
            ))}

            {isRow && ctaLabel && ctaTo ? (
              <RowMoreCard
                ctaLabel={ctaLabel}
                ctaTo={ctaTo}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <p className="mt-6 text-base leading-7 text-white/56">
          Todavía no tenemos películas disponibles para esta área.
        </p>
      )}
    </section>
  );
}

export default MovieGrid;
