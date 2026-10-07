import React, { useState } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { 
  Tv, 
  Search, 
  Bell, 
  Bookmark, 
  Users, 
  History, 
  Plus, 
  Shield, 
  Sparkles,
  Compass,
  Film,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentView, 
    setCurrentView, 
    notifications, 
    friends, 
    watchlist, 
    currentUser, 
    setModals,
    joinRoom
  } = useWatchParty();

  const [showNotifications, setShowNotifications] = useState(false);

  const pendingFriendCount = 1;
  const activeRoomsCount = friends.filter(f => f.status === 'WATCHING').length;

  return (
    <header className="navbar">
      <div className="nav-wrapper">
        {/* Brand */}
        <div 
          className="nav-brand"
          onClick={() => setCurrentView('home')}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #e50914 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(229, 9, 20, 0.4)'
          }}>
            <Tv size={20} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 900 }}>Watch<span className="brand-gradient">Together</span></span>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.02em', marginTop: '-3px' }}>
              One Screen. Many Friends. One Experience.
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="nav-links">
          <span 
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            Home
          </span>
          <span 
            className={`nav-link ${currentView === 'search' ? 'active' : ''}`}
            onClick={() => setCurrentView('search')}
          >
            Discover
          </span>
          <span 
            className={`nav-link ${currentView === 'news' ? 'active' : ''}`}
            onClick={() => setCurrentView('news')}
            style={{ color: currentView === 'news' ? '#ffd734' : 'inherit' }}
          >
            News &amp; Events
          </span>
          <span 
            className={`nav-link ${currentView === 'watchlist' ? 'active' : ''}`}
            onClick={() => setCurrentView('watchlist')}
          >
            Watchlist ({watchlist.length})
          </span>
          <span 
            className="nav-link"
            onClick={() => setModals(prev => ({ ...prev, friends: true }))}
          >
            Friends
            {activeRoomsCount > 0 && (
              <span style={{ marginLeft: '4px', background: '#10b981', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px' }}>
                {activeRoomsCount} live
              </span>
            )}
          </span>
          <span 
            className={`nav-link ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            History
          </span>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Admin Dashboard */}
          <button
            className="btn-icon"
            onClick={() => setModals(prev => ({ ...prev, admin: true }))}
            title="Admin Dashboard & Metrics"
          >
            <Shield size={18} color="#94a3b8" />
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-icon"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={18} color="#94a3b8" />
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', borderRadius: '50%', background: '#e50914' }} />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '320px',
                  padding: '16px',
                  zIndex: 200,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.9)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Notifications</span>
                  <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{n.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{n.message}</div>
                      {n.actionRoomId && (
                        <button 
                          className="btn btn-party"
                          onClick={() => { joinRoom(n.actionRoomId); setShowNotifications(false); }}
                          style={{ padding: '4px 10px', fontSize: '0.75rem', marginTop: '6px' }}
                        >
                          Join Party 🍿
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px 4px 4px', borderRadius: '30px' }}>
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.displayName}
              style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.displayName.split(' ')[0]}</span>
          </div>

          {/* Primary CTA: Create Watch Party */}
          <button 
            className="btn btn-party"
            onClick={() => setModals(prev => ({ ...prev, createRoom: true }))}
            style={{ padding: '8px 18px', fontSize: '0.9rem' }}
          >
            <Plus size={16} />
            <span>Create Room</span>
          </button>
        </div>
      </div>
    </header>
  );
};
