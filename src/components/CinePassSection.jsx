import React from 'react';
import { useStore } from '../context/StoreContext';
import { CINEPASS_TIERS } from '../data/moviesData';
import { 
  Sparkles, 
  Check, 
  Crown, 
  Tv, 
  Film, 
  Zap,
  ShieldCheck 
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const CinePassSection = () => {
  const { formatPrice, soundEnabled, showToast } = useStore();

  const handleSubscribe = (tier) => {
    playSound('purchase', soundEnabled);
    showToast('CinePass Activated', `You are now subscribed to ${tier.name}! 30% discount unlocked on all store titles.`, 'success');
  };

  return (
    <section id="cinepass" className="section-container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(20,25,36,0.9) 0%, rgba(13,16,23,0.95) 100%)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '24px',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245,158,11,0.1)'
        }}
      >
        {/* Glow ambient background circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(229,9,20,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', padding: '6px 14px', borderRadius: '20px', marginBottom: '16px' }}>
            <Crown size={16} color="#fbbf24" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.05em' }}>
              CINEPASS VIP UNLIMITED
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '14px' }}>
            One Pass. Infinite 4K Cinema.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Stream thousands of master quality 4K Ultra HD titles, receive monthly keep-forever movie tokens, and get up to 30% off all digital store purchases.
          </p>
        </div>

        {/* Tiers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', position: 'relative', zIndex: 2 }}>
          {CINEPASS_TIERS.map((tier) => (
            <div
              key={tier.id}
              style={{
                background: tier.recommended ? 'linear-gradient(180deg, rgba(28,34,50,0.95) 0%, rgba(18,22,31,0.9) 100%)' : 'rgba(255,255,255,0.03)',
                border: tier.recommended ? '2px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: tier.recommended ? '0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(245,158,11,0.15)' : 'none'
              }}
            >
              {tier.recommended && (
                <div style={{ position: 'absolute', top: '-14px', right: '28px' }}>
                  <span className="badge-4k" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    BEST VALUE CINEMA
                  </span>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{tier.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: tier.recommended ? '#fbbf24' : '#fff' }}>
                    {formatPrice(tier.price)}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/ {tier.period}</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  {tier.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#cbd5e1' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: tier.recommended ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={13} color={tier.recommended ? '#fbbf24' : '#fff'} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={tier.recommended ? 'btn btn-gold' : 'btn btn-glass'}
                onClick={() => handleSubscribe(tier)}
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {tier.recommended ? 'Join CinePass VIP Club' : 'Select Standard Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
