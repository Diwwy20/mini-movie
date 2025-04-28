import { useState, useEffect } from "react";
import { imageUrl, fetchMovieDetails } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { Star, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const MovieCard = ({ movie, hideCommerce = false }) => {
  const { t, i18n } = useTranslation();
  const [price, setPrice] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart, cartItems } = useCart();
  const currentLanguage = i18n.language;
  const [movieData, setMovieData] = useState(movie);

  const isInCart = cartItems.some((item) => item.id === movie.id);

  useEffect(() => {
    const updateMovieData = async () => {
      try {
        const updatedMovie = await fetchMovieDetails(movie.id);
        setMovieData(updatedMovie);
      } catch (error) {
        console.error("Error updating movie data:", error);
      }
    };

    updateMovieData();
  }, [currentLanguage, movie.id]);

  useEffect(() => {
    const storedPrices = JSON.parse(
      localStorage.getItem("moviePrices") || "{}"
    );

    if (storedPrices[movie.id]) {
      setPrice(storedPrices[movie.id]);
    } else {
      const newPrice = Math.floor(Math.random() * 300) + 200;
      setPrice(newPrice);

      const updatedPrices = {
        ...storedPrices,
        [movie.id]: newPrice,
      };
      localStorage.setItem("moviePrices", JSON.stringify(updatedPrices));
    }
  }, [movie.id]);

  const handleAddToCart = () => {
    addToCart({
      id: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      price: price,
    });
    toast.success(t("Movie added to cart"));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(currentLanguage === "th" ? "th-TH" : "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const truncateOverview = (text, maxLength = 100) => {
    if (!text) return t("No description available");
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
      <div className="relative">
        {movieData.poster_path ? (
          <img
            src={imageUrl(movieData.poster_path)}
            alt={movieData.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-center text-xs text-gray-500 p-1">
            {t("No Poster")}
          </div>
        )}
        {!hideCommerce && movieData.vote_average ? (
          <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-md text-sm font-bold flex items-center">
            <Star className="text-yellow-400 mr-1" size={16} />
            {movieData.vote_average?.toFixed(1) || null}
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-bold truncate mb-1">{movieData.title}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {movieData.release_date
            ? new Date(movieData.release_date).toLocaleDateString(
                currentLanguage === "th" ? "th-TH" : "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )
            : t("No Date Provided")}
        </p>

        {/* Overview section */}
        <div className="mt-2">
          <div
            className={`text-sm text-gray-700 ${
              isExpanded ? "" : "line-clamp-3"
            }`}
          >
            {isExpanded
              ? movieData.overview
              : truncateOverview(movieData.overview)}
          </div>
          {movieData.overview && movieData.overview.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Info size={12} className="mr-1" />
              {isExpanded ? t("Show less") : t("Read more")}
            </button>
          )}
        </div>

        {!hideCommerce && (
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <span className="font-bold text-black text-lg mr-2">
                {formatCurrency(price)} {t("THB (Baht)")}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                isInCart
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-black text-white hover:bg-black/80 cursor-pointer"
              }`}
            >
              {isInCart ? t("In Cart") : t("Add to Cart")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
