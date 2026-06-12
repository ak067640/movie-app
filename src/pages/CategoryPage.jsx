import { useSearchParams } from "react-router-dom";
import useFetchMovies from "../components/custom-hook/useFetchMovies";
import GridCard from "../components/cards/GridCard";

// Receives title + url as query params from CardRows "See All" button
// e.g. /category?title=Trending Movies&url=https://api.themoviedb.org/...
const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const url = searchParams.get("url");

  const { data, loading, error } = useFetchMovies(url);

  if (loading)
    return (
      <div className="px-4 sm:px-6 lg:px-10 mt-5">
        <div className="h-8 w-48 bg-gray-800 animate-pulse rounded mb-6" />
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
        {/* Hard reload as fallback — sufficient for a network/API error recovery */}
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-10 mt-5">
      <h2 className="text-2xl font-bold text-primary mb-6">{title}</h2>
      {/* isSearchPage=false shows "empty" instead of "no results for query" */}
      <GridCard isSearchPage={false} result={data?.results || []} />
    </div>
  );
};

export default CategoryPage;
