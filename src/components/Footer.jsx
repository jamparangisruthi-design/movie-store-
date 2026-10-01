import React, { useState } from 'react';
import { Film, Sparkles, Send, ShieldCheck, Tv, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useStore();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast('Newsletter Subscribed', 'You will receive weekly 4K UHD release drops and 50% discount codes!', 'success');
    setEmail('');
  };

  return (
    <footer style={{ background: '#050608', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '60px 24px 30px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Top Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="brand-icon">
                <Film size={22} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                CINE<span className="brand-vault">VAULT</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
              The premier interactive cinema platform for 4K Ultra HD digital purchases, 48-hour rentals, and unlimited cloud movie streaming with Dolby Atmos audio.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge-4k">4K HDR</span>
              <span className="badge-dolby">DOLBY ATMOS</span>
              <span className="badge-dolby">DOLBY VISION</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Digital Cinema Store</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li><a href="#featured" style={{ color: 'inherit', textDecoration: 'none' }}>Spotlight Premieres</a></li>
              <li><a href="#trending" style={{ color: 'inherit', textDecoration: 'none' }}>Trending Blockbusters</a></li>
              <li><a href="#store-4k" style={{ color: 'inherit', textDecoration: 'none' }}>4K UHD Digital Collection</a></li>
              <li><a href="#rentals" style={{ color: 'inherit', textDecoration: 'none' }}>Weekend Rental Deals ($1.99 - $3.99)</a></li>
              <li><a href="#cinepass" style={{ color: 'inherit', textDecoration: 'none' }}>CinePass VIP Club</a></li>
            </ul>
          </div>

          {/* Technology & Partners */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Format Master Specs</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#10b981" /> 2160p 4K UHD Master Prints</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#10b981" /> Dolby Atmos 7.1.4 Object Audio</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#10b981" /> IMAX Enhanced Aspect Ratios</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#10b981" /> TMDB Live Cinema Sync API</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>VIP Cinema Club</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>
              Subscribe to get secret promo codes (up to 50% off) and new 4K remaster notifications.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 14px' }}>
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} CineVault Digital Cinema Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Digital Purchase</span>
            <span>Digital Millennium Copyright Act (DMCA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
