import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, TrendingUp, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Language from "../Language";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [showTrending, setShowTrending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    const loadTrendingSearches = async () => {
      setIsLoading(true);
      const mockTrending = [
        "Havoc",
        "Ash",
        "Weak Hero (약한영웅)",
        "You",
        "Sinners",
        "Andor",
        "The Accountant 2",
        "Jewel Thief - The Heist Begins",
        "The Last of Us",
        "Conclave",
      ];
      setTrendingSearches(mockTrending);
      setIsLoading(false);
    };

    loadTrendingSearches();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowTrending(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery("");
      setShowTrending(false);
      setIsMobileMenuOpen(false); // ปิดเมนูหลังจากค้นหา
    }
  };

  const handleTrendingItemClick = (query) => {
    navigate(`/search/${query}`);
    setSearchQuery("");
    setShowTrending(false);
    setIsMobileMenuOpen(false);
  };

  // ฟังก์ชันสำหรับการจัดการเมื่อมีการเปลี่ยนภาษา
  const handleLanguageChange = (languageCode) => {
    // navigate(0);
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-secondary">Mini Movie</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="relative text-white hover:text-secondary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-600 hover:after:w-14"
          >
            {t("Home")}
          </Link>
          <Link
            to="/trending"
            className="relative text-white hover:text-secondary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-600 hover:after:w-14"
          >
            {t("Trending")}
          </Link>
          <Link
            to="/top-rated"
            className="relative text-white hover:text-secondary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-600 hover:after:w-21"
          >
            {t("Top Rated")}
          </Link>
          <Link
            to="/upcoming"
            className="relative text-white hover:text-secondary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-600 hover:after:w-12"
          >
            {t("Upcoming")}
          </Link>

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t("Search for Movies...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowTrending(true)}
                className="pl-3 pr-10 py-2 rounded-full text-white w-64
                bg-transparent border border-gray-500 placeholder-gray-400
                focus:outline-none focus:border-gray-300 transition"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Trending Dropdown */}
            {showTrending && (
              <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 max-h-64 overflow-auto">
                <div className="py-2 px-3 text-sm text-gray-700 font-medium border-b flex items-center">
                  <TrendingUp size={14} className="mr-1" />
                  <span>{t("Trending_Message")}</span>
                </div>
                {isLoading ? (
                  <div className="p-3 text-center text-gray-500">
                    {t("Loading")}
                  </div>
                ) : (
                  <ul className="py-1">
                    {trendingSearches.map((search, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm flex items-center"
                        onClick={() => handleTrendingItemClick(search)}
                      >
                        <Search size={14} className="mr-2 text-gray-500" />
                        {search}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Language switch - ส่ง callback เพื่อให้มีการ refresh ข้อมูลเมื่อเปลี่ยนภาษา */}
          <Language onLanguageChange={handleLanguageChange} />

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-secondary flex items-center gap-x-2"
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} />
        </button>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="bg-primary w-72 p-6 flex flex-col gap-6 relative">
              <button
                className="absolute top-4 right-4 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={28} />
              </button>

              {/* Links */}
              <Link
                to="/"
                className="relative text-white hover:text-secondary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-600 hover:after:w-14"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("Home")}
              </Link>
              <Link
                to="/trending"
                className="relative text-white hover:text-secondary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-600 hover:after:w-14"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("Trending")}
              </Link>
              <Link
                to="/top-rated"
                className="relative text-white hover:text-secondary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-600 hover:after:w-21"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("Top Rated")}
              </Link>
              <Link
                to="/upcoming"
                className="relative text-white hover:text-secondary after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-600 hover:after:w-12"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("Upcoming")}
              </Link>

              {/* Search */}
              <div ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder={t("Search for Movies...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowTrending(true)}
                    className="pl-3 pr-10 py-2 rounded-full text-white w-full
                    bg-transparent border border-gray-500 placeholder-gray-400
                    focus:outline-none focus:border-gray-300 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <Search size={18} />
                  </button>
                </form>

                {showTrending && (
                  <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 max-h-64 overflow-auto">
                    <div className="py-2 px-3 text-sm text-gray-700 font-medium border-b flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      <span>{t("Trending_Message")}</span>
                    </div>
                    {isLoading ? (
                      <div className="p-3 text-center text-gray-500">
                        {t("Loading")}
                      </div>
                    ) : (
                      <ul className="py-1">
                        {trendingSearches.map((search, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm flex items-center"
                            onClick={() => handleTrendingItemClick(search)}
                          >
                            <Search size={14} className="mr-2 text-gray-500" />
                            {search}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Language and Cart -> Mobile */}
              <div className="flex items-center gap-x-3">
                <Language onLanguageChange={handleLanguageChange} />
                <Link
                  to="/cart"
                  className="relative hover:text-secondary flex items-center gap-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart size={24} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* click ด้านนอกเมนูเพื่อปิด */}
            <div
              className="flex-grow"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
