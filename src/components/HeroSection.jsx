import React from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { SearchBar } from './SearchBar';
import { Play, Plus, Users, Sparkles, Tv, ShieldCheck, Heart } from 'lucide-react';

export const HeroSection = () => {
  const { setModals, setCurrentView, activeRooms } = useWatchParty();

  return (
    <section className="hero-container">
      {/* Background Ambient Glows */}
      <div className="hero-glow-blob-1" />
      <div className="hero-glow-blob-2" />

      {/* Pill Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        padding: '6px 16px',
        borderRadius: '30px',
        marginBottom: '24px',
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
      }}>
        <Sparkles size={16} color="#818cf8" />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c7d2fe', letterSpacing: '0.04em' }}>
          NEXT-GEN SOCIAL WATCH PARTIES
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="hero-title">
        Watch Together. <br />
        <span className="brand-gradient">Even When You're Apart.</span>
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle">
        Create a virtual watch party, invite your friends, share your screen via browser WebRTC, and experience movies together with live voice chat and real-time reactions.
      </p>

      {/* Prominent Large Search Bar */}
      <SearchBar isHero={true} />

      {/* Primary and Secondary Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className="btn btn-party"
          onClick={() => setModals(prev => ({ ...prev, createRoom: true }))}
          style={{ padding: '14px 32px', fontSize: '1.1rem', gap: '10px' }}
        >
          <Tv size={20} />
          <span>Create Watch Party</span>
        </button>

        <button
          className="btn btn-glass"
          onClick={() => {
            const firstPublicRoom = activeRooms.find(r => r.privacy === 'PUBLIC');
            if (firstPublicRoom) {
              window.location.hash = `#popular-rooms`;
            }
          }}
          style={{ padding: '14px 28px', fontSize: '1.05rem', gap: '10px' }}
        >
          <Users size={18} />
          <span>Browse Public Rooms</span>
        </button>
      </div>

      {/* Trust & Streaming Compliance Ticker */}
      <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '24px', color: '#64748b', fontSize: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>Legitimate User Screen-Sharing Architecture</span>
        </div>
        <div>•</div>
        <div>Zero DRM Bypass</div>
        <div>•</div>
        <div>Ultra Low-Latency WebRTC Voice & Chat</div>
      </div>
    </section>
  );
};
