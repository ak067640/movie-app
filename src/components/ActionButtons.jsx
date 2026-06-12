import React from "react";
import { Star, Play, Plus, X } from "lucide-react";
const ActionButtons = ({
  onTrailerClick,
  banner,
  onWatchListClick,
  isInWatchList,
}) => {
  return (
    <div className="flex flex-wrap gap-3 lg:gap-5">
      {/* WATCH TRAILER */}
      <button
        onClick={onTrailerClick}
        className="bg-red hover:bg-red-700 transition rounded px-4 py-2 flex items-center gap-2 text-primary text-xs lg:text-sm active:scale-95 cursor-pointer"
      >
        <Play size={18} />
        Watch Trailer
      </button>

      {/* WATCHLIST */}
      <button
        onClick={onWatchListClick}
        className={`outline-1 outline-primary/70 ${banner ? "hover:bg-primary text-primary hover:text-base" : "hover:bg-base/70 bg-base text-primary"} text-base transition rounded px-4 py-2 flex items-center gap-2 text-xs lg:text-sm active:scale-95 cursor-pointer`}
      >
        {isInWatchList ? <X size={18} /> : <Plus size={18} />}
        {isInWatchList ? "Remove from Watchlist" : "Add to Watchlist"}
      </button>
    </div>
  );
};

export default ActionButtons;
