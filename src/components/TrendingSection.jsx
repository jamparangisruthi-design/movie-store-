import React from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { Flame, Star, Plus, Check, Tv, Play } from 'lucide-react';

export const TrendingSection = () => {
  const { movies, setModals, toggleWatchlist, watchlist } = useWatchParty();

  return (
    <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 24px 60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={24} color="#e50914" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900 }}>
              Trending Movies & Shows
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
            Popular titles chosen by watch party hosts this week
          </p>
        </div>
      </div>

      {/* Movies Grid */}
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
                    {movie.year} • {movie.genres.slice(0, 2).join(' • ')}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                  <button 
                    className="btn btn-party"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModals(prev => ({ ...prev, createRoom: true, selectedContentForParty: movie }));
                    }}
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    <Tv size={15} />
                    <span>Create Party</span>
                  </button>

                  <button
                    className="btn btn-glass"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(movie);
                    }}
                    style={{ padding: '8px 10px' }}
                    title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  >
                    {inWatchlist ? <Check size={16} color="#10b981" /> : <Plus size={16} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
