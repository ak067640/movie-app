import React from "react";
import Banner from "../components/banner/Banner";
import CardRows from "../components/cards/CardRows";

const Movies = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;

  // Each section maps to a TMDB endpoint — CardRows handles fetch + render
  // genre 28 = Action, 35 = Comedy, 27 = Horror
  const movieSections = [
    {
      title: "Trending Movies",
      url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_Key}`,
    },
    {
      title: "Popular Movies",
      url: `https://api.themoviedb.org/3/movie/popular?api_key=${API_Key}`,
    },
    {
      title: "Top Rated Movies",
      url: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_Key}`,
    },
    {
      title: "Upcoming Movies",
      url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_Key}`,
    },
    {
      title: "Now Playing",
      url: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_Key}`,
    },
    {
      title: "Action Movies",
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_Key}&with_genres=28`,
    },
    {
      title: "Comedy Movies",
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_Key}&with_genres=35`,
    },
    {
      title: "Horror Movies",
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_Key}&with_genres=27`,
    },
  ];
  return (
    <>
      {/* type="movie" restricts Banner to movies-only content */}
      <Banner type="movie" />
      {movieSections.map((section) => (
        <div key={section.title} className="mt-3">
          <CardRows title={section.title} url={section.url} />
        </div>
      ))}
    </>
  );
};

export default Movies;
