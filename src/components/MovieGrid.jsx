import { Link } from "react-router-dom";
import { TMDB_IMAGE_BASE_URL } from "../services/tmdb";
import { getAreaPath } from "../utils/lifeAreas";

function MovieCard({ areaKey, areaTitle, movie, layout }) {
  const cardWidthClasses =
    layout === "row"
      ? "w-[130px] shrink-0 sm:w-[140px] md:w-[150px] lg:w-[155px]"
      : "w-full";

  return (
    <Link
      to={`/movie/${movie.tmdbId}`}
      state={{
        from: areaKey ? getAreaPath(areaKey) : "/",
        lifeArea: areaKey || areaTitle,
      }}
      className={`group block transition duration-300 hover:-translate-y-0.5 ${cardWidthClasses}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[18px] border border-white/8 bg-gradient-to-b from-[#1a2029] via-[#10151d] to-[#0a0d13] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
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

      <div className="pt-3">
        <h3 className="line-clamp-2 text-[0.84rem] font-semibold leading-[1.2] text-white/95 sm:text-[0.9rem]">
          {movie.title}
        </h3>
      </div>
    </Link>
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
  const isRow = layout === "row";
  const sectionClasses = isRow
    ? ""
    : "rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8";
  const listClasses = isRow
    ? "mt-6 flex gap-2 overflow-x-auto pb-3 no-scrollbar sm:gap-2.5"
    : "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <section className={sectionClasses}>
      <div className="flex items-start justify-between gap-4">
        <div className={isRow ? "" : "max-w-2xl"}>
          <h2 className={isRow ? "text-[1.85rem] font-semibold tracking-tight text-white sm:text-[2.1rem] lg:text-[2.25rem]" : "text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl"}>
            {areaTitle}
          </h2>
          {description ? (
            <p className={isRow ? "mt-2 max-w-2xl text-sm leading-6 text-white/56 sm:text-base sm:leading-7" : "mt-4 text-base leading-7 text-white/62 sm:text-lg sm:leading-8"}>
              {description}
            </p>
          ) : null}
        </div>

        {ctaLabel && ctaTo ? (
          <Link
            to={ctaTo}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>

      {movies.length ? (
        <div className={listClasses}>
          {movies.map((movie) => (
            <MovieCard
              key={`${areaKey || areaTitle}-${movie.tmdbId}`}
              areaKey={areaKey}
              areaTitle={areaTitle}
              movie={movie}
              layout={layout}
            />
          ))}
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
