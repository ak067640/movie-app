import React, { useContext, useState } from "react";
import MovieActionsContext from "../components/context/MovieActionsContext";
import GridCard from "../components/cards/GridCard";

const TABS = [
  { label: "Watchlist", value: "watchlist" },
  { label: "Liked", value: "liked" },
  { label: "Disliked", value: "disliked" },
];

const WatchList = () => {
  const { watchList, likedMovies, dislikedMovies } =
    useContext(MovieActionsContext);

  const [activeTab, setActiveTab] = useState("watchlist");

  // Derive current list from active tab — no separate state needed
  const currentList =
    activeTab === "watchlist"
      ? watchList
      : activeTab === "liked"
        ? likedMovies
        : dislikedMovies;

  return (
    <>
      <div className="px-10 mt-5">
        {/* Tab switcher — controls which list (watchlist/liked/disliked) is shown */}
        <div className="flex gap-3 mb-6">
          {TABS.map((tab) => (
            <button
              onClick={() => setActiveTab(tab.value)}
              key={tab.value}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === tab.value
                  ? "bg-red-600 text-white" //active
                  : "bg-[#333] text-gray-300 hover:bg-[#444]" //inactive
              } `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <GridCard isSearchPage={false} result={currentList} />
      </div>
    </>
  );
};

export default WatchList;
