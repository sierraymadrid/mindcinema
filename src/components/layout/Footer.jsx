import { NavLink } from "react-router-dom";
import Container from "./Container";

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-[#05070b]">
      <Container>
        <div className="flex flex-col gap-4 py-6 text-sm text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-6">
            MVP creado por{" "}
            <a
              href="https://gemmasierra.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/72 transition hover:text-white"
            >
              Gemma Sierra
            </a>
            <br />
            con la API de TMDB
          </p>

          <div className="flex items-center gap-4">
            <NavLink to="/" className="transition hover:text-white">
              Inicio
            </NavLink>
            <NavLink to="/about" className="transition hover:text-white">
              Sobre MindCinema
            </NavLink>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
