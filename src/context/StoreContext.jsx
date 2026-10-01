import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURATED_MOVIES, CURRENCIES } from '../data/moviesData';
import { fetchTmdbTrending, getStoredTmdbKey, setStoredTmdbKey } from '../services/tmdbApi';
import { playSound } from '../utils/sound';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

export const StoreProvider = ({ children }) => {
  // Movies & Hero
  const [movies, setMovies] = useState(CURATED_MOVIES);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);

  // Cart & Orders
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cinevault_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Digital Vault
  const [library, setLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem('cinevault_library');
      return saved ? JSON.parse(saved) : [
        {
          movieId: "mv-dune-2",
          movie: CURATED_MOVIES[0],
          type: "buy",
          purchasedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          orderId: "CV-892147",
          licenseKey: "4K-UHD-DUNE2-X981-ATMOS"
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeRentals, setActiveRentals] = useState(() => {
    try {
      const saved = localStorage.getItem('cinevault_rentals');
      return saved ? JSON.parse(saved) : [
        {
          movieId: "mv-batman",
          movie: CURATED_MOVIES[4],
          rentedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
          expiresAt: new Date(Date.now() + 3600000 * 34).toISOString(),
          orderId: "CV-771420",
          licenseKey: "RENT-48H-BTM-7714"
        }
      ];
    } catch {
      return [];
    }
  });

  // Watchlist
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cinevault_watchlist');
      return saved ? JSON.parse(saved) : ["mv-oppenheimer", "mv-blade-runner-2049", "mv-cyberpunk-edgerunners"];
    } catch {
      return [];
    }
  });

  // Preferences & Config
  const [currency, setCurrency] = useState('USD');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tmdbKey, setTmdbKeyState] = useState(getStoredTmdbKey());
  const [isLiveTmdb, setIsLiveTmdb] = useState(Boolean(getStoredTmdbKey()));

  // Active Modals: { type: null | 'detail' | 'player' | 'checkout' | 'vault' | 'tmdbConfig' | 'receipt', data: any }
  const [activeModal, setActiveModal] = useState({ type: null, data: null });

  // Notifications / Toasts
  const [toasts, setToasts] = useState([]);

  // Search and Filters
  const [filters, setFilters] = useState({
    search: '',
    genre: 'All',
    minRating: 0,
    year: 'All',
    sort: 'popular',
    format: 'all',
    viewMode: 'grid' // 'grid' | 'compact'
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('cinevault_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cinevault_library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('cinevault_rentals', JSON.stringify(activeRentals));
  }, [activeRentals]);

  useEffect(() => {
    localStorage.setItem('cinevault_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Load Movies (Curated or TMDB)
  const refreshMovies = async (key = tmdbKey) => {
    setIsLoadingMovies(true);
    try {
      const fetched = await fetchTmdbTrending(key);
      if (fetched && fetched.length > 0) {
        setMovies(fetched);
      } else {
        setMovies(CURATED_MOVIES);
      }
    } catch (err) {
      console.warn("Failed loading trending movies, fallback to curated:", err);
      setMovies(CURATED_MOVIES);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  useEffect(() => {
    if (isLiveTmdb && tmdbKey) {
      refreshMovies(tmdbKey);
    } else {
      setMovies(CURATED_MOVIES);
    }
  }, [isLiveTmdb, tmdbKey]);

  // Toast Dispatcher
  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Currency Converter Formatter
  const formatPrice = (usdAmount) => {
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = usdAmount * curr.rate;
    if (currency === 'INR' || currency === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  // Cart Management
  const addToCart = (movie, type = 'buy') => {
    playSound('click', soundEnabled);
    const existingIndex = cart.findIndex(item => item.movie.id === movie.id && item.type === type);
    if (existingIndex > -1) {
      showToast('Already in Cart', `${movie.title} (${type.toUpperCase()}) is already in your shopping cart.`, 'warning');
      return;
    }
    const price = type === 'buy' ? movie.buyPrice : movie.rentPrice;
    const newItem = {
      cartId: `${movie.id}-${type}-${Date.now()}`,
      movie,
      type, // 'buy' or 'rent'
      price
    };
    setCart(prev => [...prev, newItem]);
    showToast('Added to Cart', `${movie.title} [${type === 'buy' ? '4K UHD Digital' : '48h Rental'}] added!`, 'success');
  };

  const removeFromCart = (cartId) => {
    playSound('click', soundEnabled);
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Watchlist Management
  const toggleWatchlist = (movie) => {
    playSound('click', soundEnabled);
    const exists = watchlist.includes(movie.id);
    if (exists) {
      setWatchlist(prev => prev.filter(id => id !== movie.id));
      showToast('Removed from Watchlist', `${movie.title} removed from your watchlist.`, 'info');
    } else {
      setWatchlist(prev => [...prev, movie.id]);
      showToast('Added to Watchlist', `${movie.title} saved to your watchlist!`, 'success');
    }
  };

  const isInWatchlist = (movieId) => watchlist.includes(movieId);

  // Check if movie is already owned
  const isMovieOwned = (movieId) => library.some(item => item.movieId === movieId || item.movie?.id === movieId);
  
  // Check if movie is currently rented and active
  const getActiveRental = (movieId) => {
    const rental = activeRentals.find(item => item.movieId === movieId || item.movie?.id === movieId);
    if (!rental) return null;
    const isExpired = new Date(rental.expiresAt).getTime() < Date.now();
    return isExpired ? null : rental;
  };

  // Complete Checkout Flow
  const completePurchase = (itemsToBuy, discount = 0, paymentMethod = 'Card') => {
    playSound('purchase', soundEnabled);
    const now = new Date();
    const orderId = `CV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPurchases = [];
    const newRentals = [];

    itemsToBuy.forEach(item => {
      const license = `${item.type === 'buy' ? '4K-UHD' : 'RENT-48H'}-${item.movie.title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      if (item.type === 'buy') {
        newPurchases.push({
          movieId: item.movie.id,
          movie: item.movie,
          type: 'buy',
          purchasedAt: now.toISOString(),
          orderId,
          licenseKey: license,
          paidAmount: item.price * (1 - discount)
        });
      } else {
        newRentals.push({
          movieId: item.movie.id,
          movie: item.movie,
          rentedAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + 48 * 3600000).toISOString(),
          orderId,
          licenseKey: license,
          paidAmount: item.price * (1 - discount)
        });
      }
    });

    if (newPurchases.length > 0) {
      setLibrary(prev => [...prev, ...newPurchases]);
    }
    if (newRentals.length > 0) {
      setActiveRentals(prev => [...prev, ...newRentals]);
    }

    // Remove purchased items from cart
    const purchasedCartIds = itemsToBuy.map(i => i.cartId);
    setCart(prev => prev.filter(i => !purchasedCartIds.includes(i.cartId)));

    const receiptData = {
      orderId,
      date: now.toLocaleString(),
      paymentMethod,
      items: itemsToBuy,
      discount,
      totalPaid: itemsToBuy.reduce((sum, item) => sum + item.price * (1 - discount), 0)
    };

    return receiptData;
  };

  // Add User Review
  const addReview = (movieId, reviewData) => {
    setMovies(prev => prev.map(m => {
      if (m.id === movieId) {
        const newReview = {
          id: Date.now(),
          user: reviewData.user || 'CinemaFan',
          avatar: reviewData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
          rating: reviewData.rating || 5,
          date: 'Just now',
          text: reviewData.text,
          likes: 0
        };
        return {
          ...m,
          reviews: [newReview, ...(m.reviews || [])]
        };
      }
      return m;
    }));
    showToast('Review Published', 'Your cinema review was added successfully!', 'success');
  };

  // Modal Open / Close
  const openModal = (type, data = null) => {
    playSound('modal-open', soundEnabled);
    setActiveModal({ type, data });
  };

  const closeModal = () => {
    playSound('click', soundEnabled);
    setActiveModal({ type: null, data: null });
  };

  // TMDB Key Config
  const updateTmdbKey = (key) => {
    setStoredTmdbKey(key);
    setTmdbKeyState(key);
    setIsLiveTmdb(Boolean(key));
    refreshMovies(key);
  };

  const value = {
    movies,
    setMovies,
    activeHeroIndex,
    setActiveHeroIndex,
    isLoadingMovies,
    refreshMovies,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    library,
    activeRentals,
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    isMovieOwned,
    getActiveRental,
    currency,
    setCurrency,
    formatPrice,
    soundEnabled,
    setSoundEnabled,
    tmdbKey,
    updateTmdbKey,
    isLiveTmdb,
    setIsLiveTmdb,
    filters,
    setFilters,
    activeModal,
    openModal,
    closeModal,
    completePurchase,
    addReview,
    toasts,
    showToast,
    removeToast
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
