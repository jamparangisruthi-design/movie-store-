import React, { useRef } from 'react';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playSound } from '../utils/sound';

export const CategoryRow = ({ id, title, subtitle, movies, icon: Icon, badge }) => {
  const containerRef = useRef(null);
  const { soundEnabled } = useStore();

  const scroll = (direction) => {
    playSound('hover', soundEnabled);
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section id={id} className="category-section">
      <div className="category-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {Icon && <Icon size={22} color="#e50914" />}
            <h2 className="category-title">{title}</h2>
            {badge && (
              <span className="badge-4k" style={{ fontSize: '0.7rem' }}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Scroll Arrows */}
        <div className="category-controls">
          <button 
            className="btn-icon" 
            onClick={() => scroll('left')}
            title="Scroll Left"
            style={{ width: '36px', height: '36px' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="btn-icon" 
            onClick={() => scroll('right')}
            title="Scroll Right"
            style={{ width: '36px', height: '36px' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div ref={containerRef} className="category-cards-container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};
