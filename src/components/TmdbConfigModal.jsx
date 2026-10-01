import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Key, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const TmdbConfigModal = () => {
  const { 
    activeModal, 
    closeModal, 
    tmdbKey, 
    updateTmdbKey, 
    isLiveTmdb, 
    setIsLiveTmdb, 
    refreshMovies,
    soundEnabled, 
    showToast 
  } = useStore();

  const [inputKey, setInputKey] = useState(tmdbKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (activeModal.type !== 'tmdbConfig') return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    const key = inputKey.trim();
    if (!key) {
      updateTmdbKey('');
      setIsLiveTmdb(false);
      showToast('Switched to Curated Mode', 'Using built-in 4K cinema master database.', 'info');
      closeModal();
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}`);
      if (res.ok) {
        setTestResult({ success: true, message: 'TMDB API Key verified successfully!' });
        playSound('purchase', soundEnabled);
        updateTmdbKey(key);
        showToast('TMDB Connected', 'Live TMDB Movie Store activated!', 'success');
        setTimeout(() => closeModal(), 1000);
      } else {
        setTestResult({ success: false, message: 'Invalid API Key. Please check the key and try again.' });
      }
    } catch (err) {
      setTestResult({ success: false, message: 'Connection error or network offline.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleUseCurated = () => {
    setInputKey('');
    updateTmdbKey('');
    setIsLiveTmdb(false);
    showToast('Curated 4K Mode Active', 'Now displaying high-fidelity 4K curated blockbusters.', 'info');
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-container"
        style={{ width: '640px', maxWidth: '95vw', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={closeModal}>
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div className="brand-icon" style={{ width: '42px', height: '42px' }}>
            <Key size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>TMDB API & Data Source</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Switch between Curated 4K Cinema Master Mode and Live TMDB API integration
            </p>
          </div>
        </div>

        {/* Current Status Pill */}
        <div 
          className="glass-panel"
          style={{
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isLiveTmdb ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            borderColor: isLiveTmdb ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLiveTmdb ? <CheckCircle2 size={20} color="#10b981" /> : <Sparkles size={20} color="#fbbf24" />}
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                {isLiveTmdb ? 'Live TMDB API Mode Active' : 'Curated 4K Ultra HD Mode Active'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {isLiveTmdb ? 'Pulling real-time releases, ratings & backdrops from TMDB servers' : 'Running high-res local 4K curated library with instant loading'}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleTestAndSave}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Your TMDB v3 API Key (Optional):
            </label>
            <input
              type="text"
              placeholder="Paste your 32-character TMDB API Key (e.g. 8a4b...)"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {testResult && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '18px',
              background: testResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: testResult.success ? '#34d399' : '#f87171',
              fontSize: '0.85rem'
            }}>
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              type="submit"
              disabled={isTesting}
              className="btn btn-primary"
              style={{ flex: 1, padding: '12px' }}
            >
              {isTesting ? 'Testing TMDB Connection...' : 'Save & Connect TMDB'}
            </button>
            <button
              type="button"
              onClick={handleUseCurated}
              className="btn btn-glass"
              style={{ padding: '12px 18px' }}
            >
              Use Curated 4K Mode
            </button>
          </div>
        </form>

        {/* Free TMDB Key Info */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
          <p style={{ marginBottom: '6px' }}>
            Need a free TMDB API key? Sign up at TMDB to get full access to 800,000+ movies & TV shows:
          </p>
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-red)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
          >
            Get Free TMDB API Key <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
