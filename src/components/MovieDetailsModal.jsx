import React from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { 
  X, 
  Tv, 
  Plus, 
  Check, 
  Star, 
  ExternalLink, 
  Share2, 
  ShieldCheck, 
  Play, 
  Clock, 
  Film,
  Users
} from 'lucide-react';

export const MovieDetailsModal = () => {
  const { modals, setModals, openWatchPlayer, toggleWatchlist, watchlist, showToast } = useWatchParty();

  if (!modals.movieDetails) return null;
  const movie = modals.movieDetails;
  const inWatchlist = watchlist.includes(movie.id);

  const handleShareMovie = () => {
    navigator.clipboard.writeText(`${window.location.origin}/movie/${movie.id}`);
    showToast('Link Copied', `Shareable link for ${movie.title} copied to clipboard!`, 'success');
  };

  const handleCreateParty = () => {
    setModals(prev => ({
      ...prev,
      movieDetails: null,
      createRoom: true,
      selectedContentForParty: movie
    }));
  };

  return (
    <div className="modal-backdrop" onClick={() => setModals(prev => ({ ...prev, movieDetails: null }))}>
      <div 
        className="modal-container"
        style={{ width: '920px', maxWidth: '95vw', padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={() => setModals(prev => ({ ...prev, movieDetails: null }))}
        >
          <X size={20} />
        </button>

        {/* Hero Backdrop Banner */}
        <div style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden' }}>
          <img 
            src={movie.backdrop || movie.poster} 
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, #0e1118 0%, rgba(14, 17, 24, 0.7) 50%, rgba(0,0,0,0.4) 100%)'
          }} />

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {movie.ageRating}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                  <Star size={12} fill="#fbbf24" stroke="none" /> {movie.rating} IMDb
                </span>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{movie.runtime}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
                {movie.title}
              </h2>
              {movie.tagline && (
                <p style={{ color: '#818cf8', fontStyle: 'italic', fontSize: '0.95rem', marginTop: '4px' }}>
                  "{movie.tagline}"
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-party"
                onClick={() => openWatchPlayer(movie)}
                style={{ padding: '12px 24px', fontSize: '1rem', gap: '8px', background: 'linear-gradient(135deg, #e50914 0%, #b91c1c 100%)', boxShadow: '0 0 20px rgba(229,9,20,0.4)' }}
              >
                <Play size={18} fill="#fff" />
                <span>Watch Now 🎬</span>
              </button>

              <button 
                className="btn btn-glass"
                onClick={handleCreateParty}
                style={{ padding: '12px 20px', fontSize: '0.95rem', gap: '8px' }}
              >
                <Tv size={18} />
                <span>Create Watch Party 🍿</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 32px' }}>
          {/* Quick Actions Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-party"
              onClick={() => openWatchPlayer(movie)}
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #e50914 0%, #b91c1c 100%)' }}
            >
              <Play size={16} fill="#fff" /> Watch Movie Now
            </button>

            <button 
              className="btn btn-party"
              onClick={handleCreateParty}
              style={{ padding: '10px 20px' }}
            >
              <Tv size={16} /> Host Party
            </button>

            <button 
              className="btn btn-glass"
              onClick={() => toggleWatchlist(movie)}
              style={{ padding: '10px 18px' }}
            >
              {inWatchlist ? <Check size={16} color="#10b981" /> : <Plus size={16} />}
              <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button 
              className="btn btn-glass"
              onClick={handleShareMovie}
              style={{ padding: '10px 18px' }}
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          {/* Synopsis */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Overview</h4>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.7 }}>
              {movie.overview}
            </p>
            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
              Director: <span style={{ color: '#fff', fontWeight: 600 }}>{movie.director}</span> • Genres: <span style={{ color: '#fff', fontWeight: 600 }}>{movie.genres.join(', ')}</span>
            </div>
          </div>

          {/* Cast Gallery */}
          {movie.cast && movie.cast.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Cast & Characters</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                {movie.cast.map((actor, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '10px' }}>
                    <img 
                      src={actor.avatar} 
                      alt={actor.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Streaming & Provider Availability Card */}
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={18} color="#10b981" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Official Provider & Playback Modes</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {movie.providers?.map((provider, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '14px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                      {provider.logo} {provider.name}
                    </div>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {provider.playbackMode}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '10px' }}>
                    {provider.note || "Host shares browser playback tab with group."}
                  </p>

                  <a 
                    href={provider.officialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-glass"
                    style={{ width: '100%', padding: '6px 12px', fontSize: '0.75rem', gap: '6px', justifyContent: 'center' }}
                  >
                    <span>Open Official {provider.name}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '14px', lineHeight: 1.5 }}>
              * WatchTogether does not store, retransmit, or scrape protected video streams. Users use legitimate personal subscriptions and share their browser screen in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
