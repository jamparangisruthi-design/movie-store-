import React from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { Flame, Star, Plus, Check, Tv, Play } from 'lucide-react';

export const TrendingSection = () => {
  const { movies, setModals, openWatchPlayer, toggleWatchlist, watchlist, tmdbLoading } = useWatchParty();

  return (
    <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 24px 60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={24} color="#e50914" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900 }}>
              Trending Movies &amp; Shows
            </h2>
            {!tmdbLoading && (
              <span style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.4)', color: '#e50914', fontSize: '0.65rem', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                LIVE
              </span>
            )}
            {tmdbLoading && (
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Loading from TMDB...
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
            {tmdbLoading ? 'Fetching real-time trending titles...' : 'Popular titles trending this week on TMDB'}
          </p>
        </div>
      </div>

      {/* Skeleton Loading Grid */}
      {tmdbLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ aspectRatio: '2/3.6', borderRadius: '16px' }} />
          ))}
        </div>
      ) : (
      /* Movies Grid */
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
        {movies.map((movie) => {
          const inWatchlist = watchlist.includes(movie.id);

          return (
            <div 
              key={movie.id}
              className="glass-panel"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.25s, border-color 0.25s',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onClick={() => setModals(prev => ({ ...prev, movieDetails: movie }))}
            >
              {/* Poster */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#111' }}>
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
                  <Star size={12} fill="#fbbf24" stroke="none" />
                  {movie.rating}
                </div>
                {movie.providers && movie.providers[0] && (
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>
                    {movie.providers[0].logo} {movie.providers[0].name}
                  </div>
                )}
              </div>

              {/* Info & Actions */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {movie.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                    {movie.year} • {(movie.genres || []).slice(0, 2).join(' • ')}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button 
                    className="btn btn-party"
                    onClick={(e) => {
                      e.stopPropagation();
                      openWatchPlayer(movie);
                    }}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #e50914 0%, #b91c1c 100%)', boxShadow: '0 4px 12px rgba(229,9,20,0.3)' }}
                  >
                    <Play size={14} fill="#fff" />
                    <span>Watch Now 🎬</span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px' }}>
                    <button 
                      className="btn btn-glass"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModals(prev => ({ ...prev, createRoom: true, selectedContentForParty: movie }));
                      }}
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    >
                      <Tv size={14} />
                      <span>Host Party</span>
                    </button>

                    <button
                      className="btn btn-glass"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(movie);
                      }}
                      style={{ padding: '6px 10px' }}
                      title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                    >
                      {inWatchlist ? <Check size={14} color="#10b981" /> : <Plus size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
};
