import { useEffect, useState } from "react";
import { fetchUpcomingMovies } from "@/services/api";
import MovieCard from "@/components/movie/MovieCard";
import { useTranslation } from "react-i18next";

const UpcomingPage = () => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchUpcomingMovies(page);
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 10));
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    window.scrollTo(0, 0);
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-xl">{t("Loading")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("Upcoming Movie")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} hideCommerce={true} />
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
              {t("Previous")}
            </button>

            <span className="px-4 py-2 bg-white border rounded-md">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
    </div>
  );
};

export default UpcomingPage;
