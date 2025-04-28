import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const imageUrl = (path, size = "w500") => {
    if (!path) return "/api/placeholder/200/300";
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

const api = axios.create({
    baseURL: BASE_URL,
    params: {
      api_key: API_KEY,
    },
});

const getLanguageParam = () => {
    const language = localStorage.getItem('i18nextLng') || 'th';
    return language === 'th' ? 'th-TH' : 'en-US';
};

// -> 1.API สำหรับการดึงข้อมูลหนังที่ฮิตสุดในตอนนี้
export const fetchPopularMovies = async (page = 1) => {
    try {
      const response = await api.get("/movie/popular", {
        params: { 
          page,
          language: getLanguageParam(), 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw error;
    }
};

// -> 2.ดึงข้อมูลหนังที่กำลังมาแรงในวันนี้
export const fetchTrendingMoviesDaily = async () => {
    try {
      const response = await api.get("/trending/movie/day", {
        params: {
          language: getLanguageParam(), 
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching daily trending movies:", error);
      throw error;
    }
};

// -> 3.ดึงข้อมูลหนังที่กำลังมาแรงในสัปดาห์นี้
export const fetchTrendingMoviesWeekly = async () => {
    try {
      const response = await api.get("/trending/movie/week", {
        params: {
          language: getLanguageParam(), 
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching weekly trending movies:", error);
      throw error;
    }
};

// -> 4.ดึงข้อมูลแสดงรายการแนวหนังที่มีอยู่ทั้งหมด
export const fetchMovieGenres = async () => {
    try {
      const response = await api.get("/genre/movie/list", {
        params: {
          language: getLanguageParam(), 
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movie genres:", error);
      throw error;
    }
};

// 5. -> ดึงข้อมูลหนังที่กำลังฉายในโรงภาพยนตร์ตอนนี้
export const fetchNowPlayingMovies = async (page = 1) => {
    try {
      const response = await api.get("/movie/now_playing", {
        params: { 
          page,
          language: getLanguageParam(), 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      throw error;
    }
};

// 6. -> แสดงหนังที่ได้รับคะแนนสูงสุด
export const fetchTopRatedMovies = async (page = 1) => {
    try {
      const response = await api.get("/movie/top_rated", {
        params: { 
          page,
          language: getLanguageParam(), 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      throw error;
    }
};

// 7. -> ดึงข้อมูลหนังที่กำลังจะเข้าฉายในอนาคต
export const fetchUpcomingMovies = async (page = 1) => {
    try {
      const response = await api.get("/movie/upcoming", {
        params: { 
          page,
          language: getLanguageParam(), 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw error;
    }
};

// 8. -> ดึงรายการข้อมูลรายละเอียดของหนัง
export const fetchMovieDetails = async (movieId) => {
    try {
      const response = await api.get(`/movie/${movieId}`, {
        params: {
          language: getLanguageParam(), 
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for movie ${movieId}:`, error);
      throw error;
    }
  };

// 9. -> ค้นหาชื่อภาพยนตร์
export const searchMovies = async (query, page = 1) => {
    try {
      const response = await api.get("/search/movie", {
        params: { 
          query, 
          page,
          language: getLanguageParam(), 
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching for movies with query "${query}":`, error);
      throw error;
    }
};

// 10. -> ฟังก์ชันเรียงลำดับหนังตามคะแนน (จากมากไปน้อย)
export const sortMoviesByRating = (movies) => {
  return [...movies].sort((a, b) => b.vote_average - a.vote_average);
};

export default api;