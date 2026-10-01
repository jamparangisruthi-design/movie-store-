import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Sun, 
  Moon, 
  Volume2, 
  Settings, 
  Sparkles, 
  ShoppingBag, 
  Film, 
  Maximize2,
  Tv
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const PlayerModal = () => {
  const { activeModal, closeModal, isMovieOwned, addToCart, formatPrice, soundEnabled } = useStore();
  const [theaterDimLevel, setTheaterDimLevel] = useState(0.95);
  const [resolution, setResolution] = useState('4K UHD (2160p HDR)');
  const [audioTrack, setAudioTrack] = useState('Dolby Atmos 7.1.4');
  const [subtitles, setSubtitles] = useState('Off');
  const [showSettings, setShowSettings] = useState(false);

  if (activeModal.type !== 'player' || !activeModal.data) return null;
  const movie = activeModal.data.movie;
  const isOwned = isMovieOwned(movie.id);

  const trailerSrc = `https://www.youtube-nocookie.com/embed/${movie.trailerId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <div 
      className="modal-backdrop"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${theaterDimLevel})`,
        backdropFilter: 'blur(20px)',
        zIndex: 1100,
        padding: '16px'
      }}
      onClick={closeModal}
    >
      <div 
        style={{
          width: '1100px',
          maxWidth: '96vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge-4k" style={{ fontSize: '0.75rem' }}>{resolution.split(' ')[0]}</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{movie.title}</h3>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>• Official 4K HDR Preview</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Dimmer Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '20px' }}>
              <Moon size={15} color="#94a3b8" />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Theater Dim:</span>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={theaterDimLevel}
                onChange={(e) => setTheaterDimLevel(parseFloat(e.target.value))}
                style={{ width: '80px', accentColor: '#e50914', cursor: 'pointer' }}
                title="Adjust Theater Dim Level"
              />
            </div>

            {/* Quick Settings Toggle */}
            <button
              className="btn btn-glass"
              onClick={() => setShowSettings(!showSettings)}
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
            >
              <Settings size={14} /> Stream Specs
            </button>

            {/* Close */}
            <button className="modal-close-btn" style={{ position: 'static' }} onClick={closeModal}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Video Player Frame with Ambilight Backlight Glow */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(229, 9, 20, 0.25)',
          background: '#000',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <iframe
            src={trailerSrc}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>

        {/* Quick Stream Settings Drawer */}
        {showSettings && (
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              marginTop: '14px',
              padding: '16px 20px',
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'modalFadeIn 0.2s ease-out'
            }}
          >
            {/* Resolution */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Resolution Master:</div>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="4K UHD (2160p HDR)" style={{ background: '#0d1017' }}>4K UHD (2160p HDR 60fps)</option>
                <option value="1080p Full HD" style={{ background: '#0d1017' }}>1080p Full HD</option>
                <option value="720p HD" style={{ background: '#0d1017' }}>720p HD (Data Saver)</option>
              </select>
            </div>

            {/* Audio Track */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Audio Output Stream:</div>
              <select
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="Dolby Atmos 7.1.4" style={{ background: '#0d1017' }}>Dolby Atmos 7.1.4 (Surround)</option>
                <option value="Dolby Digital 5.1" style={{ background: '#0d1017' }}>Dolby Digital 5.1</option>
                <option value="Stereo 2.0" style={{ background: '#0d1017' }}>Stereo 2.0</option>
              </select>
            </div>

            {/* Subtitles */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Subtitles / Closed Captions:</div>
              <select
                value={subtitles}
                onChange={(e) => setSubtitles(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="Off" style={{ background: '#0d1017' }}>Off</option>
                <option value="English CC" style={{ background: '#0d1017' }}>English [CC]</option>
                <option value="Spanish" style={{ background: '#0d1017' }}>Spanish</option>
                <option value="French" style={{ background: '#0d1017' }}>French</option>
                <option value="German" style={{ background: '#0d1017' }}>German</option>
                <option value="Japanese" style={{ background: '#0d1017' }}>Japanese</option>
              </select>
            </div>
          </div>
        )}

        {/* Footer Bar with Instant Buy Callout */}
        {!isOwned && (
          <div style={{
            width: '100%',
            marginTop: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(20, 24, 33, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 20px',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#f59e0b" />
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                Enjoying the preview? Unlock full 4K HDR playback & bonus features.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-gold"
                onClick={() => { closeModal(); addToCart(movie, 'buy'); }}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Buy 4K UHD ({formatPrice(movie.buyPrice)})
              </button>
              <button 
                className="btn btn-glass"
                onClick={() => { closeModal(); addToCart(movie, 'rent'); }}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                Rent 48h ({formatPrice(movie.rentPrice)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
