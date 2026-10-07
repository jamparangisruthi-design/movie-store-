import React, { useState, useEffect } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { Search, Star, Plus, Check, Tv, Film, Compass, Users, Sparkles, Filter, Play } from 'lucide-react';
import { SearchBar } from './SearchBar';

export const SearchResultsPage = () => {
  const { 
    movies, 
    activeRooms, 
    searchQuery, 
    setSearchQuery, 
    searchFilterTab, 
    setSearchFilterTab,
    setModals,
    openWatchPlayer,
    toggleWatchlist,
    watchlist,
    joinRoom,
    searchMovies,
    tmdbLoading
  } = useWatchParty();

  const [activeTab, setActiveTab] = useState(searchFilterTab || 'all');

  // Trigger live TMDB search when landing on this page with a query
  useEffect(() => {
    if (searchQuery && searchMovies) {
      searchMovies(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMovies = movies.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q)) ||
      m.director.toLowerCase().includes(q) ||
      m.cast.some(c => c.name.toLowerCase().includes(q))
    );
  });

  const matchingRooms = activeRooms.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.movie?.title.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
      {/* Header & Search Bar */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, marginBottom: '8px' }}>
          {searchQuery ? `Search Results for "${searchQuery}"` : "Discover Movies & Watch Parties"}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '24px' }}>
          Explore legal metadata and start an instant social watch party with friends
        </p>

        <SearchBar isHero={false} />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '32px', overflowX: 'auto' }}>
        {[
          { id: 'all', label: `All Results (${filteredMovies.length + matchingRooms.length})` },
          { id: 'movies', label: `Movies (${filteredMovies.length})` },
          { id: 'shows', label: `Shows & Series (${filteredMovies.filter(m => m.runtime.includes('Season')).length})` },
          { id: 'parties', label: `Live Watch Parties (${matchingRooms.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              border: activeTab === tab.id ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
              color: activeTab === tab.id ? '#fff' : '#94a3b8',
              padding: '8px 18px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Live Watch Parties */}
      {(activeTab === 'all' || activeTab === 'parties') && matchingRooms.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tv size={20} color="#e50914" /> Matching Live Watch Parties
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {matchingRooms.map((room) => (
              <div key={room.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{room.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                    Streaming: <span style={{ color: '#cbd5e1' }}>{room.movie?.title || "Live Stream"}</span>
                  </div>
                </div>
                <button className="btn btn-party" onClick={() => joinRoom(room.id)} style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                  Join Party 🍿
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movies / Shows Results Grid */}
      {(activeTab === 'all' || activeTab === 'movies' || activeTab === 'shows') && (
        <div>
          {filteredMovies.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Film size={48} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>No content matching "{searchQuery}"</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Try searching for Avengers, Dune, Interstellar, or Stranger Things.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredMovies.map((movie) => {
                const inWatchlist = watchlist.includes(movie.id);

                return (
                  <div 
                    key={movie.id}
                    className="glass-panel"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      gap: '24px',
                      alignItems: 'center',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      flexWrap: 'wrap'
                    }}
                    onClick={() => setModals(prev => ({ ...prev, movieDetails: movie }))}
                  >
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      style={{ width: '100px', height: '148px', objectFit: 'cover', borderRadius: '10px' }}
                    />

                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{movie.title}</h3>
                        <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                          {movie.year}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                          <Star size={12} fill="#fbbf24" stroke="none" /> {movie.rating}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                        {movie.genres.join(' • ')} • Runtime: {movie.runtime} • Directed by {movie.director}
                      </div>

                      <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {movie.overview}
                      </p>

                      {/* Providers Pill */}
                      {movie.providers && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Where to stream:</span>
                          {movie.providers.map((p, idx) => (
                            <span key={idx} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#c7d2fe', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                              {p.logo} {p.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action CTAs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="btn btn-party"
                        onClick={() => openWatchPlayer(movie)}
                        style={{ width: '100%', padding: '10px 16px', fontSize: '0.9rem', background: 'linear-gradient(135deg, #e50914 0%, #b91c1c 100%)', boxShadow: '0 4px 12px rgba(229,9,20,0.3)' }}
                      >
                        <Play size={16} fill="#fff" /> Watch Now 🎬
                      </button>

                      <button 
                        className="btn btn-glass"
                        onClick={() => setModals(prev => ({ ...prev, createRoom: true, selectedContentForParty: movie }))}
                        style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <Tv size={15} /> Create Watch Party
                      </button>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-glass"
                          onClick={() => setModals(prev => ({ ...prev, movieDetails: movie }))}
                          style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                        >
                          View Details
                        </button>

                        <button 
                          className="btn btn-glass"
                          onClick={() => toggleWatchlist(movie)}
                          style={{ padding: '8px 12px' }}
                          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                        >
                          {inWatchlist ? <Check size={16} color="#10b981" /> : <Plus size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
