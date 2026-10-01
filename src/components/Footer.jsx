import React from 'react';
import { Tv, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useWatchParty } from '../context/WatchPartyContext';

export const Footer = () => {
  const { setCurrentView, setModals } = useWatchParty();

  return (
    <footer style={{ background: '#050608', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '60px 24px 30px 24px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #e50914, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tv size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>
                Watch<span className="brand-gradient">Together</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
              One Screen. Many Friends. One Experience. The modern real-time social platform to watch movies and shows with friends anywhere in the world.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10b981' }}>
              <ShieldCheck size={16} />
              <span>Legitimate Screen Capture & WebRTC Technology</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Platform Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li><span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('home')}>Home Overview</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('search')}>Discover Catalog</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('watchlist')}>Personal Watchlist</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('history')}>Watch Party History</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => setModals(prev => ({ ...prev, friends: true }))}>Friends & Active Rooms</span></li>
            </ul>
          </div>

          {/* Legal & Compliance Statement */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Streaming & Legal Policy</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '12px' }}>
              WatchTogether is NOT a video hosting or piracy platform. We do not download, retransmit, or scrape protected video streams. Media synchronization is conducted strictly through user-authorized browser screen sharing and legitimate API metadata.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Compliant with DMCA & Digital Media Sharing Guidelines.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} WatchTogether Technologies Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
