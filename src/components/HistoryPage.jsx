import React from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { History, Clock, Users, Tv, Calendar } from 'lucide-react';

export const HistoryPage = () => {
  const { watchHistory, setModals } = useWatchParty();

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.2)', border: '1px solid var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History size={20} color="#fbbf24" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900 }}>
            Watch Party History
          </h1>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
          Chronological timeline of your past movie nights, streamed content, and participant squads
        </p>
      </div>

      {watchHistory.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <History size={56} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>No Watch Party History Yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Your completed watch sessions will automatically be recorded here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {watchHistory.map((item) => (
            <div 
              key={item.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '16px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <img 
                  src={item.poster} 
                  alt={item.movieTitle} 
                  style={{ width: '56px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{item.movieTitle}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginTop: '2px' }}>
                    {item.roomName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} /> {item.date}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {item.duration}</span>
                    <span>•</span>
                    <span>Provider: {item.provider}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Squad Members:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
                    {item.participants.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
