const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdb = {
  getPopular: (page = 1) =>
    `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,

  getTrending: () => `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`,

  getMovieDetails: (id) =>
    `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`,

  getMovieCredits: (id) =>
    `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`,

  searchMovies: (query, page = 1) =>
    `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,

  getTopRated: (page = 1) =>
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`,

  getNowPlaying: (page = 1) =>
    `${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`,

  getUpcoming: (page = 1) =>
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`,

  // Discover endpoint — supports language + genre filtering with pagination
  discoverMovies: ({ lang, genre, page = 1 } = {}) => {
    const params = new URLSearchParams({ api_key: API_KEY, page });
    if (lang)  params.set("with_original_language", lang);
    if (genre) params.set("with_genres", genre);
    return `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
  },

  getImageUrl: (path) => (path ? `https://image.tmdb.org/t/p/w342${path}` : null),

  // ── Person / Actor endpoints ──────────────────────────────────
  getPerson: (id) =>
    `${TMDB_BASE_URL}/person/${id}?api_key=${API_KEY}`,

  getPersonMovieCredits: (id) =>
    `${TMDB_BASE_URL}/person/${id}/movie_credits?api_key=${API_KEY}`,

  getPersonImageUrl: (path, size = "w300") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
};

export default tmdb;
