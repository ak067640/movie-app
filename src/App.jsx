import React from "react";
import NavBar from "./components/navbar/NavBar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import Anime from "./pages/Anime";
import SearchPage from "./pages/SearchPage";
import GenresPage from "./pages/GenresPage";
import MovieInfo from "./pages/MovieInfo";
import WatchList from "./pages/WatchList";
import { MovieActionsProvider } from "./components/context/MovieActionsContext";
import CategoryPage from "./pages/CategoryPage";

const App = () => {
  return (
    // MovieActionsProvider wraps everything — watchlist/liked/disliked globally accessible
    <div className="min-h-screen bg-base">
      <MovieActionsProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvshows" element={<TvShows />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/search" element={<SearchPage />} />
          {/* :id = TMDB genre id, :name = display label */}
          <Route path="/genre/:id/:name" element={<GenresPage />} />
          {/* ?type=movie|tv passed as query param to MovieInfo */}
          <Route path="movie/:id" element={<MovieInfo />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/category" element={<CategoryPage />} />
        </Routes>
      </MovieActionsProvider>
    </div>
  );
};

export default App;
