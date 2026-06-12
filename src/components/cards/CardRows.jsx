import React, { useEffect, useRef, useState } from "react";
import { MoveRight } from "lucide-react";
import useFetchMovies from "../custom-hook/useFetchMovies";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

// Accepts either a `url` (fetches data) or `movies` prop (uses pre-fetched data)
const CardRows = ({ title, url, movies: propMovies }) => {
  const slideRef = useRef();
  const navigate = useNavigate();

  // Controls chevron visibility based on scroll position
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const { data: fetchedData, loading, error } = useFetchMovies(url || null);

  // If url provided, use fetched data — otherwise use movies passed as prop
  const movies = url ? fetchedData?.results : propMovies;

  // Show right chevron on mount if content overflows the container
  useEffect(() => {
    const element = slideRef.current;
    if (!element) return;
    setShowRight(element.scrollWidth > element.clientWidth);
  }, [movies]);

  // Update chevron visibility dynamically as user scrolls
  const handleScroll = () => {
    const element = slideRef.current;
    setShowLeft(element.scrollLeft > 0);
    setShowRight(
      Math.round(element.scrollLeft) <
        element.scrollWidth - element.clientWidth,
    );
  };

  const slideLeft = () => {
    slideRef.current.scrollBy({ left: -1500, behavior: "smooth" });
  };

  const slideRight = () => {
    slideRef.current.scrollBy({ left: 1500, behavior: "smooth" });
  };

  // LOADING
  if (url && loading) {
    return (
      <div className="px-5 lg:px-10 mb-4">
        <div className="h-5 w-40 bg-gray-700 animate-pulse rounded mb-3" />
        <div className="flex gap-3 py-5 overflow-hidden">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-32 sm:w-36 md:w-40 aspect-2/3 rounded-lg bg-gray-800 animate-pulse shrink-0"
              />
            ))}
        </div>
      </div>
    );
  }

  // ERROR
  if (url && error) {
    return null;
  }
  if (!movies || movies.length === 0) return null;
  return (
    <>
      <div className="flex justify-between text-primary px-5 lg:px-10 text-sm lg:text-lg">
        <span className="font-bold">{title}</span>

        {/* "See All" navigates to a full category page with title + url as query params */}
        {url && (
          <button
            onClick={() =>
              navigate(
                `/category?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
              )
            }
            className="flex items-center gap-1 cursor-pointer"
          >
            see All <MoveRight size={15} />
          </button>
        )}
      </div>

      <div className="scroll-container group relative">
        {/* Left chevron — hidden until user scrolls right */}
        <button
          onClick={slideLeft}
          className={`absolute rounded cursor-pointer left-0 top-0 h-full z-60 bg-black/50 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showLeft ? "visible" : "invisible"}`}
        >
          <ChevronLeft size={40} color="white" />
        </button>

        {/* Scrollable cards */}
        <div
          className="flex gap-3 items-center py-5 px-5 lg:px-10 overflow-x-auto scrollbar-hide"
          ref={slideRef}
          onScroll={handleScroll}
        >
          {movies?.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>
        
        {/* Right chevron — hidden when scrolled to end */}
        <button
          onClick={slideRight}
          className={`absolute rounded cursor-pointer right-0 top-0 h-full z-60 bg-black/50 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showRight ? "visible" : "invisible"}`}
        >
          <ChevronRight size={40} color="white" />
        </button>
      </div>
    </>
  );
};

export default CardRows;
