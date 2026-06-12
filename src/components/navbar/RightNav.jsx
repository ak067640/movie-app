import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useDebounce from "../custom-hook/useDebounce";

const RightNav = () => {
  const [query, setQuerry] = useState("");
  const debounceQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const location = useLocation();

  // Track the last non-search page to navigate back when query is cleared
  const previousPath = useRef(location.pathname);
  const isFirstRender = useRef(true);
  const isSearchPage = location.pathname.includes("/search");

  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    // Skip navigation on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debounceQuery.trim()) {
      // Infer search type from the page user came from
      const type = previousPath.current.includes("/movie")
        ? "movie"
        : previousPath.current.includes("/tvshows")
          ? "tv"
          : previousPath.current.includes("anime")
            ? "anime"
            : "multi";
      navigate(`/search?q=${debounceQuery}&type=${type}`);
    } else {
      // Empty query — go back to previous page
      navigate(previousPath.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceQuery]);

  return (
    <>
      <div className="flex gap-3 justify-between items-center">
        <div
          className="input-wrapper flex items-center gap-1 bg-overlay rounded-full px-2 py-2 lg:py-2 lg:px-3 
                w-48 sm:w-48 lg:w-64"
        >
          <button className="cursor-pointer">
            <Search size={18} />
          </button>
          {/* Show input value only on search page to avoid stale text on navigation */}
          <input
            value={isSearchPage ? query : ""}
            onChange={(e) => setQuerry(e.target.value)}
            className="outline-none bg-transparent flex-1"
            type="text"
            placeholder="Search movies..."
          />
        </div>
      </div>
    </>
  );
};

export default RightNav;
