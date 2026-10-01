import React from 'react';
import { useWatchParty } from './context/WatchPartyContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrendingSection } from './components/TrendingSection';
import { PopularRoomsSection } from './components/PopularRoomsSection';
import { FriendsWatchingSection } from './components/FriendsWatchingSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SearchResultsPage } from './components/SearchResultsPage';
import { WatchlistPage } from './components/WatchlistPage';
import { HistoryPage } from './components/HistoryPage';
import { WatchRoom } from './components/WatchRoom';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { ShareInviteModal } from './components/ShareInviteModal';
import { FriendsModal } from './components/FriendsModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

export const App = () => {
  const { currentView } = useWatchParty();

  // If inside active watch room, render dedicated watch room view
  if (currentView === 'room') {
    return (
      <>
        <WatchRoom />
        <ShareInviteModal />
        <ToastContainer />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <>
            <HeroSection />
            <TrendingSection />
            <PopularRoomsSection />
            <FriendsWatchingSection />
            <HowItWorksSection />
          </>
        )}

        {currentView === 'search' && <SearchResultsPage />}
        {currentView === 'watchlist' && <WatchlistPage />}
        {currentView === 'history' && <HistoryPage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <MovieDetailsModal />
      <CreateRoomModal />
      <ShareInviteModal />
      <FriendsModal />
      <AdminDashboardModal />
      <ToastContainer />
    </div>
  );
};
