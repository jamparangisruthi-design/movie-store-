import React, { useState } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { 
  X, 
  Shield, 
  Activity, 
  Users, 
  Tv, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Radio,
  Server
} from 'lucide-react';

export const AdminDashboardModal = () => {
  const { modals, setModals, activeRooms, showToast } = useWatchParty();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rooms' | 'reports'

  if (!modals.admin) return null;

  const handleTerminateRoom = (roomId, roomName) => {
    showToast('Room Terminated', `Admin force-closed ${roomName}.`, 'warning');
  };

  return (
    <div className="modal-backdrop" onClick={() => setModals(prev => ({ ...prev, admin: false }))}>
      <div 
        className="modal-container"
        style={{ width: '880px', maxWidth: '95vw', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={() => setModals(prev => ({ ...prev, admin: false }))}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #e50914 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Admin & Moderation Hub</h2>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                LIVE MONITOR
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Real-time platform metrics, WebRTC SFU cluster health, active rooms, and user reports
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} color="#6366f1" /> Active Users
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginTop: '6px' }}>
              1,428
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '4px' }}>+18% from last hour</div>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tv size={14} color="#e50914" /> Live Watch Rooms
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginTop: '6px' }}>
              {activeRooms.length + 32}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#818cf8', marginTop: '4px' }}>All mesh SFUs online</div>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={14} color="#f59e0b" /> Real-time Messages
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginTop: '6px' }}>
              48,920
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>Socket.IO rate: 420 msg/s</div>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={14} color="#10b981" /> WebRTC SFU Health
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: '6px' }}>
              99.99%
            </div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '4px' }}>Latency: 18ms avg</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
          {['overview', 'rooms', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeTab === tab ? '#fff' : '#94a3b8',
                padding: '8px 14px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {tab === 'rooms' ? 'Active Rooms Monitor' : tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Server Cluster */}
        {activeTab === 'overview' && (
          <div>
            <div className="glass-panel" style={{ padding: '18px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>SFU & WebRTC Architecture Status</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ color: '#94a3b8' }}>Signaling Cluster: <span style={{ color: '#10b981', fontWeight: 700 }}>Online (Node.js + Socket.IO)</span></div>
                <div style={{ color: '#94a3b8' }}>LiveKit SFU Relay: <span style={{ color: '#10b981', fontWeight: 700 }}>Operational</span></div>
                <div style={{ color: '#94a3b8' }}>Screen Capture Transcoding: <span style={{ color: '#10b981', fontWeight: 700 }}>Browser Native Direct</span></div>
                <div style={{ color: '#94a3b8' }}>DRM Compliance Guard: <span style={{ color: '#10b981', fontWeight: 700 }}>Enforced Active</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rooms Monitor */}
        {activeTab === 'rooms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeRooms.map(room => (
              <div key={room.id} className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{room.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Host: {room.host.displayName} • Content: {room.movie?.title || "Custom Stream"} • {room.participantCount || 1} watching
                  </div>
                </div>
                <button 
                  className="btn btn-glass"
                  onClick={() => handleTerminateRoom(room.id, room.name)}
                  style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                >
                  <Trash2 size={13} /> Force Terminate
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reports */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Report #104 — Chat Spam</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Reported by Anu Patel against User_892 • Status: Resolved</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                RESOLVED
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
