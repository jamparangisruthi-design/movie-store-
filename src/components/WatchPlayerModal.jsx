import React, { useState } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { X, Tv, Maximize2, Server, Star, Film, ChevronRight, ShieldCheck } from 'lucide-react';

export const getTmdbId = (movie) => {
  if (!movie) return '969681';
  if (movie.tmdbId) return movie.tmdbId;
  if (typeof movie.id === 'number') return movie.id;
  if (typeof movie.id === 'string') {
    const match = movie.id.match(/\d+/);
    if (match) return match[0];
  }
  const staticMap = {
    'mv-avengers-endgame': '299534',
    'mv-the-avengers': '24428',
    'mv-avengers-infinity-war': '299536',
    'mv-stranger-things': '66732',
    'mv-dune-2': '693134',
    'mv-interstellar': '157336',
    'mv-spider-verse': '569094'
  };
  return staticMap[movie.id] || '969681';
};

export const WatchPlayerModal = () => {
  const { modals, setModals } = useWatchParty();
  const [selectedServer, setSelectedServer] = useState('2embed'); // '2embed' | 'vidsrc' | 'vidsrc_icu'
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  if (!modals.watchPlayer) return null;
  const movie = modals.watchPlayer;
  const tmdbId = getTmdbId(movie);
  const isTV = movie.mediaType === 'tv' || (movie.runtime && movie.runtime.includes('Season'));

  // Build Stream URL based on Server & Type
  let embedUrl = '';
  if (selectedServer === '2embed') {
    embedUrl = isTV 
      ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`
      : `https://www.2embed.cc/embed/${tmdbId}`;
  } else if (selectedServer === 'vidsrc') {
    embedUrl = isTV 
      ? `https://vidsrc.me/embed/tv/${tmdbId}/${season}/${episode}`
      : `https://vidsrc.me/embed/movie/${tmdbId}`;
  } else {
    embedUrl = isTV 
      ? `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`
      : `https://vidsrc.icu/embed/movie/${tmdbId}`;
  }

  const handleFullscreen = () => {
    const container = document.getElementById('embedded-player-container');
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }
  };

  const handleCreatePartyWithMovie = () => {
    setModals(prev => ({
      ...prev,
      watchPlayer: null,
      createRoom: true,
      selectedContentForParty: movie
    }));
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999 }} onClick={() => setModals(prev => ({ ...prev, watchPlayer: null }))}>
      <div 
        className="modal-container"
        style={{ 
          width: '1100px', 
          maxWidth: '96vw', 
          maxHeight: '94vh', 
          padding: 0,
          background: '#0a0d14',
          border: '1px solid rgba(99,102,241,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div style={{
          padding: '14px 20px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Left: Movie Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #e50914 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{movie.title}</h3>
                <span style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '1px 7px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={11} fill="#fbbf24" stroke="none" /> {movie.rating}
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', padding: '1px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {movie.year}
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right: Server Switcher & Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Server Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Server size={14} color="#818cf8" />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Server:</span>
              <select 
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="2embed" style={{ background: '#0f172a' }}>2Embed (Server 1 - Recommended)</option>
                <option value="vidsrc" style={{ background: '#0f172a' }}>VidSrc.me (Server 2)</option>
                <option value="vidsrc_icu" style={{ background: '#0f172a' }}>VidSrc.icu (Server 3)</option>
              </select>
            </div>

            {/* TV Show Season / Episode Controls */}
            {isTV && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>S:</span>
                <select 
                  value={season} 
                  onChange={(e) => setSeason(parseInt(e.target.value))}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} style={{ background: '#0f172a' }}>Season {s}</option>)}
                </select>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>E:</span>
                <select 
                  value={episode} 
                  onChange={(e) => setEpisode(parseInt(e.target.value))}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map(e => <option key={e} value={e} style={{ background: '#0f172a' }}>Ep {e}</option>)}
                </select>
              </div>
            )}

            {/* Fullscreen Button */}
            <button 
              className="btn btn-glass"
              onClick={handleFullscreen}
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
              title="Fullscreen Player"
            >
              <Maximize2 size={14} />
              <span>Fullscreen</span>
            </button>

            {/* Host Party */}
            <button 
              className="btn btn-party"
              onClick={handleCreatePartyWithMovie}
              style={{ padding: '6px 14px', fontSize: '0.8rem', gap: '6px' }}
            >
              <Tv size={14} />
              <span>Host Watch Party 🍿</span>
            </button>

            {/* Close Button */}
            <button 
              className="btn-icon"
              onClick={() => setModals(prev => ({ ...prev, watchPlayer: null }))}
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player Frame Container */}
        <div 
          id="embedded-player-container"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            background: '#000',
            overflow: 'hidden'
          }}
        >
          <iframe
            key={`${selectedServer}-${tmdbId}-${season}-${episode}`}
            src={embedUrl}
            title={movie.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture; accelerometer"
            referrerPolicy="origin"
          />
        </div>

        {/* Bottom Bar / Notice */}
        <div style={{
          padding: '10px 20px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Streaming live via TMDB Embed Player • Switch server above if buffer occurs</span>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {movie.genres?.join(' • ')}
          </div>
        </div>
      </div>
    </div>
  );
};
