import React from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { Users, Tv, Sparkles, Shield, ArrowRight, Lock, Radio } from 'lucide-react';

export const PopularRoomsSection = () => {
  const { activeRooms, joinRoom } = useWatchParty();

  return (
    <section id="popular-rooms" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900 }}>
              Live Watch Parties
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
            Active rooms streaming right now — jump in and watch together
          </p>
        </div>
      </div>

      {/* Rooms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {activeRooms.map((room) => (
          <div 
            key={room.id}
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={room.host.avatarUrl} 
                  alt={room.host.displayName} 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{room.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Hosted by <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{room.host.displayName}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: '#f87171' }}>
                <Radio size={12} className="speaking-pulse" /> LIVE
              </div>
            </div>

            {/* Content Attachment Card */}
            {room.movie ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '10px' }}>
                <img src={room.movie.poster} alt={room.movie.title} style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {room.movie.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {room.movie.genre} • {room.movie.year}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 600, marginTop: '2px' }}>
                    Via {room.movie.provider}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Open screen share stream & group chat session
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <Users size={16} color="#6366f1" />
                <span style={{ fontWeight: 700, color: '#fff' }}>{room.participantCount || room.participants?.length || 1}</span>
                <span>/ {room.maxParticipants} watching</span>
              </div>

              <button 
                className="btn btn-party"
                onClick={() => joinRoom(room.id)}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Join Party 🍿
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
