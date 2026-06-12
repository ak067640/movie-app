import React from "react";
import Card from "./Card";

// Reusable grid layout — used on both SearchPage and WatchlistPage
const GridCard = ({ result, query, isSearchPage }) => {
  return (
    <>
      {result.length === 0 ? (
        // Empty state message differs based on context
        <p className="text-secondary">
          {isSearchPage ? `no result found for: ${query}` : "empty"}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {result.map((item, index) => (
            // index added to key to avoid duplicate id conflicts across pages
            <Card key={`${item.id}-${index}`} movie={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default GridCard;
