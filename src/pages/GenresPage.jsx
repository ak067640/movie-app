import React from "react";
import Card from "../components/cards/Card";
import { useParams } from "react-router-dom";
import useFetchMovies from "../components/custom-hook/useFetchMovies";

// Route: /genre/:id/:name — id and name come from NavBar genre links
const GenresPage = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;
  const { id, name } = useParams();

  // Fetch movies and TV shows in parallel using the same genre id
  const {
    data: moviesData,
    loading: moviesLoading,
    error: moviesError,
  } = useFetchMovies(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_Key}&with_genres=${id}&sort_by=popularity.desc`,
  );

  const {
    data: tvData,
    loading: tvLoading,
    error: tvError,
  } = useFetchMovies(
    `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=${id}&sort_by=popularity.desc`,
  );

  // Merge both results into a single grid — shows mixed movies + TV for the genre
  const allContent = [
    ...(moviesData?.results || []),
    ...(tvData?.results || []),
  ];

  // Loading only when BOTH requests are pending
  if (moviesLoading && tvLoading)
    return (
      <div className="p-4">
        <div className="h-8 w-48 bg-gray-800 animate-pulse rounded mx-auto mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-full aspect-2/3 bg-gray-800 animate-pulse rounded-xl"
              />
            ))}
        </div>
      </div>
    );

  // Error only when BOTH requests fail — partial data still renders
  if (moviesError && tvError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-primary">
        <div className="text-6xl">😵</div>
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <>
      <p className="px-4 font-bold text-xl text-center">Genre: {name}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {allContent.map((item) => (
          <Card key={item.id} movie={item} />
        ))}
      </div>
    </>
  );
};

export default GenresPage;
