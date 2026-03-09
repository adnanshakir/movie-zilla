const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdb = {
  getPopular: (page = 1) =>
    `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,

  getTrending: () => `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`,

  getMovieDetails: (id) =>
    `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`,

  searchMovies: (query, page = 1) =>
    `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,

  getTopRated: (page = 1) =>
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`,

  getNowPlaying: (page = 1) =>
    `${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`,

  getUpcoming: (page = 1) =>
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`,

  getImageUrl: (path) => (path ? `${TMDB_IMAGE_BASE}${path}` : null),
};

export default tmdb;
