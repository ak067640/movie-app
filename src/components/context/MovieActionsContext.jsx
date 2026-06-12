import React, { createContext, useState } from "react";

const MovieActionsContext = createContext();

export default MovieActionsContext;

export const MovieActionsProvider = ({ children }) => {
  // State initialized from localStorage so data persists across page refreshes
  const [watchList, setWatchList] = useState(() => {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  });

  const [likedMovies, setLikedMovies] = useState(() => {
    return JSON.parse(localStorage.getItem("liked")) || [];
  });

  const [dislikedMovies, setDislikedMovies] = useState(() => {
    return JSON.parse(localStorage.getItem("disliked")) || [];
  });

  // Duplicate guard — prevents same movie being added twice
  const addTOWatchList = (movie) => {
    if (!movie.id) return;
    if (watchList.some((item) => item.id === movie.id)) return;
    const updated = [...watchList, movie];
    setWatchList(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const removeFromWatchList = (id) => {
    const updated = watchList.filter((item) => item.id !== id);

    setWatchList(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const addToLiked = (movie) => {
    const updated = [...likedMovies, movie];
    setLikedMovies(updated);
    localStorage.setItem("liked", JSON.stringify(updated));

    const updatedDisliked = dislikedMovies.filter(
      (item) => item.id !== movie.id,
    );
    setDislikedMovies(updatedDisliked);
    localStorage.setItem("disliked", JSON.stringify(updatedDisliked));
  };

  const removeFromLiked = (id) => {
    const updated = likedMovies.filter((item) => item.id !== id);
    setLikedMovies(updated);
    localStorage.setItem("liked", JSON.stringify(updated));
  };

  // Disliking a movie auto-removes it from liked (mutually exclusive)
  const addToDisliked = (movie) => {
    const updated = [...dislikedMovies, movie];
    setDislikedMovies(updated);
    localStorage.setItem("disliked", JSON.stringify(updated));

    const updatedLiked = likedMovies.filter((item) => item.id !== movie.id);
    setLikedMovies(updatedLiked);
    localStorage.setItem("liked", JSON.stringify(updatedLiked));
  };

  const removeFromDisliked = (id) => {
    const updated = dislikedMovies.filter((item) => item.id !== id);
    setDislikedMovies(updated);
    localStorage.setItem("disliked", JSON.stringify(updated));
  };

  return (
    <MovieActionsContext.Provider
      value={{
        watchList,
        addTOWatchList,
        removeFromWatchList,
        likedMovies,
        addToLiked,
        removeFromLiked,
        dislikedMovies,
        addToDisliked,
        removeFromDisliked,
      }}
    >
      {children}
    </MovieActionsContext.Provider>
  );
};
