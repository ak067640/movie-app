import { useContext, useState } from "react";
import { Film, CirclePlus, ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTrailer from "../custom-hook/useTrailer";
import TrailerModal from "../TrailerModal";
import MovieActionsContext from "../context/MovieActionsContext";
import Toast from "../Toast";

const Card = ({ movie }) => {
  const navigate = useNavigate();

  // Mobile tap toggles overlay (hover doesn't work on touch devices)
  const [isTouched, setIsTouched] = useState(false);

  // TMDB returns "title" for movies, "name" for TV — used to infer media type
  const type = movie.title ? "movie" : "tv";

  const { trailerKey, videoError, fetchTrailer, closeTrailer } = useTrailer();

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

  const isMovieAdded = watchList.some((item) => item.id === movie.id);
  const isLiked = likedMovies.some((item) => item.id === movie.id);
  const isdisLiked = dislikedMovies.some((item) => item.id === movie.id);

  const playTrailer = () => fetchTrailer(movie.id, type);

  const handleWatchList = () => {
    if (isMovieAdded) {
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

  // Like and dislike are mutually exclusive — liking removes dislike and vice versa
  const handleLikes = () => {
    if (isLiked) {
      removeFromLiked(movie.id);
    } else {
      addToLiked(movie);
      if (isdisLiked) removeFromDisliked(movie.id);
    }
  };

  const handleDisLikes = () => {
    if (isdisLiked) {
      removeFromDisliked(movie.id);
    } else {
      addToDisliked(movie);
      if (isLiked) removeFromLiked(movie.id);
    }
  };

  // Overlay shown on hover (desktop) or tap (mobile)
  const overlayVisible = isTouched
    ? "opacity-100"
    : "opacity-0 group-hover/content:opacity-100";

  return (
    <>
      <TrailerModal trailerKey={trailerKey} onClose={closeTrailer} />
      {videoError && <Toast message={videoError} />}

      <div
        onTouchStart={() => setIsTouched((prev) => !prev)}
        className="card-wrapper group/content relative rounded-xl shrink-0 w-32 sm:w-36 md:w-40 transition-transform duration-500 ease-out hover:scale-110 hover:z-50 flex flex-col gap-1 justify-between"
      >
        <div
          className="cursor-pointer"
          onClick={() => {
            if (isTouched) {
              setIsTouched(false); // overlay hide
            } else {
              navigate(`/movie/${movie.id}?type=${type}`);
            }
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
            alt="image"
            className="transition-transform duration-300 w-full aspect-2/3 object-cover rounded-xl"
          />

          {/* Bottom-up gradient for text readability over poster */}
          <div
            className={`absolute bottom-0 left-0 w-full h-2/3 bg-linear-to-t from-black to-transparent rounded-xl transition-opacity duration-300 ${overlayVisible}`}
          />

          {/* Rating Badge */}
          <span className="absolute text-sm right-2 top-2 bg-base border border-yellow-500 flex items-center gap-1 px-1 rounded text-gold">
            <Star stroke="none" fill="gold" size={15} />
            {movie.vote_average?.toFixed(1)}
          </span>

          {/* Title */}
          <p
            className={`text-wrap text-xs absolute bottom-10 left-1 cursor-pointer w-full px-2 text-primary transition-opacity duration-300 z-10 ${overlayVisible}`}
          >
            <span className="hover:underline">
              {movie.title || movie.original_title || movie.name}
            </span>
          </p>
        </div>

        {/* Action buttons — stopPropagation prevents card tap from firing */}
        <div
          className={`icon-btn-container absolute bottom-0 left-0 w-full flex justify-between px-2 py-1 transition-opacity duration-300 z-10 ${overlayVisible}`}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            onClick={playTrailer}
            className="cursor-pointer active:scale-80 transition-transform duration-200"
          >
            <Film fill="white" />
          </button>

          <button
            onClick={handleWatchList}
            className="cursor-pointer active:scale-80 transition-transform duration-200"
          >
            {isMovieAdded ? (
              <CirclePlus fill="white" color="black" />
            ) : (
              <CirclePlus color="white" fill="black" />
            )}
          </button>

          <button
            onClick={handleLikes}
            className="cursor-pointer active:scale-80 transition-transform duration-200"
          >
            {isLiked ? <ThumbsUp fill="blue" /> : <ThumbsUp fill="white" />}
          </button>

          <button
            onClick={handleDisLikes}
            className="cursor-pointer active:scale-80 transition-transform duration-200"
          >
            {isdisLiked ? (
              <ThumbsDown fill="red" />
            ) : (
              <ThumbsDown fill="white" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
