import { CURATED_MOVIES } from '../data/moviesData';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w780';

// Default public educational demo key or custom user key
export const getStoredTmdbKey = () => {
  return localStorage.getItem('cinevault_tmdb_key') || '';
};

export const setStoredTmdbKey = (key) => {
  if (key) {
    localStorage.setItem('cinevault_tmdb_key', key.trim());
  } else {
    localStorage.removeItem('cinevault_tmdb_key');
  }
};

export const normalizeTmdbMovie = (item, details = null, videos = null, credits = null) => {
  const year = item.release_date ? new Date(item.release_date).getFullYear() : 2024;
  const rating = item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.0;
  
  // Find YouTube trailer from videos
  let trailerId = 'Way9Dexny3w'; // default fallback
  if (videos && videos.results && videos.results.length > 0) {
    const officialTrailer = videos.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
    if (officialTrailer) {
      trailerId = officialTrailer.key;
    } else {
      trailerId = videos.results[0].key;
    }
  }

  // Cast
  let cast = [];
  let director = "Unknown Director";
  if (credits) {
    if (credits.crew) {
      const dirObj = credits.crew.find(c => c.job === 'Director');
      if (dirObj) director = dirObj.name;
    }
    if (credits.cast) {
      cast = credits.cast.slice(0, 5).map(c => ({
        name: c.name,
        role: c.character || 'Cast',
        avatar: c.profile_path ? `${TMDB_POSTER_BASE}${c.profile_path}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
      }));
    }
  }

  // Genres
  let genres = ["Action", "Sci-Fi"];
  if (details && details.genres) {
    genres = details.genres.map(g => g.name);
  } else if (item.genre_ids) {
    const genreMap = {
      28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
      99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
      27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
      10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
    };
    genres = item.genre_ids.map(id => genreMap[id]).filter(Boolean);
    if (genres.length === 0) genres = ["Drama", "Action"];
  }

  const durationMin = details?.runtime || 120 + Math.floor((item.id % 40));
  const hours = Math.floor(durationMin / 60);
  const mins = durationMin % 60;
  const duration = `${hours}h ${mins}m`;

  const buyPrice = Number((14.99 + ((item.id % 6) * 1.0)).toFixed(2));
  const rentPrice = Number((3.49 + ((item.id % 3) * 0.5)).toFixed(2));
  const rottenScore = Math.min(99, Math.floor(rating * 10 + (item.id % 8)));

  return {
    id: `tmdb-${item.id}`,
    tmdbId: item.id,
    title: item.title || item.original_title || "Untitled Cinema",
    tagline: details?.tagline || (item.overview ? item.overview.slice(0, 60) + '...' : "Experience in 4K UHD"),
    year: year,
    rating: rating,
    rottenScore: rottenScore,
    duration: duration,
    genres: genres.length ? genres : ["Cinematic", "Drama"],
    ageRating: rating > 8 ? "R" : "PG-13",
    director: director,
    overview: item.overview || "An unforgettable cinematic journey crafted in ultra-high-definition 4K HDR.",
    poster: item.poster_path ? `${TMDB_POSTER_BASE}${item.poster_path}` : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdrop: item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    trailerId: trailerId,
    buyPrice: buyPrice,
    rentPrice: rentPrice,
    originalBuyPrice: buyPrice + 5,
    is4K: true,
    hasDolbyVision: true,
    hasDolbyAtmos: true,
    hasImax: (item.id % 2 === 0),
    featured: (item.id % 5 === 0),
    trending: true,
    topRated: rating >= 8.0,
    newRelease: year >= 2024,
    deal48h: (item.id % 3 === 0),
    cast: cast.length ? cast : [
      { name: "Lead Star", role: "Protagonist", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
      { name: "Supporting Cast", role: "Co-Star", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }
    ],
    bonusFeatures: [
      "4K Ultra HD HDR Master Edition & Dolby Atmos Audio",
      "Behind the Scenes Featurette: Making of the Spectacle",
      "Exclusive Director's Cut Commentary Audio Track"
    ],
    reviews: [
      { id: 1, user: "CinemaLover", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop", rating: 5, date: "3 days ago", text: "Stunning visuals and pristine audio presentation. Well worth the digital purchase!", likes: 45 }
    ]
  };
};

export const fetchTmdbTrending = async (apiKey = null) => {
  const key = apiKey || getStoredTmdbKey();
  if (!key) {
    return CURATED_MOVIES;
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${key}`);
    if (!res.ok) throw new Error("TMDB Request failed");
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.map(item => normalizeTmdbMovie(item));
    }
  } catch (err) {
    console.warn("TMDB API fetch error, using curated fallback:", err);
  }
  return CURATED_MOVIES;
};

export const fetchTmdbSearch = async (query, apiKey = null) => {
  const key = apiKey || getStoredTmdbKey();
  if (!key) {
    return CURATED_MOVIES.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase()) || 
      m.genres.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
      m.director.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("TMDB Search failed");
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.map(item => normalizeTmdbMovie(item));
    }
  } catch (err) {
    console.warn("TMDB Search error:", err);
  }
  return CURATED_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
};

export const fetchTmdbMovieDetails = async (tmdbId, apiKey = null) => {
  const key = apiKey || getStoredTmdbKey();
  if (!key) return null;

  try {
    const [detailsRes, videosRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${key}`),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${key}`),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${key}`)
    ]);

    const details = detailsRes.ok ? await detailsRes.json() : null;
    const videos = videosRes.ok ? await videosRes.json() : null;
    const credits = creditsRes.ok ? await creditsRes.json() : null;

    if (details) {
      return normalizeTmdbMovie(details, details, videos, credits);
    }
  } catch (err) {
    console.warn("TMDB Movie details error:", err);
  }
  return null;
};
