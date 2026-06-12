import React from "react";
import CardRows from "../components/cards/CardRows";
import Banner from "../components/banner/Banner";

const Anime = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;

  // TMDB filter logic:
  // genre 16 = Animation, origin_country=JP filters Japanese anime specifically
  // Each section combines genre 16 with a sub-genre for category filtering
  const animeSections = [
    {
      title: "Trending Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16&with_origin_country=JP&sort_by=popularity.desc&air_date.gte=2024-01-01`,
    },
    {
      title: "Popular Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16&with_origin_country=JP&sort_by=popularity.desc`,
    },
    {
      title: "Top Rated Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16&with_origin_country=JP&sort_by=vote_average.desc&vote_count.gte=200`,
    },
    {
      title: "Action Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16,28&with_origin_country=JP`,
    },
    {
      title: "Romance Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16,10749&with_origin_country=JP`,
    },
    {
      title: "Comedy Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16,35&with_origin_country=JP`,
    },
    {
      title: "Fantasy Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16,10765&with_origin_country=JP`,
    },
    {
      title: "Horror Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16,27&with_origin_country=JP`,
    },
    {
      title: "Adventure Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16,12&with_origin_country=JP`,
    },
    {
      title: "Sci-Fi Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16,10765&with_origin_country=JP&with_keywords=210024`,
    },
    {
      title: "Shounen Anime",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16&with_origin_country=JP&with_keywords=210024`,
    },
    {
      title: "Anime Movies",
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_Key}&with_genres=16&with_origin_country=JP&sort_by=popularity.desc`,
    },
  ];
  return (
    <>
      {/* Banner uses anime-specific URL to show only JP animation in hero */}
      <Banner
        type="anime"
        customUrl={`https://api.themoviedb.org/3/discover/tv?api_key=${API_Key}&with_genres=16&with_origin_country=JP`}
      />
      {animeSections.map((section) => (
        <div key={section.title} className="mt-3">
          <CardRows title={section.title} url={section.url} />
        </div>
      ))}
    </>
  );
};

export default Anime;
