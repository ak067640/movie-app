import { useSearchParams } from "react-router-dom";
import useFetchMovies from "../components/custom-hook/useFetchMovies";
import GridCard from "../components/cards/GridCard";

const TABS = [
  { label: "All", value: "multi" },
  { label: "Movies", value: "movie" },
  { label: "Tv Shows", value: "tv" },
  { label: "Anime", value: "anime" },
];

const SearchPage = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "multi";

  // TMDB has no "anime" endpoint — map it to "tv", filter client-side after fetch
  const apiType = type === "anime" ? "tv" : type;

  // Tab change updates URL params — keeps search state in sync with browser history
  const handleTabChange = (newType) => {
    setSearchParams({ q: query, type: newType });
  };

  // Skip fetch if query is empty
  const { data, loading, error } = useFetchMovies(
    query
      ? `https://api.themoviedb.org/3/search/${apiType}?api_key=${API_Key}&query=${query}`
      : null,
  );

  if (loading)
    return (
      <div className="px-10 mt-5">
        <div className="flex gap-3 mb-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-800 animate-pulse rounded-full"
              />
            ))}
        </div>
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

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-primary">
        <div className="text-6xl">😵</div>
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-secondary text-sm">
          We couldn't complete your search. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full cursor-pointer transition-colors"
        >
          Try Again
        </button>
      </div>
    );

  let result = data?.results || [];

  // Anime filter — genre 16 = Animation, origin_country JP = Japanese anime
  // Applied client-side since TMDB has no dedicated anime search endpoint
  if (type === "anime") {
    result = result.filter(
      (item) =>
        item.genre_ids?.includes(16) && item.origin_country?.includes("JP"),
    );
  }

  return (
    <div className="px-10 mt-5">
      <h2 className="text-2xl mb-5">Result for: {query}</h2>

      {/* ✅ TABS */}
      <div className="flex gap-3 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-1.5 shrink-0 rounded-full text-sm font-medium transition ${
              type === tab.value
                ? "bg-red-600 text-white" //active
                : "bg-[#333] text-gray-300 hover:bg-[#444]" //inactive
            } `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <GridCard isSearchPage={true} query={query} result={result} />
    </div>
  );
};

export default SearchPage;
