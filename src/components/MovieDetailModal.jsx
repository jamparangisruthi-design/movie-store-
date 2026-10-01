import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Play, 
  ShoppingBag, 
  Star, 
  Plus, 
  Check, 
  Sparkles, 
  Tv, 
  Layers, 
  Volume2, 
  Film, 
  Send, 
  ThumbsUp, 
  Clock, 
  Award,
  ShieldCheck
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const MovieDetailModal = () => {
  const { 
    activeModal, 
    closeModal, 
    openModal, 
    addToCart, 
    toggleWatchlist, 
    isInWatchlist, 
    isMovieOwned, 
    getActiveRental,
    formatPrice, 
    addReview, 
    movies,
    soundEnabled 
  } = useStore();

  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cast' | 'specs' | 'reviews'

  if (activeModal.type !== 'detail' || !activeModal.data) return null;
  const movie = activeModal.data;

  const inWatchlist = isInWatchlist(movie.id);
  const isOwned = isMovieOwned(movie.id);
  const activeRental = getActiveRental(movie.id);

  const handlePlayTrailer = () => {
    playSound('cinema-bass', soundEnabled);
    openModal('player', { movie });
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    addReview(movie.id, {
      user: reviewName.trim() || 'Verified CineVault Member',
      rating: reviewRating,
      text: reviewText.trim()
    });
    setReviewText('');
    setReviewName('');
  };

  const similarMovies = movies.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 4);

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-container"
        style={{ width: '920px', maxWidth: '95vw', padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeModal} title="Close">
          <X size={20} />
        </button>

        {/* Modal Hero Backdrop Header */}
        <div style={{ position: 'relative', width: '100%', height: '360px', overflow: 'hidden' }}>
          <img 
            src={movie.backdrop || movie.poster} 
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, #0d1017 0%, rgba(13, 16, 23, 0.7) 50%, rgba(0, 0, 0, 0.4) 100%)'
          }} />

          {/* Floating Play Button */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '32px',
            right: '32px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="badge-4k">4K ULTRA HD</span>
                {movie.hasDolbyVision && <span className="badge-dolby">DOLBY VISION</span>}
                {movie.hasDolbyAtmos && <span className="badge-dolby">DOLBY ATMOS</span>}
                <span className="badge-rating">
                  <Star size={12} fill="#fbbf24" stroke="none" />
                  {movie.rating} IMDb
                </span>
                {movie.rottenScore && (
                  <span style={{ background: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                    🍅 {movie.rottenScore}%
                  </span>
                )}
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1, color: '#fff' }}>
                {movie.title}
              </h2>
              {movie.tagline && (
                <p style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontSize: '1rem', marginTop: '4px' }}>
                  "{movie.tagline}"
                </p>
              )}
            </div>

            <button 
              className="btn btn-primary"
              onClick={handlePlayTrailer}
              style={{ padding: '12px 24px', fontSize: '1rem' }}
            >
              <Play size={18} fill="#fff" />
              <span>Watch 4K Trailer</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 32px' }}>
          {/* Status Alert if Owned or Rented */}
          {isOwned && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '10px',
              padding: '12px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', fontWeight: 600 }}>
                <ShieldCheck size={20} />
                <span>You own the 4K Ultra HD Digital Master license for this title.</span>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handlePlayTrailer}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                Stream Now
              </button>
            </div>
          )}

          {activeRental && !isOwned && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '10px',
              padding: '12px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24', fontWeight: 600 }}>
                <Clock size={20} />
                <span>Active 48-Hour Rental Pass. Stream anytime anywhere.</span>
              </div>
              <button 
                className="btn btn-gold"
                onClick={handlePlayTrailer}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                Watch Rental
              </button>
            </div>
          )}

          {/* Purchase Option Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {/* 4K UHD Purchase Card */}
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(229,9,20,0.12) 0%, rgba(18,22,31,0.8) 100%)',
                border: '1px solid rgba(229,9,20,0.4)',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '-10px', right: '14px' }}>
                <span className="badge-4k" style={{ fontSize: '0.7rem' }}>LIFETIME OWNERSHIP</span>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>4K UHD Digital Copy</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>Dolby Vision HDR + Dolby Atmos + Bonus Vault & Artbook</p>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
                  {formatPrice(movie.buyPrice)}
                </div>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => addToCart(movie, 'buy')}
                style={{ width: '100%', padding: '10px' }}
              >
                <ShoppingBag size={16} /> Buy 4K Digital
              </button>
            </div>

            {/* 48h Rental Card */}
            <div 
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>48-Hour HD Rental</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>Watch within 30 days, 48 hours to complete once started</p>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#94a3b8', marginBottom: '12px' }}>
                  {formatPrice(movie.rentPrice)}
                </div>
              </div>
              <button 
                className="btn btn-glass"
                onClick={() => addToCart(movie, 'rent')}
                style={{ width: '100%', padding: '10px' }}
              >
                Rent for 48 Hours
              </button>
            </div>

            {/* Watchlist & Share Card */}
            <div 
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              <button 
                className="btn btn-glass"
                onClick={() => toggleWatchlist(movie)}
                style={{ width: '100%', padding: '10px' }}
              >
                {inWatchlist ? <Check size={16} color="#f59e0b" /> : <Plus size={16} />}
                <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
                Director: <span style={{ color: '#cbd5e1' }}>{movie.director}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
            {['overview', 'cast', 'specs', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid var(--accent-red)' : '2px solid transparent',
                  color: activeTab === tab ? '#fff' : '#94a3b8',
                  padding: '10px 14px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'specs' ? '4K Technical Specs' : tab}
              </button>
            ))}
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#cbd5e1', marginBottom: '24px' }}>
                {movie.overview}
              </p>

              {movie.bonusFeatures && movie.bonusFeatures.length > 0 && (
                <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} /> Included Digital Bonus Features & Artbook
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {movie.bonusFeatures.map((bonus, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Film size={14} color="#e50914" /> {bonus}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Cast & Crew */}
          {activeTab === 'cast' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                {movie.cast && movie.cast.map((actor, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={actor.avatar} 
                      alt={actor.name} 
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{actor.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{actor.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Specs */}
          {activeTab === 'specs' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Video Master</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>4K Ultra HD (3840x2160)</div>
                <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '4px' }}>HDR10+ / Dolby Vision</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Audio Master</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>Dolby Atmos 7.1.4</div>
                <div style={{ fontSize: '0.8rem', color: '#06b6d4', marginTop: '4px' }}>24-bit / 48kHz TrueHD</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Aspect Ratio</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>2.39:1 CinemaScope</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>IMAX 1.90:1 Selected Sequences</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Subtitles & Languages</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>18 Languages</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>English CC, Spanish, French, German, Japanese</div>
              </div>
            </div>
          )}

          {/* Tab Content: Reviews */}
          {activeTab === 'reviews' && (
            <div>
              {/* Add Review Form */}
              <form onSubmit={handleAddReviewSubmit} className="glass-panel" style={{ padding: '18px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Write a Cinema Review</h4>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Your Name or Nickname"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        fill={star <= reviewRating ? '#fbbf24' : 'none'}
                        color={star <= reviewRating ? '#fbbf24' : '#64748b'}
                        onClick={() => setReviewRating(star)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Share your thoughts on the movie, 4K picture quality, or sound design..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'inherit',
                    marginBottom: '12px'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  <Send size={14} /> Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {movie.reviews && movie.reviews.map((rev) => (
                  <div key={rev.id} className="glass-panel" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={rev.avatar} alt={rev.user} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{rev.user}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rev.date}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#fbbf24" stroke="none" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Recommended Movies */}
          {similarMovies.length > 0 && (
            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>More Like This</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                {similarMovies.map(sim => (
                  <div 
                    key={sim.id} 
                    className="glass-panel" 
                    style={{ padding: '8px', cursor: 'pointer', borderRadius: '10px' }}
                    onClick={() => openModal('detail', sim)}
                  >
                    <img src={sim.poster} alt={sim.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sim.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sim.year} • ⭐ {sim.rating}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
