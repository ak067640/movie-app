import React, { useState } from "react";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import useFetchMovies from "../custom-hook/useFetchMovies";

const MOBILE_LINKS = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "TV Shows", path: "/tvshows" },
  { label: "Anime", path: "/anime" },
  { label: "Watchlist 🔖", path: "/watchlist" },
];

const NavBar = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;
  const [menuOpen, setMenuOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const { pathname } = useLocation();

  // Genre fetch only triggers when mobile menu is open — avoids unnecessary API call
  const { data, loading, error } = useFetchMovies(
    menuOpen
      ? `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_Key}`
      : null,
  );
  return (
    <div className="nav-bar text-white bg-surface px-6 flex flex-col ">
      <div className="min-h-16 flex gap-1 flex-wrap items-center justify-between">
        <LeftNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="w-full pb-3 lg:w-auto lg:pb-0">
          <RightNav />
        </div>
      </div>

      {/* MOBILE MENU — shown when hamburger is open */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-1 py-4 border-t border-[#333]">
          {/* navbar links */}
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-primary hover:bg-overlay px-3 py-2 rounded-lg transition-all ${
                pathname === link.path
                  ? "border-l-2 border-white pl-2"
                  : "hover:bg-overlay"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Genres accordion — chevron rotates on open */}
          <div>
            <button
              onClick={() => setGenreOpen((prev) => !prev)}
              aria-expanded={genreOpen}
              aria-controls="mobile-genres"
              className="w-full text-left text-primary hover:bg-overlay px-3 py-2 rounded-lg transition-all flex items-center justify-between"
            >
              Genres
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${genreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {genreOpen && (
              <div
                id="mobile-genres"
                className="ml-4 mt-1 flex flex-col gap-1 max-h-52 overflow-y-auto scrollbar-dark rounded-lg bg-elevated p-1 pr-2"
              >
                {loading && (
                  <p className="text-sm text-gray-400 px-3 py-2">Loading...</p>
                )}
                {error && (
                  <p className="text-sm text-red-400 px-3 py-2">
                    Failed to load
                  </p>
                )}
                {!loading &&
                  !error &&
                  data?.genres?.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/genre/${genre.id}/${genre.name}`}
                      onClick={() => {
                        setMenuOpen(false);
                        setGenreOpen(false);
                      }}
                      className="text-secondary hover:text-primary hover:bg-overlay px-3 py-1.5 rounded-lg text-sm transition-all"
                    >
                      {genre.name}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
