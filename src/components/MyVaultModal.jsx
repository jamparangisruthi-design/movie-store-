import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Bookmark, 
  Film, 
  Clock, 
  Play, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  Key, 
  Download,
  ShieldCheck
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const MyVaultModal = () => {
  const { 
    activeModal, 
    closeModal, 
    openModal, 
    library, 
    activeRentals, 
    watchlist, 
    movies, 
    toggleWatchlist, 
    addToCart, 
    formatPrice, 
    soundEnabled,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'rentals' | 'watchlist'
  const [, setTimerTicker] = useState(Date.now());

  useEffect(() => {
    if (activeModal.data?.defaultTab) {
      setActiveTab(activeModal.data.defaultTab);
    }
  }, [activeModal]);

  // Real-time rental clock ticker every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => setTimerTicker(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  if (activeModal.type !== 'vault') return null;

  const watchlistMovies = movies.filter(m => watchlist.includes(m.id));

  // Compute remaining rental time
  const getRemainingRentalTime = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m remaining`;
  };

  const handleDownloadLicense = (movieTitle, licenseKey) => {
    playSound('click', soundEnabled);
    const content = `CINEVAULT DIGITAL OWNERSHIP CERTIFICATE\n=======================================\nTitle: ${movieTitle}\nLicense Key: ${licenseKey}\nFormat: 4K Ultra HD HDR10+ / Dolby Atmos\nIssued To: Authorized CineVault Account\nStatus: Lifetime Verified\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CineVault_${movieTitle.replace(/\s+/g, '_')}_License.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Certificate Downloaded', 'Digital 4K License file saved!', 'success');
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-container"
        style={{ width: '900px', maxWidth: '95vw', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={closeModal}>
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div className="brand-icon" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #f59e0b, #b45309)' }}>
            <Bookmark size={22} color="#000" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>My Digital CineVault</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Your personal cinema library: 4K purchases, active rentals, and watchlist
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('library')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'library' ? '2px solid var(--accent-red)' : '2px solid transparent',
              color: activeTab === 'library' ? '#fff' : '#94a3b8',
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Film size={16} />
            <span>4K Purchases ({library.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rentals')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'rentals' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: activeTab === 'rentals' ? '#fff' : '#94a3b8',
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={16} />
            <span>Active Rentals ({activeRentals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'watchlist' ? '2px solid #06b6d4' : '2px solid transparent',
              color: activeTab === 'watchlist' ? '#fff' : '#94a3b8',
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Bookmark size={16} />
            <span>Watchlist ({watchlistMovies.length})</span>
          </button>
        </div>

        {/* Tab 1: Library (Purchased 4K) */}
        {activeTab === 'library' && (
          <div>
            {library.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Film size={48} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>No Purchased Movies Yet</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Movies you buy in 4K UHD will be permanently stored here for instant cloud streaming.
                </p>
                <button className="btn btn-primary" onClick={closeModal}>
                  Browse 4K Store
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {library.map((item, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '14px', borderRadius: '12px' }}>
                    <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                      <img 
                        src={item.movie?.backdrop || item.movie?.poster} 
                        alt={item.movie?.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                        <span className="badge-4k" style={{ fontSize: '0.65rem' }}>4K MASTER</span>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.movie?.title}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '10px' }}>
                      License: <span style={{ color: '#06b6d4', fontFamily: 'monospace' }}>{item.licenseKey}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-primary"
                        onClick={() => { closeModal(); openModal('player', { movie: item.movie }); }}
                        style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                      >
                        <Play size={14} fill="#fff" /> Stream 4K
                      </button>
                      <button 
                        className="btn btn-glass"
                        onClick={() => handleDownloadLicense(item.movie?.title, item.licenseKey)}
                        style={{ padding: '8px 10px' }}
                        title="Download Ownership Certificate"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Rentals */}
        {activeTab === 'rentals' && (
          <div>
            {activeRentals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Clock size={48} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>No Active Rentals</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Weekend movie rentals with 48-hour viewing windows will appear here.
                </p>
                <button className="btn btn-primary" onClick={closeModal}>
                  View Weekend Deals ($1.99 - $3.99)
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {activeRentals.map((rental, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '14px', borderRadius: '12px' }}>
                    <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                      <img 
                        src={rental.movie?.backdrop || rental.movie?.poster} 
                        alt={rental.movie?.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                        <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                          48H RENTAL
                        </span>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                      {rental.movie?.title}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                      <Clock size={13} /> {getRemainingRentalTime(rental.expiresAt)}
                    </div>

                    <button 
                      className="btn btn-gold"
                      onClick={() => { closeModal(); openModal('player', { movie: rental.movie }); }}
                      style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                    >
                      <Play size={14} fill="#000" /> Watch Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Watchlist */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlistMovies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Bookmark size={48} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Your Watchlist is Empty</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Click the plus (+) icon on any movie card or hero banner to bookmark it here.
                </p>
                <button className="btn btn-primary" onClick={closeModal}>
                  Explore Movies
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {watchlistMovies.map((movie) => (
                  <div key={movie.id} className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={movie.poster} alt={movie.title} style={{ width: '56px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.title}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                        {movie.year} • ⭐ {movie.rating}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => { closeModal(); addToCart(movie, 'buy'); }}
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          Buy {formatPrice(movie.buyPrice)}
                        </button>
                        <button 
                          className="btn btn-glass"
                          onClick={() => toggleWatchlist(movie)}
                          style={{ padding: '4px 6px', color: '#ef4444' }}
                          title="Remove from Watchlist"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
