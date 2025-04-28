import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchMovies, sortMoviesByRating } from "@/services/api";
import MovieCard from "@/components/movie/MovieCard";
import { useTranslation } from "react-i18next";

const SearchPage = () => {
  const { t } = useTranslation();
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const data = await searchMovies(query, page);
        setMovies(sortMoviesByRating(data.results));
        setTotalPages(Math.min(data.total_pages, 10));
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    window.scrollTo(0, 0);
  }, [query, page]);

  if (loading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-xl">{t("Searching")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {t("Search Results")}: {query}
      </h1>

      {movies.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">
            {t("No results found for")} "{query}"
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md ${
                    page === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-black/50 cursor-pointer"
                  }`}
                >
                  {t("Pevious")}
                </button>

                <span className="px-4 py-2 bg-white border rounded-md">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-black/50 cursor-pointer"
                  }`}
                >
                  {t("Next")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
