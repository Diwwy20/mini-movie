import { useEffect, useState } from "react";
import {
  fetchPopularMovies,
  fetchTrendingMoviesDaily,
  fetchNowPlayingMovies,
  sortMoviesByRating,
} from "@/services/api";
import MovieCard from "@/components/movie/MovieCard";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [popular, trending, nowPlaying] = await Promise.all([
          fetchPopularMovies(),
          fetchTrendingMoviesDaily(),
          fetchNowPlayingMovies(),
        ]);

        setPopularMovies(sortMoviesByRating(popular.results.slice(0, 5)));
        setTrendingMovies(sortMoviesByRating(trending.results.slice(0, 5)));
        setNowPlayingMovies(sortMoviesByRating(nowPlaying.results.slice(0, 5)));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-xl">{t("Loading")}</div>
      </div>
    );
  }

  const MovieSection = ({ title, movies }) => (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          {t("Welcome to Mini Movie")}
        </h1>
        <p className="text-gray-600">
          {t(
            "Discover your favorite movies and enjoy shopping for movies online"
          )}
        </p>
      </div>

      <MovieSection title={t("Trending")} movies={trendingMovies} />
      <MovieSection title={t("Popular")} movies={popularMovies} />
      <MovieSection title={t("Now Playing")} movies={nowPlayingMovies} />
    </div>
  );
};

export default HomePage;
