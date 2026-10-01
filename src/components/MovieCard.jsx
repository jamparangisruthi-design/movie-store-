import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Play, 
  ShoppingBag, 
  Plus, 
  Check, 
  Star, 
  Info, 
  Film,
  Sparkles,
  Clock
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const MovieCard = ({ movie, isCompact = false }) => {
  const { 
    openModal, 
    addToCart, 
    toggleWatchlist, 
    isInWatchlist, 
    isMovieOwned, 
    getActiveRental,
    formatPrice, 
    soundEnabled 
  } = useStore();

  const inWatchlist = isInWatchlist(movie.id);
  const isOwned = isMovieOwned(movie.id);
  const activeRental = getActiveRental(movie.id);

  const handleCardClick = (e) => {
    // Avoid triggering if click was on action buttons
    if (e.target.closest('button')) return;
    playSound('click', soundEnabled);
    openModal('detail', movie);
  };

  const handlePlayTrailer = (e) => {
    e.stopPropagation();
    playSound('cinema-bass', soundEnabled);
    openModal('player', { movie });
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    addToCart(movie, 'buy');
  };

  const handleRent = (e) => {
    e.stopPropagation();
    addToCart(movie, 'rent');
  };

  const handleWatchlist = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  if (isCompact) {
    return (
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          gap: '16px',
          padding: '12px',
          borderRadius: '12px',
          cursor: 'pointer',
          alignItems: 'center',
          transition: 'transform 0.2s, border-color 0.2s',
        }}
        onClick={handleCardClick}
      >
        <img 
          src={movie.poster} 
          alt={movie.title} 
          style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-4k" style={{ fontSize: '0.65rem' }}>4K</span>
            <span className="badge-rating" style={{ fontSize: '0.75rem' }}>
              <Star size={11} fill="#fbbf24" stroke="none" />
              {movie.rating}
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {movie.title}
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{movie.year} • {movie.genres.slice(0, 2).join(', ')} • {movie.duration}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{formatPrice(movie.buyPrice)}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn btn-primary" onClick={handleBuy} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Buy
            </button>
            <button className="btn btn-glass" onClick={handlePlayTrailer} style={{ padding: '6px 10px' }}>
              <Play size={14} fill="#fff" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-card" onClick={handleCardClick}>
      {/* Poster Wrap */}
      <div className="movie-poster-wrap">
        <img src={movie.poster} alt={movie.title} loading="lazy" />

        {/* Top Badges */}
        <div className="movie-overlay-badges">
          <span className="badge-4k">4K HDR</span>
          <span className="badge-rating">
            <Star size={12} fill="#fbbf24" stroke="none" />
            {movie.rating}
          </span>
        </div>

        {/* Owned / Rented Banner */}
        {isOwned && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={11} /> OWNED 4K
          </div>
        )}

        {activeRental && !isOwned && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(245, 158, 11, 0.9)',
            color: '#000',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={11} /> ACTIVE RENTAL
          </div>
        )}

        {/* Hover Overlay Actions */}
        <div className="movie-hover-actions">
          <button 
            className="btn btn-primary"
            onClick={handlePlayTrailer}
            style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
          >
            <Play size={16} fill="#fff" />
            <span>Trailer</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
            <button 
              className="btn btn-gold"
              onClick={handleBuy}
              style={{ padding: '8px 4px', fontSize: '0.8rem' }}
            >
              Buy {formatPrice(movie.buyPrice)}
            </button>

            <button 
              className="btn btn-glass"
              onClick={handleRent}
              style={{ padding: '8px 4px', fontSize: '0.8rem' }}
            >
              Rent {formatPrice(movie.rentPrice)}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
            <button
              className="btn btn-glass"
              onClick={handleWatchlist}
              style={{ flex: 1, padding: '8px', fontSize: '0.8rem', gap: '4px' }}
            >
              {inWatchlist ? <Check size={14} color="#f59e0b" /> : <Plus size={14} />}
              <span>{inWatchlist ? 'Watchlist' : 'Watchlist'}</span>
            </button>

            <button
              className="btn-icon"
              onClick={(e) => { e.stopPropagation(); openModal('detail', movie); }}
              title="More Details"
              style={{ width: '36px', height: '36px' }}
            >
              <Info size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Info Body */}
      <div className="movie-card-info">
        <div>
          <h3 className="movie-card-title" title={movie.title}>{movie.title}</h3>
          <div className="movie-card-meta">
            <span>{movie.year}</span>
            <span>{movie.genres.slice(0, 2).join(' • ')}</span>
            <span>{movie.duration}</span>
          </div>
        </div>

        {/* Pricing Line */}
        <div className="movie-card-pricing">
          <span className="price-pill-buy">
            4K {formatPrice(movie.buyPrice)}
          </span>
          <span className="price-pill-rent">
            Rent {formatPrice(movie.rentPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
