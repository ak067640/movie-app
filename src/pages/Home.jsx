import React from "react";
import CardRows from "../components/cards/CardRows";
import Banner from "../components/banner/Banner";

const Home = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;

  // Each section maps to a TMDB endpoint — CardRows handles fetch + render
  const allSections = [
    {
      title: "Trending Movies",
      url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_Key}`,
    },
    {
      title: "Trending TV Shows",
      url: `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_Key}`,
    },
    {
      title: "Popular Movies",
      url: `https://api.themoviedb.org/3/movie/popular?api_key=${API_Key}`,
    },
    {
      title: "Popular TV Shows",
      url: `https://api.themoviedb.org/3/tv/popular?api_key=${API_Key}`,
    },
    {
      title: "Top Rated Movies",
      url: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_Key}`,
    },
    {
      title: "Top Rated TV Shows",
      url: `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_Key}`,
    },

    {
      title: "Upcoming Movies",
      url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_Key}`,
    },
    {
      title: "Now Playing",
      url: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_Key}`,
    },
    // Genre-based sections using TMDB discover endpoint
    // genre 28 = Action, 35 = Comedy, 27 = Horror
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
      {/* Banner defaults to type="all" — shows mixed movies + TV in hero */}
      <Banner />
      {allSections.map((section) => (
        <div key={section.title} className="mt-3">
          <CardRows title={section.title} url={section.url} />
        </div>
      ))}
    </>
  );
};

export default Home;
