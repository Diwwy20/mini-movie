import { useEffect, useState } from "react";
import {
  fetchTrendingMoviesDaily,
  fetchTrendingMoviesWeekly,
  sortMoviesByRating,
} from "@/services/api";
import MovieCard from "@/components/movie/MovieCard";
import { useTranslation } from "react-i18next";

const TrendingPage = () => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("day");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data =
          timeFrame === "day"
            ? await fetchTrendingMoviesDaily()
            : await fetchTrendingMoviesWeekly();

        setMovies(sortMoviesByRating(data.results));
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [timeFrame]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-xl">{t("Loading")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("Trending")}</h1>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setTimeFrame("day")}
            className={`px-4 py-2 rounded-md cursor-pointer ${
              timeFrame === "day"
                ? "bg-primary text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t("Today")}
          </button>
          <button
            onClick={() => setTimeFrame("week")}
            className={`px-4 py-2 rounded-md cursor-pointer ${
              timeFrame === "week"
                ? "bg-primary text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t("This Week")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
