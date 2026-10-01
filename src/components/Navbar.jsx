import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Film, 
  Search, 
  ShoppingBag, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Globe, 
  Key, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { CURRENCIES } from '../data/moviesData';

export const Navbar = () => {
  const {
    cart,
    watchlist,
    library,
    activeRentals,
    currency,
    setCurrency,
    soundEnabled,
    setSoundEnabled,
    isLiveTmdb,
    openModal,
    filters,
    setFilters,
    formatPrice,
    movies
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle scroll backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !searchInputRef.current?.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    setFilters(prev => ({ ...prev, search: val }));
    setShowSearchDropdown(val.trim().length > 0);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setFilters(prev => ({ ...prev, search: '' }));
    setShowSearchDropdown(false);
  };

  const quickSearchResults = searchValue.trim() 
    ? movies.filter(m => m.title.toLowerCase().includes(searchValue.toLowerCase()) || m.genres.some(g => g.toLowerCase().includes(searchValue.toLowerCase()))).slice(0, 5)
    : [];

  const totalCartCount = cart.length;
  const totalVaultCount = library.length + activeRentals.length;

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-wrapper">
        {/* Brand */}
        <a href="#" className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon">
            <Film size={22} />
          </div>
          <span>CINE<span className="brand-vault">VAULT</span></span>
        </a>

        {/* Nav Links */}
        <nav className="nav-links">
          <a href="#featured" className="nav-link">Spotlight</a>
          <a href="#trending" className="nav-link">Trending</a>
          <a href="#store-4k" className="nav-link">4K UHD Store</a>
          <a href="#rentals" className="nav-link">Weekend Deals</a>
          <a href="#cinepass" className="nav-link">CinePass VIP</a>
          <a href="#explore-hub" className="nav-link">Catalog</a>
        </nav>

        {/* Actions & Search */}
        <div className="nav-actions">
          {/* Live Search */}
          <div className="search-wrapper" style={{ position: 'relative' }}>
            <Search size={16} className="search-icon-left" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search 4K movies, cast, genres..."
              className="search-input"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => { if (searchValue.trim()) setShowSearchDropdown(true); }}
            />
            {searchValue ? (
              <button 
                onClick={handleClearSearch}
                style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            ) : (
              <span className="search-shortcut-badge">/</span>
            )}

            {/* Quick Search Autocomplete Dropdown */}
            {showSearchDropdown && quickSearchResults.length > 0 && (
              <div 
                ref={dropdownRef}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '320px',
                  zIndex: 200,
                  padding: '8px',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.8)'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  Quick Search Matches
                </div>
                {quickSearchResults.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      openModal('detail', m);
                      setShowSearchDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={m.poster} alt={m.title} style={{ width: '32px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.year} • {m.genres[0]} • ⭐ {m.rating}</div>
                    </div>
                    <span className="badge-4k" style={{ fontSize: '0.65rem' }}>{formatPrice(m.buyPrice)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TMDB API Status / Switcher Button */}
          <button 
            className="btn btn-glass"
            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
            onClick={() => openModal('tmdbConfig')}
            title="Configure TMDB API Key & Mode"
          >
            <Key size={14} color={isLiveTmdb ? "#10b981" : "#f59e0b"} />
            <span>{isLiveTmdb ? 'TMDB Live' : 'Curated 4K'}</span>
          </button>

          {/* Currency Switcher */}
          <div style={{ position: 'relative' }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#f8fafc',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {Object.keys(CURRENCIES).map((curr) => (
                <option key={curr} value={curr} style={{ background: '#0d1017', color: '#fff' }}>
                  {CURRENCIES[curr].label}
                </option>
              ))}
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            className="btn-icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute UI Sound Effects" : "Enable Cinema Sound FX"}
          >
            {soundEnabled ? <Volume2 size={18} color="#e50914" /> : <VolumeX size={18} color="#64748b" />}
          </button>

          {/* My Vault (Purchased & Rentals) Button */}
          <button
            className="btn btn-glass"
            onClick={() => openModal('vault', { defaultTab: 'library' })}
            style={{ position: 'relative', padding: '8px 14px' }}
            title="My Digital Vault & Purchases"
          >
            <Bookmark size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem' }}>My Vault</span>
            {totalVaultCount > 0 && (
              <span 
                style={{
                  background: '#f59e0b',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}
              >
                {totalVaultCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            className="btn btn-primary"
            onClick={() => openModal('checkout')}
            style={{ position: 'relative', padding: '8px 16px' }}
            title="Shopping Cart & Checkout"
          >
            <ShoppingBag size={18} />
            <span style={{ fontSize: '0.85rem' }}>Cart</span>
            {totalCartCount > 0 && (
              <span className="cart-badge-count">{totalCartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
