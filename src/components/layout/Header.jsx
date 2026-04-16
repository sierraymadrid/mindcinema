import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Container from "./Container";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/quick", label: "Recomendación rápida" },
  { to: "/test", label: "Explorar tu momento" },
  { to: "/about", label: "Sobre MindCinema" },
];

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#05070b]/78 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-6 py-3">
          <NavLink
            to="/"
            className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d2b98b] transition hover:text-[#e3cfaa] sm:text-sm"
          >
            MindCinema
          </NavLink>

          <button
            type="button"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/78 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Cerrar navegación" : "Abrir navegación"}
          >
            <span className="sr-only">
              {isMenuOpen ? "Cerrar navegación" : "Abrir navegación"}
            </span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            >
              {isMenuOpen ? (
                <>
                  <path d="M6 6 18 18" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>

          <nav className="hidden items-center gap-4 text-sm text-white/62 sm:flex sm:gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "transition hover:text-white",
                    isActive ? "text-white" : "text-white/62",
                  ].join(" ")
                }
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {isMenuOpen ? (
          <nav className="border-t border-white/8 pb-4 pt-3 sm:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "rounded-2xl px-3 py-2.5 text-sm transition",
                      isActive
                        ? "bg-white/[0.06] text-white"
                        : "text-white/68 hover:bg-white/[0.03] hover:text-white",
                    ].join(" ")
                  }
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        ) : null}
      </Container>
    </header>
  );
}

export default Header;
