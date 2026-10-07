/**
 * TMDB (The Movie Database) API Service
 * Uses the Read Access Token (v4 auth) via Bearer header.
 * All responses are normalized to match the app's internal movie shape.
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_KEY;

const HEADERS = {
  accept: 'application/json',
  Authorization: `Bearer ${ACCESS_TOKEN}`
};

// ─── Helpers ────────────────────────────────────────────────────────────────

export const getPosterUrl = (path, size = 'w500') =>
  path
    ? `${TMDB_IMAGE_BASE}/${size}${path}`
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800&auto=format&fit=crop';

export const getBackdropUrl = (path, size = 'w1280') =>
  path
    ? `${TMDB_IMAGE_BASE}/${size}${path}`
    : 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop';

const formatRuntime = (mins) => {
  if (!mins) return 'N/A';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
};

const tmdbFetch = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers: HEADERS });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.status_message || `TMDB error ${res.status}`);
  }
  return res.json();
};

// ─── Genre Map ───────────────────────────────────────────────────────────────

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News',
  10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics'
};

const genreIdToName = (id) => GENRE_MAP[id] || '';

// ─── Normalizer helpers ───────────────────────────────────────────────────────

const extractDirector = (credits) => {
  if (!credits?.crew) return null;
  const dir = credits.crew.find(c => c.job === 'Director');
  return dir ? dir.name : null;
};

const extractTrailerId = (videos) => {
  if (!videos?.results) return '';
  const trailer = videos.results.find(v =>
    v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );
  return trailer ? trailer.key : '';
};

const getProviderEmoji = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('netflix')) return '🔴';
  if (n.includes('disney')) return '🏰';
  if (n.includes('prime') || n.includes('amazon')) return '📦';
  if (n.includes('hulu')) return '🟢';
  if (n.includes('max') || n.includes('hbo')) return '🟣';
  if (n.includes('apple')) return '🍎';
  if (n.includes('peacock')) return '🦚';
  if (n.includes('paramount')) return '⭐';
  return '📺';
};

const getProviderUrl = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('netflix')) return 'https://www.netflix.com';
  if (n.includes('disney')) return 'https://www.disneyplus.com';
  if (n.includes('prime') || n.includes('amazon')) return 'https://www.primevideo.com';
  if (n.includes('hulu')) return 'https://www.hulu.com';
  if (n.includes('max') || n.includes('hbo')) return 'https://www.max.com';
  if (n.includes('apple')) return 'https://tv.apple.com';
  if (n.includes('peacock')) return 'https://www.peacocktv.com';
  if (n.includes('paramount')) return 'https://www.paramountplus.com';
  return '#';
};

const buildProviders = (watchProviders) => {
  if (!watchProviders?.results) return getDefaultProviders();
  const region =
    watchProviders.results['US'] ||
    watchProviders.results['IN'] ||
    Object.values(watchProviders.results)[0];
  if (!region) return getDefaultProviders();
  const flatrate = region.flatrate || [];
  if (flatrate.length === 0) return getDefaultProviders();
  return flatrate.slice(0, 4).map(p => ({
    name: p.provider_name,
    logo: getProviderEmoji(p.provider_name),
    playbackMode: 'SCREEN_SHARE',
    officialUrl: getProviderUrl(p.provider_name),
    note: `Stream on ${p.provider_name} and share screen with friends.`
  }));
};

const getDefaultProviders = () => [
  {
    name: 'Screen Share',
    logo: '🖥️',
    playbackMode: 'SCREEN_SHARE',
    officialUrl: '#',
    note: 'Share any streaming tab with friends.'
  }
];

/**
 * Normalizes a raw TMDB movie or TV result into the app's internal Movie shape.
 */
export const normalizeMovie = (item, mediaType = 'movie') => {
  const isTV = mediaType === 'tv' || item.media_type === 'tv' || !!item.first_air_date;
  const title = item.title || item.name || 'Unknown Title';
  const year = (item.release_date || item.first_air_date || '').substring(0, 4);
  const ratingRaw = item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0;

  return {
    id: `tmdb-${isTV ? 'tv' : 'mv'}-${item.id}`,
    tmdbId: item.id,
    mediaType: isTV ? 'tv' : 'movie',
    title,
    tagline: item.tagline || '',
    year: parseInt(year) || new Date().getFullYear(),
    rating: ratingRaw,
    runtime: item.runtime
      ? formatRuntime(item.runtime)
      : isTV
      ? `${item.number_of_seasons || 1} Season(s)`
      : 'N/A',
    genres: (item.genres || item.genre_ids || [])
      .map(g => (typeof g === 'object' ? g.name : genreIdToName(g)))
      .filter(Boolean),
    ageRating: item.adult ? 'R' : 'PG-13',
    director:
      item.director || extractDirector(item.credits) || 'N/A',
    overview: item.overview || 'No description available.',
    poster: getPosterUrl(item.poster_path, 'w500'),
    backdrop: getBackdropUrl(item.backdrop_path, 'w1280'),
    trailerId: item.trailerId || extractTrailerId(item.videos) || '',
    cast: (item.credits?.cast || []).slice(0, 6).map(c => ({
      name: c.name,
      role: c.character,
      avatar: getPosterUrl(c.profile_path, 'w200')
    })),
    providers: buildProviders(item['watch/providers']),
    source: 'tmdb'
  };
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch currently trending movies & TV shows (week window).
 * Returns normalized array or null on error (caller falls back to static data).
 */
export const fetchTrending = async (timeWindow = 'week') => {
  try {
    const [moviesData, tvData] = await Promise.all([
      tmdbFetch(`/trending/movie/${timeWindow}`),
      tmdbFetch(`/trending/tv/${timeWindow}`)
    ]);
    const movies = (moviesData.results || []).slice(0, 10).map(m => normalizeMovie(m, 'movie'));
    const shows = (tvData.results || []).slice(0, 5).map(t => normalizeMovie(t, 'tv'));
    return [...movies, ...shows];
  } catch (err) {
    console.error('[TMDB] fetchTrending error:', err);
    return null;
  }
};

/**
 * Search movies & TV by query string.
 */
export const searchTMDB = async (query, page = 1) => {
  if (!query.trim()) return [];
  try {
    const [movieRes, tvRes] = await Promise.all([
      tmdbFetch('/search/movie', { query, page, include_adult: false }),
      tmdbFetch('/search/tv', { query, page, include_adult: false })
    ]);
    const movies = (movieRes.results || []).slice(0, 8).map(m => normalizeMovie(m, 'movie'));
    const shows = (tvRes.results || []).slice(0, 4).map(t => normalizeMovie(t, 'tv'));
    return [...movies, ...shows].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } catch (err) {
    console.error('[TMDB] searchTMDB error:', err);
    return [];
  }
};

/**
 * Fetch full movie/TV details including cast, trailers, and providers.
 */
export const fetchMovieDetails = async (tmdbId, mediaType = 'movie') => {
  try {
    const data = await tmdbFetch(`/${mediaType}/${tmdbId}`, {
      append_to_response: 'credits,videos,watch/providers'
    });
    return normalizeMovie(data, mediaType);
  } catch (err) {
    console.error('[TMDB] fetchMovieDetails error:', err);
    return null;
  }
};
