import { NavLink } from "react-router-dom";
import Container from "./Container";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/quick", label: "Quick" },
  { to: "/test", label: "Test" },
  { to: "/about", label: "About" },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#05070b]/78 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-6">
          <NavLink
            to="/"
            className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d2b98b] transition hover:text-[#e3cfaa]"
          >
            MindCinema
          </NavLink>

          <nav className="flex items-center gap-4 text-sm text-white/62 sm:gap-6">
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
      </Container>
    </header>
  );
}

export default Header;
