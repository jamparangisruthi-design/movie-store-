import React, { useState, useEffect } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { 
  X, 
  Tv, 
  Users, 
  Lock, 
  Globe, 
  UserCheck, 
  Mic, 
  MessageSquare, 
  Heart, 
  Film, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CreateRoomModal = () => {
  const { modals, setModals, createRoom, movies, currentUser } = useWatchParty();

  const [roomName, setRoomName] = useState('');
  const [privacy, setPrivacy] = useState('PUBLIC'); // 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
  const [maxParticipants, setMaxParticipants] = useState(25);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [reactionsEnabled, setReactionsEnabled] = useState(true);
  const [allowGuestsToSpeak, setAllowGuestsToSpeak] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState('');

  useEffect(() => {
    if (modals.selectedContentForParty) {
      setSelectedMovieId(modals.selectedContentForParty.id);
      setRoomName(`${modals.selectedContentForParty.title} Party 🍿`);
    } else {
      setRoomName(`${currentUser.displayName}'s Movie Night 🍿`);
    }
  }, [modals.selectedContentForParty, currentUser]);

  if (!modals.createRoom) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const movie = movies.find(m => m.id === selectedMovieId) || null;
    createRoom({
      name: roomName.trim() || `${currentUser.displayName}'s Watch Party 🍿`,
      privacy,
      maxParticipants,
      voiceEnabled,
      chatEnabled,
      reactionsEnabled,
      allowGuestsToSpeak,
      movie
    });
  };

  return (
    <div className="modal-backdrop" onClick={() => setModals(prev => ({ ...prev, createRoom: false }))}>
      <div 
        className="modal-container"
        style={{ width: '640px', maxWidth: '95vw', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={() => setModals(prev => ({ ...prev, createRoom: false }))}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #e50914 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(229, 9, 20, 0.4)' }}>
            <Tv size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900 }}>
              Create Your Watch Party
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Set up your virtual room and invite friends to stream together
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Room Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Room Name
            </label>
            <input
              type="text"
              placeholder="e.g. Friday Movie Night 🍿"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* Content To Watch */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Content / Movie to Watch (Optional)
            </label>
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ background: '#0e1118' }}>No specific movie (Custom Screen Share)</option>
              {movies.map(m => (
                <option key={m.id} value={m.id} style={{ background: '#0e1118' }}>
                  {m.title} ({m.year}) — {m.genres.slice(0, 2).join(', ')}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px' }}>
              Room Privacy
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { id: 'PUBLIC', label: 'Public', desc: 'Listed on explore', icon: Globe },
                { id: 'FRIENDS_ONLY', label: 'Friends Only', desc: 'Only friends can join', icon: UserCheck },
                { id: 'PRIVATE', label: 'Private', desc: 'Invite link only', icon: Lock }
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = privacy === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPrivacy(p.id)}
                    style={{
                      background: isSelected ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={18} color={isSelected ? '#818cf8' : '#94a3b8'} style={{ margin: '0 auto 6px auto' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#fff' : '#cbd5e1' }}>{p.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{p.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Max Participants */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Maximum Participants: <span style={{ color: '#818cf8' }}>{maxParticipants} users</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[10, 25, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxParticipants(num)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    background: maxParticipants === num ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: maxParticipants === num ? '#fff' : '#cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div style={{ marginBottom: '28px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#cbd5e1' }}>Room Features</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)} style={{ accentColor: '#6366f1' }} />
                <span>🎙️ Live Voice Chat</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" checked={chatEnabled} onChange={(e) => setChatEnabled(e.target.checked)} style={{ accentColor: '#6366f1' }} />
                <span>💬 Live Text Chat</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" checked={reactionsEnabled} onChange={(e) => setReactionsEnabled(e.target.checked)} style={{ accentColor: '#6366f1' }} />
                <span>❤️ Floating Reactions</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" checked={allowGuestsToSpeak} onChange={(e) => setAllowGuestsToSpeak(e.target.checked)} style={{ accentColor: '#6366f1' }} />
                <span>🗣️ Allow Guests to Speak</span>
              </label>
            </div>
          </div>

          {/* Create Button */}
          <button
            type="submit"
            className="btn btn-party"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', gap: '8px' }}
          >
            <span>CREATE WATCH PARTY</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
