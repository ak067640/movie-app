import React, { useContext, useMemo, useRef, useState } from "react";
import useFetchMovies from "../custom-hook/useFetchMovies";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Star, X } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import ActionButtons from "../ActionButtons";
import useTrailer from "../custom-hook/useTrailer";
import { useNavigate } from "react-router-dom";
import MovieActionsContext from "../context/MovieActionsContext";

// Fisher-Yates shuffle — ensures random banner order on every render
const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

// type: "movie" | "tv" | "anime" | "all" — controls which content pool is shown
// customUrl: optional override for TV fetch (used on specific pages)
const Banner = ({ type = "all", customUrl = null }) => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;

  // Tracks which slide's trailer is currently playing
  const [activeMovieId, setActiveMovieId] = useState(null);

  // Swiper ref — used to manually pause/resume autoplay during trailer
  const swipeRef = useRef(null);

  const navigate = useNavigate();

  const {
    data: moviesData,
    loading: moviesLoading,
    error: MoviesError,
  } = useFetchMovies(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_Key}`,
  );

  const { watchList, addTOWatchList, removeFromWatchList } =
    useContext(MovieActionsContext);

  const {
    data: tvData,
    loading: tvLoading,
    error: tvError,
  } = useFetchMovies(
    customUrl ||
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_Key}`,
  );

  // COMBINE ALL moviesData and tvData into single array
  // Merge movies + TV, filter by type, shuffle, limit to 4 slides
  // useMemo prevents re-shuffling on every render
  const allContent = useMemo(() => {
    const movies = (moviesData?.results || []).map((item) => ({
      ...item,
      media_type: "movie",
    }));

    const tvShows = (tvData?.results || []).map((item) => ({
      ...item,
      media_type: "tv",
    }));

    let pool;
    if (type === "movie") pool = movies;
    else if (type === "tv") pool = tvShows;
    else if (type === "anime") pool = tvShows;
    else pool = [...movies, ...tvShows];

    return shuffleArray(pool).slice(0, 4);
  }, [moviesData, tvData, type]);

  const { trailerKey, videoError, fetchTrailer, closeTrailer } = useTrailer();

  // LOADING
  if (moviesLoading || tvLoading) {
    return (
      <div className="min-h-[60vh] lg:min-h-[90vh] bg-gray-900 animate-pulse relative">
        {/* Fake image area */}
        <div className="absolute inset-0 bg-gray-800" />

        {/* Fake content - bottom left */}
        <div className="absolute inset-0 flex items-end pb-14 lg:pb-0 lg:items-center px-5 lg:px-10">
          <div className="flex flex-col gap-4 w-full lg:w-[50%]">
            <div className="h-3 w-24 bg-gray-700 rounded" /> {/* label */}
            <div className="h-8 w-72 bg-gray-700 rounded" /> {/* title */}
            <div className="h-3 w-20 bg-gray-700 rounded" /> {/* rating */}
            <div className="h-16 w-full bg-gray-700 rounded" />
            {/* overview */}
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-gray-700 rounded-full" />
              {/* button 1 */}
              <div className="h-10 w-28 bg-gray-700 rounded-full" />
              {/* button 2 */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR
  if (MoviesError || tvError) {
    return (
      <div className="min-h-[60vh] lg:min-h-[90vh] bg-gray-900 flex items-center justify-center">
        <p className="text-red-400 text-lg">Failed to load banner</p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] lg:min-h-[90vh] cursor-default">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        // Disable swipe while trailer is playing to prevent accidental slide change
        allowTouchMove={!trailerKey}
        loop={allContent.length >= 4}
        pagination={{ clickable: true }}
        effect="fade"
        className="pb-10"
        onSwiper={(swiper) => (swipeRef.current = swiper)}
      >
        {allContent.map((movie) => {
          const isInWatchList = watchList.some((item) => item.id === movie.id);

          const handleWatchList = () => {
            if (!movie) return;
            if (isInWatchList) {
              removeFromWatchList(movie.id);
            } else {
              addTOWatchList({
                id: movie.id,
                title: movie.title,
                name: movie.name,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
              });
            }
          };

          const title = movie.media_type === "tv" ? movie.name : movie.title;
          const date =
            movie.media_type === "tv"
              ? movie.first_air_date.split("-")[0]
              : movie.release_date.split("-")[0];

          // Anime detection: genre_id 16 = Animation on TMDB
          const label =
            movie.genre_ids?.includes(16) && movie.media_type === "tv"
              ? "Trending Anime"
              : movie.media_type === "tv"
                ? "Trending TV Show"
                : "Trending Movie";

          return (
            <SwiperSlide key={`${movie.media_type}-${movie.id}`}>
              <div className="relative w-full min-h-[60vh] lg:min-h-[90vh] overflow-hidden">
                {/* Trailer iframe — shown only for the active slide */}
                {trailerKey && activeMovieId === movie.id ? (
                  <div className="absolute inset-0 w-full h-full z-50">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1&rel=0`}
                      frameBorder="0"
                      allowFullScreen
                    />

                    {/* DARK OVERLAY */}
                    <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

                    {/* Close trailer and resume autoplay */}
                    <button
                      onClick={() => {
                        closeTrailer();
                        swipeRef?.current?.autoplay.start();
                      }}
                      className="absolute top-5 right-5 z-50 bg-black/70 hover:bg-black transition p-2 rounded-full text-white cursor-pointer"
                    >
                      <X size={24} />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* =========================BACKGROUND IMAGE========================== */}

                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
                      }}
                    ></div>

                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent"></div>

                    {/* =========================CONTENT========================== */}

                    <div className="absolute inset-0 flex items-end pb-14 lg:pb-0 lg:items-center text-white px-5 lg:px-10">
                      <div className="flex flex-col gap-3 lg:gap-5 w-full lg:w-[50%]">
                        {/* LABEL */}
                        <h1 className="text-xs lg:text-sm text-gray-300">
                          {label}
                        </h1>

                        {/* TITLE */}
                        <h2 className="font-bold text-2xl sm:text-3xl lg:text-5xl leading-tight">
                          <span
                            onClick={() =>
                              navigate(
                                `/movie/${movie.id}?type=${movie.media_type}`,
                              )
                            }
                            className="cursor-pointer hover:underline"
                          >
                            {title}
                          </span>
                        </h2>

                        {/* RATING + DATE */}
                        <div className="flex gap-4 text-xs lg:text-sm">
                          <span className="flex gap-1 items-center text-gold">
                            <Star size={16} fill="gold" stroke="none" />
                            {movie.vote_average?.toFixed(1)}
                          </span>

                          <span className="text-gray-300">{date}</span>
                        </div>

                        {/* OVERVIEW */}
                        <p className="text-xs sm:text-sm lg:text-primary text-primary line-clamp-2 lg:line-clamp-3 max-w-full lg:max-w-[90%]">
                          {movie.overview}
                        </p>

                        {/* BUTTONS */}
                        <ActionButtons
                          banner={true}
                          onTrailerClick={() => {
                            fetchTrailer(movie.id, movie.media_type);
                            setActiveMovieId(movie.id);
                            // Stop autoplay so trailer isn't interrupted by slide change
                            swipeRef?.current?.autoplay.stop();
                          }}
                          onWatchListClick={handleWatchList}
                          isInWatchList={isInWatchList}
                        />

                        {/* VIDEO ERROR */}
                        {videoError && (
                          <p className="text-red-400 text-sm">{videoError}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Banner;
