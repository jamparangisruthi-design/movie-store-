import React, { useState } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { Bookmark, Star, Tv, Trash2, Film, Plus } from 'lucide-react';

export const WatchlistPage = () => {
  const { watchlist, toggleWatchlist, movies, setModals } = useWatchParty();
  const [filterType, setFilterType] = useState('all');

  const watchlistMovies = movies.filter(m => watchlist.includes(m.id));

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.2)', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark size={20} color="#818cf8" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900 }}>
              Your Watchlist
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
            Saved titles ready to launch as a social watch party with one click
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'movies', 'shows'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                background: filterType === type ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                border: filterType === type ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                color: filterType === type ? '#fff' : '#94a3b8',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {watchlistMovies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Bookmark size={56} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>Your Watchlist is Empty</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            Add movies or shows from the home page search or discover view to plan your upcoming watch parties.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {watchlistMovies.map(movie => (
            <div 
              key={movie.id}
              className="glass-panel"
              style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
                <img src={movie.backdrop || movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={11} fill="#fbbf24" stroke="none" /> {movie.rating}
                </div>
              </div>

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{movie.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
                    {movie.year} • {movie.genres.slice(0, 2).join(' • ')}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-party"
                    onClick={() => setModals(prev => ({ ...prev, createRoom: true, selectedContentForParty: movie }))}
                    style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                  >
                    <Tv size={14} /> Host Party
                  </button>
                  <button 
                    className="btn btn-glass"
                    onClick={() => toggleWatchlist(movie)}
                    style={{ padding: '8px 10px', color: '#ef4444' }}
                    title="Remove from Watchlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
