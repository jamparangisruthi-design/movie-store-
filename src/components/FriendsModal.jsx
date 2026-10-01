import React, { useState } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { 
  X, 
  Users, 
  UserPlus, 
  Check, 
  UserX, 
  Search, 
  Tv, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const FriendsModal = () => {
  const { modals, setModals, friends, joinRoom, showToast } = useWatchParty();
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [friendRequests, setFriendRequests] = useState([
    {
      id: "req-1",
      fromUser: {
        id: "u-kiran",
        displayName: "Kiran Rao",
        username: "kiran",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=120&auto=format&fit=crop"
      },
      sentAt: "10 mins ago"
    }
  ]);

  if (!modals.friends) return null;

  const handleAcceptRequest = (reqId, userName) => {
    setFriendRequests(prev => prev.filter(r => r.id !== reqId));
    showToast('Friend Request Accepted', `You and ${userName} are now friends!`, 'success');
  };

  const handleRejectRequest = (reqId) => {
    setFriendRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const filteredFriends = friends.filter(f => 
    !searchUserQuery.trim() || 
    f.displayName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    f.username.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={() => setModals(prev => ({ ...prev, friends: false }))}>
      <div 
        className="modal-container"
        style={{ width: '600px', maxWidth: '95vw', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={() => setModals(prev => ({ ...prev, friends: false }))}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Friends & Connections</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              See what your friends are streaming and send instant watch party invites
            </p>
          </div>
        </div>

        {/* Search users input */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search friends by name or username..."
            value={searchUserQuery}
            onChange={(e) => setSearchUserQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <div style={{ marginBottom: '24px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c7d2fe', marginBottom: '10px' }}>
              Pending Friend Requests ({friendRequests.length})
            </div>
            {friendRequests.map(req => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={req.fromUser.avatarUrl} alt={req.fromUser.displayName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{req.fromUser.displayName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>@{req.fromUser.username} • {req.sentAt}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAcceptRequest(req.id, req.fromUser.displayName)}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Accept
                  </button>
                  <button 
                    className="btn btn-glass"
                    onClick={() => handleRejectRequest(req.id)}
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Friends List */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', marginBottom: '12px' }}>
            Your Friends ({filteredFriends.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
            {filteredFriends.map(friend => {
              const isWatching = friend.status === 'WATCHING';
              const isOnline = friend.status === 'ONLINE';

              return (
                <div 
                  key={friend.id}
                  className="glass-panel"
                  style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={friend.avatarUrl} alt={friend.displayName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: isWatching ? '#e50914' : isOnline ? '#10b981' : '#64748b',
                        border: '2px solid #000'
                      }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{friend.displayName}</div>
                      <div style={{ fontSize: '0.75rem', color: isWatching ? '#fbbf24' : '#94a3b8' }}>
                        {isWatching ? `Watching ${friend.activeRoom?.movie}` : isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>

                  {isWatching && friend.activeRoom && (
                    <button 
                      className="btn btn-party"
                      onClick={() => {
                        setModals(prev => ({ ...prev, friends: false }));
                        joinRoom(friend.activeRoom.id);
                      }}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      Join Party 🍿
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
