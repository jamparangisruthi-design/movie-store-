import React from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryRow } from './components/CategoryRow';
import { FilterHub } from './components/FilterHub';
import { MovieCard } from './components/MovieCard';
import { CinePassSection } from './components/CinePassSection';
import { MovieDetailModal } from './components/MovieDetailModal';
import { PlayerModal } from './components/PlayerModal';
import { CheckoutModal } from './components/CheckoutModal';
import { MyVaultModal } from './components/MyVaultModal';
import { TmdbConfigModal } from './components/TmdbConfigModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { 
  Flame, 
  Sparkles, 
  Tag, 
  Film, 
  Award, 
  Tv, 
  Clock, 
  Search,
  FilterX
} from 'lucide-react';

export const App = () => {
  const { movies, filters, isLoadingMovies } = useStore();

  // Categorized movie lists
  const trendingMovies = movies.filter(m => m.trending || m.rating >= 8.0);
  const store4kMovies = movies.filter(m => m.is4K || m.buyPrice > 0);
  const weekendDeals = movies.filter(m => m.deal48h || m.rentPrice <= 3.99);
  const sciFiMovies = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('sci-fi') || g.toLowerCase().includes('cyberpunk')));
  const actionMovies = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('action') || g.toLowerCase().includes('thriller')));

  // Filtered & Sorted Catalog for the Discovery Hub
  const filteredCatalog = movies.filter(m => {
    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchGenre = m.genres.some(g => g.toLowerCase().includes(q));
      const matchDirector = m.director ? m.director.toLowerCase().includes(q) : false;
      const matchCast = m.cast ? m.cast.some(c => c.name.toLowerCase().includes(q)) : false;
      if (!matchTitle && !matchGenre && !matchDirector && !matchCast) return false;
    }

    // Genre filter
    if (filters.genre !== 'All') {
      if (!m.genres.includes(filters.genre)) return false;
    }

    // Min Rating
    if (filters.minRating > 0) {
      if (m.rating < filters.minRating) return false;
    }

    // Release Year
    if (filters.year !== 'All') {
      if (filters.year === 'Classics') {
        if (m.year >= 2020) return false;
      } else {
        if (m.year !== parseInt(filters.year)) return false;
      }
    }

    // Format Filter
    if (filters.format === '4k' && !m.is4K) return false;
    if (filters.format === 'atmos' && !m.hasDolbyAtmos) return false;
    if (filters.format === 'deals' && !m.deal48h && m.rentPrice > 3.99) return false;

    return true;
  }).sort((a, b) => {
    if (filters.sort === 'rating-high') return b.rating - a.rating;
    if (filters.sort === 'price-low') return a.buyPrice - b.buyPrice;
    if (filters.sort === 'price-high') return b.buyPrice - a.buyPrice;
    if (filters.sort === 'newest') return b.year - a.year;
    if (filters.sort === 'title-az') return a.title.localeCompare(b.title);
    return 0; // Default popular order
  });

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Body */}
      <main className="main-content">
        {/* Cinematic Spotlight Hero Carousel */}
        <HeroCarousel />

        <div className="section-container">
          {/* Category Rail: Trending Blockbusters */}
          <CategoryRow
            id="trending"
            title="Trending Now in 4K Cinema"
            subtitle="The most watched releases and highest grossing spectacles this week"
            movies={trendingMovies}
            icon={Flame}
            badge="TOP 10"
          />

          {/* Category Rail: 4K UHD Store Premieres */}
          <CategoryRow
            id="store-4k"
            title="4K Ultra HD Digital Store"
            subtitle="Buy lifetime digital licenses with Dolby Vision HDR & Dolby Atmos master audio"
            movies={store4kMovies}
            icon={Sparkles}
            badge="4K HDR"
          />

          {/* Category Rail: Weekend Rental Deals */}
          <CategoryRow
            id="rentals"
            title="Weekend Movie Rental Deals"
            subtitle="Stream in pristine quality with 48-hour viewing passes starting at $2.99"
            movies={weekendDeals}
            icon={Tag}
            badge="48H DEALS"
          />

          {/* Category Rail: Sci-Fi & Cyberpunk */}
          <CategoryRow
            id="scifi"
            title="Sci-Fi & Cyberpunk Visions"
            subtitle="Mind-bending worlds, space exploration, and futuristic neon epics"
            movies={sciFiMovies}
            icon={Film}
          />

          {/* CinePass VIP Subscription Banner */}
          <CinePassSection />

          {/* Category Rail: High-Octane Action */}
          <CategoryRow
            id="action"
            title="High-Octane Action & Thrillers"
            subtitle="Pure adrenaline, thrilling heists, and cinematic combat"
            movies={actionMovies}
            icon={Award}
          />

          {/* Full Interactive Catalog Discovery Engine */}
          <section style={{ marginTop: '30px' }}>
            <FilterHub />

            {/* Catalog Grid / List */}
            {isLoadingMovies ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <Sparkles size={36} color="#e50914" style={{ margin: '0 auto 12px auto', animation: 'spin 2s linear infinite' }} />
                <h3>Loading 4K Cinema Catalog...</h3>
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <FilterX size={48} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>No Movies Match Your Filter</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                  Try clearing your search query or selecting "All" genres and ratings.
                </p>
              </div>
            ) : (
              <div 
                style={
                  filters.viewMode === 'compact'
                    ? { display: 'flex', flexDirection: 'column', gap: '12px' }
                    : {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '24px'
                      }
                }
              >
                {filteredCatalog.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    isCompact={filters.viewMode === 'compact'} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <MovieDetailModal />
      <PlayerModal />
      <CheckoutModal />
      <MyVaultModal />
      <TmdbConfigModal />
      <ToastContainer />
    </div>
  );
};
