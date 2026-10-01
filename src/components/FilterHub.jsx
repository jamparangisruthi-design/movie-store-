import React from 'react';
import { useStore } from '../context/StoreContext';
import { GENRES } from '../data/moviesData';
import { 
  SlidersHorizontal, 
  Grid, 
  List, 
  RotateCcw, 
  Star, 
  Sparkles,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const FilterHub = () => {
  const { filters, setFilters, soundEnabled } = useStore();

  const handleGenreClick = (genre) => {
    playSound('hover', soundEnabled);
    setFilters(prev => ({ ...prev, genre }));
  };

  const handleReset = () => {
    playSound('click', soundEnabled);
    setFilters({
      search: '',
      genre: 'All',
      minRating: 0,
      year: 'All',
      sort: 'popular',
      format: 'all',
      viewMode: filters.viewMode
    });
  };

  const isFiltered = filters.search || filters.genre !== 'All' || filters.minRating > 0 || filters.year !== 'All' || filters.format !== 'all' || filters.sort !== 'popular';

  return (
    <div id="explore-hub" className="filter-bar">
      {/* Top Header / View Toggle & Reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SlidersHorizontal size={20} color="#e50914" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Explore Full 4K Cinema Vault</h3>
          {isFiltered && (
            <button 
              onClick={handleReset}
              className="btn btn-glass"
              style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
            >
              <RotateCcw size={12} /> Reset Filters
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>View:</span>
          <button
            className={`btn-icon ${filters.viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
            style={{
              width: '34px',
              height: '34px',
              background: filters.viewMode === 'grid' ? 'var(--accent-red)' : 'rgba(255,255,255,0.06)'
            }}
            title="Grid View"
          >
            <Grid size={16} />
          </button>
          <button
            className={`btn-icon ${filters.viewMode === 'compact' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, viewMode: 'compact' }))}
            style={{
              width: '34px',
              height: '34px',
              background: filters.viewMode === 'compact' ? 'var(--accent-red)' : 'rgba(255,255,255,0.06)'
            }}
            title="Compact List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="genre-scroll">
        {GENRES.map((genre) => (
          <button
            key={genre}
            className={`genre-pill ${filters.genre === genre ? 'active' : ''}`}
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Advanced Filter Controls Row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Sort By */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={15} color="#94a3b8" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sort:</span>
          <select
            value={filters.sort}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="popular" style={{ background: '#0d1017' }}>Most Popular</option>
            <option value="rating-high" style={{ background: '#0d1017' }}>Highest Rated ⭐</option>
            <option value="price-low" style={{ background: '#0d1017' }}>Price: Low to High</option>
            <option value="price-high" style={{ background: '#0d1017' }}>Price: High to Low</option>
            <option value="newest" style={{ background: '#0d1017' }}>Newest Release</option>
            <option value="title-az" style={{ background: '#0d1017' }}>Title (A-Z)</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={15} fill="#fbbf24" stroke="none" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Min Rating:</span>
          <select
            value={filters.minRating}
            onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value={0} style={{ background: '#0d1017' }}>All Ratings</option>
            <option value={7.0} style={{ background: '#0d1017' }}>7.0+ IMDb</option>
            <option value={8.0} style={{ background: '#0d1017' }}>8.0+ Masterpiece</option>
            <option value={8.5} style={{ background: '#0d1017' }}>8.5+ Legendary</option>
          </select>
        </div>

        {/* Digital Store Format Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} color="#06b6d4" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Format:</span>
          <select
            value={filters.format}
            onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all" style={{ background: '#0d1017' }}>All Formats</option>
            <option value="4k" style={{ background: '#0d1017' }}>4K Ultra HD HDR</option>
            <option value="atmos" style={{ background: '#0d1017' }}>Dolby Atmos Audio</option>
            <option value="deals" style={{ background: '#0d1017' }}>Weekend Rental Deals</option>
          </select>
        </div>

        {/* Release Year */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Year:</span>
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All" style={{ background: '#0d1017' }}>All Years</option>
            <option value="2026" style={{ background: '#0d1017' }}>2026</option>
            <option value="2025" style={{ background: '#0d1017' }}>2025</option>
            <option value="2024" style={{ background: '#0d1017' }}>2024</option>
            <option value="2023" style={{ background: '#0d1017' }}>2023</option>
            <option value="2022" style={{ background: '#0d1017' }}>2022</option>
            <option value="Classics" style={{ background: '#0d1017' }}>Pre-2020 Classics</option>
          </select>
        </div>
      </div>
    </div>
  );
};
