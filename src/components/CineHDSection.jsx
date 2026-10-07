import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { useWatchParty } from '../context/WatchPartyContext';

export const CineHDSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Notice we use the global setMovieToWatch or something equivalent if they have it
  // Let's assume we can just open the external link or play it if they click.
  // The user said: "and whichever link I open, that movie should open."
  // So we'll open the CineHD link in a new tab when clicked.

  useEffect(() => {
    fetch('http://localhost:5000/api/cinehd')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMovies(data.movies);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="trending-section">
        <h2 className="section-title">Latest from CineHD</h2>
        <p style={{ color: 'var(--text-muted)' }}>Loading movies...</p>
      </section>
    );
  }

  if (!movies.length) return null;

  return (
    <section className="trending-section" style={{ marginTop: '2rem' }}>
      <div className="section-header">
        <h2 className="section-title">
          <span style={{ color: 'var(--primary)', marginRight: '8px' }}>💥</span>
          Latest Movies & Shows from CineHD
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
        {movies.map(movie => (
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
            onClick={() => window.open(movie.link, '_blank')}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#111' }}>
              <img 
                src={movie.image} 
                alt={movie.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(229,9,20,0.85)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
                {movie.type === 'tv' ? 'Series' : 'Movie'}
              </div>
            </div>
            
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {movie.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                  {movie.year || '2026'}
                </div>
              </div>

              <button 
                className="btn btn-party"
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #e50914 0%, #b91c1c 100%)', boxShadow: '0 4px 12px rgba(229,9,20,0.3)' }}
              >
                <Play size={14} fill="#fff" />
                <span>Watch on CineHD</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
