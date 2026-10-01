import React from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Tv, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ShareInviteModal = () => {
  const { modals, setModals, showToast, toggleScreenShare, currentUser, currentRoom } = useWatchParty();

  if (!modals.shareInvite) return null;
  const room = modals.shareInvite || currentRoom;
  if (!room) return null;

  const inviteUrl = `${window.location.origin}/room/${room.code || room.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    showToast('Link Copied', 'Watch party link copied to clipboard!', 'success');
  };

  const handleStartSharing = () => {
    setModals(prev => ({ ...prev, shareInvite: null }));
    if (room.host?.id === currentUser.id) {
      toggleScreenShare();
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setModals(prev => ({ ...prev, shareInvite: null }))}>
      <div 
        className="modal-container"
        style={{ width: '560px', maxWidth: '95vw', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={() => setModals(prev => ({ ...prev, shareInvite: null }))}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #e50914 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Share2 size={24} color="#fff" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900 }}>
            Invite Friends to Watch
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Friends can join on any browser, laptop, tablet, or phone without installing an app
          </p>
        </div>

        {/* Room ID & Invitation Link Box */}
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Room Code:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.05em' }}>
              {room.code || room.id}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              readOnly 
              value={inviteUrl}
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
            <button 
              className="btn btn-party"
              onClick={handleCopyLink}
              style={{ padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <Copy size={15} /> Copy
            </button>
          </div>
        </div>

        {/* QR Code Simulation Block */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* SVG QR Code Pattern */}
            <svg width="68" height="68" viewBox="0 0 24 24" fill="#000">
              <path d="M2 2h8v8H2zM4 4v4h4V4H4zM2 14h8v8H2zM4 16v4h4v-4H4zM14 2h8v8h-8zM16 4v4h4V4h-4zM14 14h2v2h-2zM18 14h2v2h-2zM20 16h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2zM20 20h2v2h-2zM14 20h2v2h-2zM16 16h2v2h-2z" />
            </svg>
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Scan with Phone Camera</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>
              Friends can scan this QR code on their mobile device to instantly enter the watch room and live chat.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-party"
            onClick={handleStartSharing}
            style={{ flex: 1, padding: '12px', fontSize: '0.95rem' }}
          >
            <Tv size={16} /> Start Screen Sharing
          </button>
          <button 
            className="btn btn-glass"
            onClick={() => setModals(prev => ({ ...prev, shareInvite: null }))}
            style={{ padding: '12px 20px', fontSize: '0.95rem' }}
          >
            Enter Room
          </button>
        </div>
      </div>
    </div>
  );
};
