import React from "react";
import Banner from "../components/banner/Banner";
import CardRows from "../components/cards/CardRows";
const TvShows = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;

  // Each section maps to a TMDB endpoint — CardRows handles fetch + render
  const tvSections = [
    {
      title: "Trending TV Shows",
      url: `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_Key}`,
    },

    {
      title: "Popular TV Shows",
      url: `https://api.themoviedb.org/3/tv/popular?api_key=${API_Key}`,
    },

    {
      title: "Top Rated TV Shows",
      url: `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_Key}`,
    },
    // genre 16 = Animation, origin_country=JP filters Japanese anime
    {
      title: "Popular Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16&with_origin_country=JP`,
    },
    // origin_country=KR filters Korean content for K-Dramas
    {
      title: "Popular K-Dramas",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_origin_country=KR`,
    },
  ];
  return (
    <>
      {/* type="tv" restricts Banner to TV-only content */}
      <Banner type="tv" />
      {tvSections.map((section) => (
        <div key={section.title} className="mt-3">
          <CardRows title={section.title} url={section.url} />
        </div>
      ))}
    </>
  );
};

export default TvShows;
