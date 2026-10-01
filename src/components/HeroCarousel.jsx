import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Play, 
  ShoppingBag, 
  Plus, 
  Check, 
  Star, 
  Tv, 
  Info, 
  Sparkles,
  Film,
  Volume2
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const HeroCarousel = () => {
  const { 
    movies, 
    activeHeroIndex, 
    setActiveHeroIndex, 
    openModal, 
    addToCart, 
    toggleWatchlist, 
    isInWatchlist, 
    formatPrice,
    soundEnabled
  } = useStore();

  const featuredMovies = movies.filter(m => m.featured || m.rating >= 8.0).slice(0, 5);
  const currentMovie = featuredMovies[activeHeroIndex] || movies[0] || null;

  // Auto rotate hero carousel every 8 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [featuredMovies.length, setActiveHeroIndex]);

  if (!currentMovie) return null;

  const inWatchlist = isInWatchlist(currentMovie.id);

  const handleSelectThumb = (idx) => {
    playSound('hover', soundEnabled);
    setActiveHeroIndex(idx);
  };

  const handleWatchTrailer = () => {
    playSound('cinema-bass', soundEnabled);
    openModal('player', { movie: currentMovie });
  };

  return (
    <section id="featured" className="hero-spotlight">
      {/* Background Image with cross-fade */}
      <img
        key={currentMovie.id}
        src={currentMovie.backdrop || currentMovie.poster}
        alt={currentMovie.title}
        className="hero-backdrop-img"
      />
      <div className="hero-gradient-overlay" />

      {/* Hero Content */}
      <div className="hero-content">
        {/* Badges Row */}
        <div className="hero-badge-row">
          <span className="badge-4k">4K ULTRA HD</span>
          {currentMovie.hasDolbyVision && <span className="badge-dolby">DOLBY VISION</span>}
          {currentMovie.hasDolbyAtmos && <span className="badge-dolby">DOLBY ATMOS</span>}
          {currentMovie.hasImax && (
            <span style={{ background: '#3b82f6', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
              IMAX ENHANCED
            </span>
          )}
          <span className="badge-rating">
            <Star size={13} fill="#fbbf24" stroke="none" />
            {currentMovie.rating} IMDb
          </span>
          {currentMovie.rottenScore && (
            <span style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', fontSize: '0.8rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
              🍅 {currentMovie.rottenScore}% Match
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="hero-title">{currentMovie.title}</h1>
        {currentMovie.tagline && <p className="hero-tagline">"{currentMovie.tagline}"</p>}

        {/* Meta Info */}
        <div className="hero-meta-row">
          <span>{currentMovie.year}</span>
          <span>•</span>
          <span>{currentMovie.duration}</span>
          <span>•</span>
          <span style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
            {currentMovie.ageRating}
          </span>
          <span>•</span>
          <span>{currentMovie.genres.join(', ')}</span>
        </div>

        {/* Overview */}
        <p className="hero-overview">{currentMovie.overview}</p>

        {/* Action Buttons */}
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleWatchTrailer} style={{ padding: '12px 24px', fontSize: '1.05rem' }}>
            <Play size={20} fill="#fff" />
            <span>Watch 4K Trailer</span>
          </button>

          <button 
            className="btn btn-gold" 
            onClick={() => addToCart(currentMovie, 'buy')}
            style={{ padding: '12px 22px' }}
          >
            <ShoppingBag size={18} />
            <span>Buy 4K UHD ({formatPrice(currentMovie.buyPrice)})</span>
          </button>

          <button 
            className="btn btn-glass"
            onClick={() => addToCart(currentMovie, 'rent')}
            style={{ padding: '12px 18px' }}
          >
            <span>Rent HD ({formatPrice(currentMovie.rentPrice)})</span>
          </button>

          <button 
            className="btn-icon" 
            onClick={() => toggleWatchlist(currentMovie)}
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            style={{
              width: '46px',
              height: '46px',
              background: inWatchlist ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.08)',
              borderColor: inWatchlist ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)'
            }}
          >
            {inWatchlist ? <Check size={20} color="#f59e0b" /> : <Plus size={20} />}
          </button>

          <button 
            className="btn-icon"
            onClick={() => openModal('detail', currentMovie)}
            title="View Full Details, Cast & Technical Specs"
            style={{ width: '46px', height: '46px' }}
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Thumbnails Navigation Bar */}
      <div className="hero-thumbnails-bar">
        {featuredMovies.map((movie, idx) => (
          <button
            key={movie.id}
            className={`hero-thumb-btn ${idx === activeHeroIndex ? 'active' : ''}`}
            onClick={() => handleSelectThumb(idx)}
            title={movie.title}
          >
            <img src={movie.poster} alt={movie.title} />
          </button>
        ))}
      </div>
    </section>
  );
};
