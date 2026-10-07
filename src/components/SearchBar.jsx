import React, { useState, useEffect, useRef } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { searchTMDB } from '../services/tmdb';
import { 
  Search, 
  Film, 
  Star, 
  Plus, 
  Check, 
  Tv, 
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

export const SearchBar = ({ autoFocus = false, isHero = true }) => {
  const { 
    movies, 
    searchQuery, 
    setSearchQuery, 
    setCurrentView, 
    setModals, 
    toggleWatchlist, 
    watchlist,
    joinRoom,
    searchMovies,
    tmdbLoading
  } = useWatchParty();

  const [inputValue, setInputValue] = useState(searchQuery);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);

  // 300ms debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputValue.trim());
      setSearchQuery(inputValue.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery]);

  // Fetch live TMDB results for the dropdown
  useEffect(() => {
    if (!debouncedQuery) {
      setDropdownResults([]);
      return;
    }
    let cancelled = false;
    const fetchDropdown = async () => {
      setIsSearching(true);
      try {
        const results = await searchTMDB(debouncedQuery);
        if (!cancelled) setDropdownResults(results.slice(0, 5));
      } catch {
        // Fallback to local movie filter
        if (!cancelled) {
          setDropdownResults(
            movies.filter(m =>
              m.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              m.genres.some(g => g.toLowerCase().includes(debouncedQuery.toLowerCase()))
            ).slice(0, 5)
          );
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };
    fetchDropdown();
    return () => { cancelled = true; };
  }, [debouncedQuery, movies]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = debouncedQuery 
    ? movies.filter(m => 
        m.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        m.genres.some(g => g.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
        m.cast.some(c => c.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
      ).slice(0, 4)
    : [];

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      setShowDropdown(false);
      if (searchMovies) await searchMovies(inputValue.trim());
      setCurrentView('search');
    }
  };

  const handleOpenDetails = (movie) => {
    setShowDropdown(false);
    setModals(prev => ({ ...prev, movieDetails: movie }));
  };

  const handleCreatePartyWithMovie = (movie) => {
    setShowDropdown(false);
    setModals(prev => ({ ...prev, createRoom: true, selectedContentForParty: movie }));
  };

  return (
    <div ref={containerRef} className={isHero ? "home-search-container" : "search-wrapper"} style={{ width: '100%' }}>
      <form onSubmit={handleSearchSubmit} className="home-search-bar">
        <Search size={24} color="#6366f1" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search movies, shows, videos or watch parties... (e.g. Avengers)"
          className="home-search-input"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (inputValue.trim()) setShowDropdown(true);
          }}
          autoFocus={autoFocus}
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              setSearchQuery('');
              setShowDropdown(false);
            }}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={18} />
          </button>
        )}
        <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '14px', fontSize: '1rem' }}>
          <span>Search</span>
        </button>
      </form>

      {/* Autocomplete Suggestion Panel */}
      {showDropdown && debouncedQuery && (
        <div className="search-suggestions-dropdown">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>
              {isSearching ? '🔍 Searching TMDB...' : `Search Results for "${debouncedQuery}"`}
            </span>
            <span 
              style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => {
                setShowDropdown(false);
                if (searchMovies) searchMovies(debouncedQuery);
                setCurrentView('search');
              }}
            >
              View All Results →
            </span>
          </div>

          {isSearching ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Loading from TMDB...
            </div>
          ) : dropdownResults.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
              No matches found for "{debouncedQuery}". Press Enter to view full catalog search.
            </div>
          ) : (
            dropdownResults.map(movie => {

              const inWatchlist = watchlist.includes(movie.id);
              return (
                <div key={movie.id} className="suggestion-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      style={{ width: '48px', height: '68px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {movie.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: '4px', color: '#cbd5e1' }}>
                          {movie.year}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                        {movie.genres.join(' • ')} • ⭐ {movie.rating}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '3px' }}>
                        Available on: {movie.providers?.map(p => p.name).join(', ') || "Screen Share"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button 
                      className="btn btn-glass"
                      onClick={() => handleOpenDetails(movie)}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      Details
                    </button>
                    <button 
                      className="btn btn-glass"
                      onClick={() => toggleWatchlist(movie)}
                      style={{ padding: '6px 10px' }}
                      title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                    >
                      {inWatchlist ? <Check size={14} color="#10b981" /> : <Plus size={14} />}
                    </button>
                    <button 
                      className="btn btn-party"
                      onClick={() => handleCreatePartyWithMovie(movie)}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Tv size={14} /> Party 🍿
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
