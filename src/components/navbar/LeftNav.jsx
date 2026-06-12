import React from "react";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { Bookmark, Menu, X, ChevronDown } from "lucide-react";
import useFetchMovies from "../custom-hook/useFetchMovies";

// Nav tabs config — type: "dropdown" renders genre menu, type: "link" renders a route
const NAVTABS = [
  { label: "Home", path: "/", type: "link" },
  { label: "Movies", path: "/movies", type: "link" },
  { label: "TV Shows", path: "/tvshows", type: "link" },
  { label: "Anime", path: "/anime", type: "link" },
  { label: "Genres", path: "", type: "dropdown" },
  {
    label: "Watchlist",
    path: "/watchlist",
    type: "link",
    icon: <Bookmark size={18} />,
  },
];

const LeftNav = ({ menuOpen, setMenuOpen }) => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;
  const { pathname } = useLocation();

  // Fetch genre list for desktop dropdown
  const { data, loading, error } = useFetchMovies(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_Key}`,
  );

  return (
    <div className="flex items-center shrink-0 justify-between w-full lg:w-auto lg:gap-8">
      <div className="logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="left-nav hidden lg:flex gap-12">
        {NAVTABS.map((tab) => {
          if (tab.type === "dropdown") {
            return (
              <div key={tab.label} className="relative group z-20">
                <button className="hover:bg-overlay rounded-xl transition-all duration-300 flex items-center px-2 py-1">
                  {tab.label}
                  <ChevronDown size={18} />
                </button>

                {/* Dropdown visible on hover via Tailwind group-hover */}
                <div className="genre-list-wrapper scrollbar-dark absolute hidden group-hover:block bg-elevated px-2 py-1 w-52 max-h-80 overflow-y-auto rounded-xl shadow-lg">
                  {/* Loading state */}
                  {loading && (
                    <p className="text-sm text-gray-400 p-2">
                      Loading genres...
                    </p>
                  )}

                  {/* Error state */}
                  {!loading && error && (
                    <p className="text-sm text-red-400 p-2">Failed to load</p>
                  )}

                  {/* Genres list */}
                  {!loading && !error && data?.genres && (
                    <ul className="space-y-2">
                      {data.genres?.map((genre) => (
                        <li
                          key={genre.id}
                          className="cursor-pointer hover:bg-overlay rounded p-1"
                        >
                          <Link
                            to={`/genre/${genre.id}/${genre.name}`}
                            className="block"
                          >
                            {genre.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          }

          // Active route gets bottom border highlight
          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`flex items-center rounded-xl gap-1 hover:bg-overlay px-2 py-1 transition-all duration-300 ${pathname === tab.path ? "border-b-2 border-white" : "hover:bg-overlay"}`}
            >
              {tab.label}
              {tab.icon && tab.icon}
            </Link>
          );
        })}
      </div>

      {/* Hamburger / Close toggle — mobile only */}
      {
        <button
          className="flex lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      }
    </div>
  );
};

export default LeftNav;
