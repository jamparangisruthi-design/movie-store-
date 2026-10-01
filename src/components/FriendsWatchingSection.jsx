import React from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { Users, Tv, Sparkles, Play, UserCheck } from 'lucide-react';

export const FriendsWatchingSection = () => {
  const { friends, joinRoom, setModals } = useWatchParty();

  const watchingFriends = friends.filter(f => f.status === 'WATCHING' && f.activeRoom);

  if (watchingFriends.length === 0) return null;

  return (
    <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 60px 24px' }}>
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(18, 22, 32, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '20px',
          padding: '24px 32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Friends Watching Now</h3>
          </div>
          <button 
            className="btn btn-glass"
            onClick={() => setModals(prev => ({ ...prev, friends: true }))}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <UserCheck size={14} /> View All Friends ({friends.length})
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {watchingFriends.map((friend) => (
            <div 
              key={friend.id}
              className="glass-panel"
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={friend.avatarUrl} 
                    alt={friend.displayName}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #000' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{friend.displayName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Watching <span style={{ color: '#fbbf24', fontWeight: 600 }}>{friend.activeRoom?.movie}</span>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-party"
                onClick={() => joinRoom(friend.activeRoom?.id)}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                Join Party 🍿
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
