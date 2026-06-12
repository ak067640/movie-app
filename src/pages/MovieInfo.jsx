import React, { useContext } from "react";
import useFetchMovies from "../components/custom-hook/useFetchMovies";
import { useParams, useSearchParams } from "react-router-dom";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import ActionButtons from "../components/ActionButtons";
import ProfileCard from "../components/cards/ProfileCard";
import CardRows from "../components/cards/CardRows";
import useTrailer from "../components/custom-hook/useTrailer";
import TrailerModal from "../components/TrailerModal";
import MovieActionsContext from "../components/context/MovieActionsContext";

const MovieInfo = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;
  const { id } = useParams();
  const [searchParam] = useSearchParams();

  // "movie" or "tv" — drives endpoint + UI labels
  const type = searchParam.get("type");

  // append_to_response consolidates credits + similar into one API call instead of three
  const {
    data: movie,
    loading,
    error,
  } = useFetchMovies(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_Key}&append_to_response=credits,similar`,
  );
  const {
    watchList,
    addTOWatchList,
    removeFromWatchList,
    likedMovies,
    addToLiked,
    removeFromLiked,
    dislikedMovies,
    addToDisliked,
    removeFromDisliked,
  } = useContext(MovieActionsContext);

  const isInWatchList = watchList.some((item) => item.id === movie?.id);
  const isLiked = likedMovies.some((item) => item.id === movie?.id);
  const isdisLiked = dislikedMovies.some((item) => item.id === movie?.id);

  const handleWatchList = () => {
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

  const handleLikes = () => {
    if (isLiked) {
      removeFromLiked(movie.id);
    } else {
      addToLiked({
        id: movie.id,
        title: movie.title,
        name: movie.name,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      });
    }
  };

  const handleDisLikes = () => {
    if (isdisLiked) {
      removeFromDisliked(movie.id);
    } else {
      addToDisliked({
        id: movie.id,
        title: movie.title,
        name: movie.name,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      });
    }
  };

  const { trailerKey, videoError, fetchTrailer, closeTrailer } = useTrailer();

  if (loading)
    return (
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-10 py-6">
        {/* Poster skeleton */}
        <div className="w-72 mx-auto lg:mx-0 aspect-2/3 rounded-2xl bg-gray-800 animate-pulse shrink-0" />

        {/* Info skeleton */}
        <div className="flex flex-col gap-4 w-full">
          {/* Title */}
          <div className="h-8 w-64 bg-gray-800 animate-pulse rounded" />
          {/* Year | Runtime */}
          <div className="h-4 w-32 bg-gray-800 animate-pulse rounded" />
          {/* Rating */}
          <div className="h-8 w-24 bg-gray-800 animate-pulse rounded" />
          {/* Genres */}
          <div className="flex gap-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-20 bg-gray-800 animate-pulse rounded-full"
                />
              ))}
          </div>
          {/* Overview lines */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-800 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-800 animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-gray-800 animate-pulse rounded" />
          </div>
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-36 bg-gray-800 animate-pulse rounded-full" />
            <div className="h-10 w-36 bg-gray-800 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-primary px-4">
        {/* Icon */}
        <div className="text-6xl">😵</div>

        {/* Message */}
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-secondary text-sm text-center">
          We couldn't load this movie. Please try again.
        </p>

        {/* Retry button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );

  // TV shows use episode_run_time (array), movies use runtime (number)
  const runTime = movie?.runtime || movie?.episode_run_time?.[0] || null;
  const hrs = runTime ? Math.floor(runTime / 60) + "h" : null;
  const min = runTime ? (runTime % 60) + "min" : null;

  return (
    <>
      <TrailerModal trailerKey={trailerKey} onClose={closeTrailer} />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-10 py-6 items-start">
        {/* Sticky poster — stays visible while scrolling through details on desktop */}
        <div className="w-full lg:w-auto lg:sticky lg:top-6 shrink-0">
          <img
            className="w-72 max-w-72 sm:max-w-[320px] lg:max-w-72 rounded-2xl mx-auto lg:mx-0 object-cover"
            src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
            alt={`${movie?.title || movie?.original_title || movie?.name}`}
          />

          {videoError && (
            <p className="text-red-400 text-sm mt-2">{videoError}</p>
          )}

          {movie?.tagline && (
            <p className="italic text-secondary mt-2 max-w-72 sm:max-w-[320px] lg:max-w-xs mx-auto lg:mx-0 text-sm">
              {movie?.tagline}
            </p>
          )}
        </div>

        <div className="flex text-primary flex-col gap-4 min-w-0 w-full">
          <h1 className="text-2xl font-bold leading-tight">
            {movie?.title || movie?.original_title || movie?.name}
          </h1>
          <div className="flex flex-wrap gap-3  ">
            <span>
              {movie?.release_date?.split("-")[0] ||
                movie?.first_air_date?.split("-")[0]}
            </span>
            <span>|</span>
            {runTime ? (
              <span>
                {hrs} {min}
              </span>
            ) : (
              <span>N/A</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold flex items-center gap-2 text-gold">
              <Star fill="gold" stroke="none" />{" "}
              {movie.vote_average?.toFixed(1)}
            </span>
            <button
              onClick={handleLikes}
              className="cursor-pointer active:scale-95"
            >
              {isLiked ? <ThumbsUp fill="blue" stroke="none" /> : <ThumbsUp />}
            </button>
            <button
              onClick={handleDisLikes}
              className="cursor-pointer active:scale-95"
            >
              {isdisLiked ? (
                <ThumbsDown fill="red" stroke="none" />
              ) : (
                <ThumbsDown />
              )}
            </button>
          </div>
          <div className="genre flex flex-wrap gap-2 sm:gap-3">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="border px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <div className="overview">
            <p className="leading-7 lg:leading-8">{movie?.overview}</p>
          </div>
          <div className="cast-crew space-y-4">
            {movie?.credits?.crew?.find((p) => p.job === "Director")?.name && (
              <div className="director flex gap-2">
                <span>Director:</span>
                <span>
                  {movie.credits.crew.find((p) => p.job === "Director").name}
                </span>
              </div>
            )}

            {movie?.credits?.crew?.find(
              (p) => p.job === "Screenplay" || p.job === "Writer",
            )?.name && (
              <div className="writer flex gap-2">
                <span>Writer:</span>
                <span>
                  {
                    movie.credits.crew.find(
                      (p) => p.job === "Screenplay" || p.job === "Writer",
                    ).name
                  }
                </span>
              </div>
            )}
            {movie?.credits?.cast?.length > 0 && (
              <div className="cast flex gap-2 flex-wrap">
                <span className="font-medium">Cast:</span>
                {/* Top 5 cast members only to keep UI clean */}
                {movie.credits.cast.slice(0, 5).map((actor) => (
                  <span key={actor.id}>{actor.name}</span>
                ))}
              </div>
            )}
          </div>
          <div className="action-buttons pt-4 mt-auto ">
            <ActionButtons
              banner={false}
              onTrailerClick={() => fetchTrailer(movie.id, type)}
              onWatchListClick={handleWatchList}
              isInWatchList={isInWatchList}
            />
          </div>
        </div>
      </div>

      {/* Cast scrolls horizontally — Director/Writer shown separately after cast */}
      <div className="profiles px-4 sm:px-6 lg:px-10">
        <h2 className="text-xl text-primary sm:text-2xl font-semibold mb-4">
          Cast & Crew
        </h2>
        <div className="flex flex-nowrap gap-2 py-2 overflow-x-auto scrollbar-hide">
          {movie?.credits?.cast?.slice(0, 9).map((profile) => (
            <ProfileCard
              key={`cast-${profile.id}`}
              isActor={true}
              name={profile.name || profile.original_name}
              character={profile.character}
              imagePath={profile.profile_path}
            />
          ))}
          {movie?.credits?.crew
            ?.filter(
              (profile) =>
                profile.job === "Director" || profile.job === "Writer",
            )
            .map((profile) => (
              <ProfileCard
                key={`crew-${profile.id} ${profile.job}`}
                isActor={false}
                name={profile.name || profile.original_name}
                job={profile.job}
                imagePath={profile.profile_path}
              />
            ))}
        </div>
      </div>
      <CardRows
        title={type === "movie" ? "Similar Movies" : "Similar TV Shows"}
        movies={movie?.similar?.results}
      />
    </>
  );
};

export default MovieInfo;
