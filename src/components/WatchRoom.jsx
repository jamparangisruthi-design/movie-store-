import React, { useState, useEffect, useRef } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { 
  Tv, 
  Users, 
  Share2, 
  Settings, 
  LogOut, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Trash2, 
  Lock, 
  Unlock, 
  HelpCircle, 
  Sparkles, 
  Flame, 
  Heart, 
  Play, 
  StopCircle, 
  UserMinus, 
  Volume1, 
  Crown,
  Moon,
  MessageSquare,
  BarChart2,
  Smile
} from 'lucide-react';

export const WatchRoom = () => {
  const { 
    currentRoom, 
    currentUser, 
    leaveRoom, 
    chatMessages, 
    sendChatMessage, 
    deleteChatMessage, 
    sendTypingIndicator, 
    typingUsers, 
    floatingReactions, 
    sendReaction, 
    screenStream, 
    isScreenSharing, 
    toggleScreenShare, 
    voiceState, 
    toggleMicrophone, 
    toggleDeafen, 
    setModals, 
    activePoll, 
    createPoll, 
    votePoll, 
    activeTrivia, 
    startTrivia, 
    answerTrivia, 
    kickUser, 
    muteUser, 
    lockRoom 
  } = useWatchParty();

  const [activeSidebarTab, setActiveSidebarTab] = useState('chat'); // 'chat' | 'participants' | 'games'
  const [messageInput, setMessageInput] = useState('');
  const [theaterDim, setTheaterDim] = useState(0.9);
  const [showSettings, setShowSettings] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOpts, setNewPollOpts] = useState(['Avengers: Endgame', 'Dune: Part Two', 'Stranger Things']);

  const videoRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Attach live screen media stream to HTML5 video element
  useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!currentRoom) return null;

  const isHost = currentRoom.host?.id === currentUser.id;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendChatMessage(messageInput);
    setMessageInput('');
    sendTypingIndicator(false);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    sendTypingIndicator(e.target.value.trim().length > 0);
  };

  const handleCreateNewPoll = (e) => {
    e.preventDefault();
    if (!newPollQuestion.trim()) return;
    createPoll(newPollQuestion, newPollOpts);
    setNewPollQuestion('');
  };

  const REACTION_EMOJIS = ['❤️', '😂', '😱', '🔥', '👏', '🍿', '😍'];

  return (
    <div className="watch-room-container">
      {/* 1. TOP ROOM HEADER */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '68px',
          background: 'rgba(10, 12, 18, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}
      >
        {/* Left: Brand & Room Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #e50914 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tv size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.15rem' }}>Watch<span className="brand-gradient">Together</span></span>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{currentRoom.name}</h2>
              {currentRoom.movie && (
                <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#c7d2fe', padding: '1px 8px', borderRadius: '12px' }}>
                  🎬 {currentRoom.movie.title}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Participant count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
            <Users size={15} color="#10b981" />
            <span style={{ fontWeight: 800 }}>{currentRoom.participants?.length || 1}</span>
            <span style={{ color: '#94a3b8' }}>/ {currentRoom.maxParticipants}</span>
          </div>

          {/* Invite Button */}
          <button 
            className="btn btn-party"
            onClick={() => setModals(prev => ({ ...prev, shareInvite: currentRoom }))}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            <Share2 size={14} />
            <span>Invite</span>
          </button>

          {/* Host Lock Toggle */}
          {isHost && (
            <button
              className="btn-icon"
              onClick={() => lockRoom(!currentRoom.isLocked)}
              title={currentRoom.isLocked ? "Unlock Room" : "Lock Room"}
            >
              {currentRoom.isLocked ? <Lock size={16} color="#ef4444" /> : <Unlock size={16} color="#94a3b8" />}
            </button>
          )}

          {/* Leave Button */}
          <button
            className="btn btn-glass"
            onClick={leaveRoom}
            style={{ padding: '6px 14px', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <LogOut size={14} />
            <span>{isHost ? 'End Party' : 'Leave'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CENTER AREA: SCREEN + SIDEBAR */}
      <div className="watch-room-main">
        {/* Left Area: Shared Screen Video Port */}
        <div className="watch-room-screen-area" style={{ background: `rgba(0, 0, 0, ${theaterDim})` }}>
          {/* Live Floating Reactions Layer */}
          <div className="floating-reactions-container">
            {floatingReactions.map(rx => (
              <div 
                key={rx.id} 
                className="floating-reaction"
                style={{ left: `${rx.x}%` }}
              >
                {rx.emoji}
              </div>
            ))}
          </div>

          {/* Voice Chat Active Avatars Overlay Bar */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 30,
            display: 'flex',
            gap: '10px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(10px)',
            padding: '6px 12px',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {currentRoom.participants?.map(p => (
              <div key={p.id} style={{ position: 'relative' }} title={`${p.displayName} ${p.isSpeaking ? '(Speaking)' : ''}`}>
                <img 
                  src={p.avatarUrl} 
                  alt={p.displayName}
                  className={`speaking-avatar ${p.isSpeaking ? 'speaking' : ''}`}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                {p.isMuted && (
                  <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#ef4444', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                    <MicOff size={8} color="#fff" />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Screen Content */}
          {screenStream || isScreenSharing ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : currentRoom.movie ? (
            /* Fallback Movie Cinematic Presentation */
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={currentRoom.movie.poster} 
                alt={currentRoom.movie.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px) brightness(0.3)' }}
              />
              <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '32px', maxWidth: '540px' }}>
                <img 
                  src={currentRoom.movie.poster} 
                  alt={currentRoom.movie.title}
                  style={{ width: '140px', height: '210px', objectFit: 'cover', borderRadius: '12px', margin: '0 auto 16px auto', boxShadow: '0 16px 48px rgba(0,0,0,0.9)' }}
                />
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>{currentRoom.movie.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px', marginBottom: '20px' }}>
                  {isHost ? "You are the host. Click below to start broadcasting your browser screen." : "Waiting for the host to start screen sharing..."}
                </p>

                {isHost && (
                  <button 
                    className="btn btn-party"
                    onClick={toggleScreenShare}
                    style={{ padding: '12px 28px', fontSize: '1.05rem', gap: '8px' }}
                  >
                    <Tv size={18} />
                    <span>Start Screen Sharing</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
              <Tv size={64} color="#6366f1" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>Ready to Stream Together</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
                {isHost ? "Select your browser tab, window, or display to start sharing in real time." : "Waiting for host to share screen..."}
              </p>
              {isHost && (
                <button className="btn btn-party" onClick={toggleScreenShare}>
                  <Tv size={16} /> Share Screen
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Live Chat, Participants, Voting */}
        <div className="watch-room-sidebar">
          {/* Sidebar Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
            <button
              onClick={() => setActiveSidebarTab('chat')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: activeSidebarTab === 'chat' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeSidebarTab === 'chat' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={14} /> Chat
            </button>

            <button
              onClick={() => setActiveSidebarTab('participants')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: activeSidebarTab === 'participants' ? '2px solid var(--accent-emerald)' : '2px solid transparent',
                color: activeSidebarTab === 'participants' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Users size={14} /> People ({currentRoom.participants?.length || 1})
            </button>

            <button
              onClick={() => setActiveSidebarTab('games')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: activeSidebarTab === 'games' ? '2px solid var(--accent-amber)' : '2px solid transparent',
                color: activeSidebarTab === 'games' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <BarChart2 size={14} /> Games & Polls
            </button>
          </div>

          {/* TAB 1: LIVE CHAT */}
          {activeSidebarTab === 'chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Messages Scroll Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chatMessages.map((msg) => {
                  const isMe = msg.userId === currentUser.id;
                  const isSys = msg.type === 'SYSTEM';

                  if (isSys) {
                    return (
                      <div key={msg.id} style={{ textAlign: 'center', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', color: '#c7d2fe' }}>
                        {msg.text}
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <img 
                        src={msg.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop"} 
                        alt={msg.userName} 
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isMe ? '#818cf8' : '#fff' }}>
                            {msg.userName}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{msg.time}</span>
                          {isHost && (
                            <button 
                              onClick={() => deleteChatMessage(msg.id)}
                              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '1px' }}
                              title="Delete message"
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                        <div style={{ background: isMe ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', wordBreak: 'break-word' }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div style={{ padding: '4px 16px', fontSize: '0.75rem', color: '#818cf8', fontStyle: 'italic' }}>
                  {typingUsers.map(u => u.displayName).join(', ')} is typing...
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)' }}>
                <input
                  type="text"
                  placeholder="Send a live message..."
                  value={messageInput}
                  onChange={handleInputChange}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-party" style={{ padding: '8px 14px' }}>
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: PARTICIPANTS */}
          {activeSidebarTab === 'participants' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                Room Members ({currentRoom.participants?.length || 1})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentRoom.participants?.map(p => (
                  <div key={p.id} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={p.avatarUrl} alt={p.displayName} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {p.displayName}
                          {p.role === 'HOST' && <Crown size={12} color="#fbbf24" />}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: p.isSpeaking ? '#10b981' : '#64748b' }}>
                          {p.isSpeaking ? 'Speaking 🎙️' : p.isMuted ? 'Muted' : 'Listening'}
                        </div>
                      </div>
                    </div>

                    {isHost && p.id !== currentUser.id && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-glass"
                          onClick={() => muteUser(p.id)}
                          style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                          title="Mute user"
                        >
                          Mute
                        </button>
                        <button 
                          className="btn btn-glass"
                          onClick={() => kickUser(p.id)}
                          style={{ padding: '4px 8px', fontSize: '0.7rem', color: '#ef4444' }}
                          title="Remove user"
                        >
                          <UserMinus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GAMES & MOVIE VOTING */}
          {activeSidebarTab === 'games' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {/* Poll: What should we watch? */}
              <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart2 size={16} /> What Should We Watch? 🍿
                </h4>

                {activePoll ? (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginBottom: '12px' }}>
                      {activePoll.question}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {activePoll.options.map(opt => {
                        const totalVotes = activePoll.options.reduce((sum, o) => sum + (o.votes || 0), 0) || 1;
                        const pct = Math.round(((opt.votes || 0) / totalVotes) * 100);
                        const hasVoted = opt.votedUsers?.includes(currentUser.id);

                        return (
                          <div 
                            key={opt.id}
                            onClick={() => votePoll(activePoll.id, opt.id)}
                            style={{
                              position: 'relative',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: hasVoted ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)',
                              border: hasVoted ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                              cursor: 'pointer',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Progress bar background */}
                            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: 'rgba(99,102,241,0.2)', pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{opt.text}</span>
                              <span style={{ color: '#818cf8', fontWeight: 800 }}>{opt.votes || 0} votes ({pct}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                      No active poll in this room. Host can start a movie vote now!
                    </p>
                    {isHost && (
                      <button 
                        className="btn btn-party" 
                        onClick={() => createPoll("What should we watch next? 🍿", ["Avengers: Endgame", "Dune: Part Two", "Spider-Man"])}
                        style={{ width: '100%', padding: '8px' }}
                      >
                        Start Group Movie Vote
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Movie Trivia Game */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} /> Cinema Trivia Challenge 🎬
                </h4>

                {activeTrivia ? (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginBottom: '12px' }}>
                      {activeTrivia.question}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeTrivia.options.map((opt, idx) => {
                        const myAnswer = activeTrivia.answers?.[currentUser.id];
                        const isChosen = myAnswer?.selectedOption === idx;

                        return (
                          <button
                            key={idx}
                            onClick={() => answerTrivia(idx)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: isChosen ? (idx === activeTrivia.correctAnswer ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)') : 'rgba(255,255,255,0.06)',
                              border: isChosen ? (idx === activeTrivia.correctAnswer ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid rgba(255,255,255,0.1)',
                              color: '#fff',
                              fontSize: '0.8rem',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                      Challenge friends with movie trivia while waiting for the party to start.
                    </p>
                    <button className="btn btn-glass" onClick={startTrivia} style={{ width: '100%', padding: '8px' }}>
                      Launch Next Trivia Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM CONTROL BAR */}
      <div className="watch-room-controls-bar">
        {/* Left: Audio & Screen Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mic */}
          <button
            className={`btn-icon ${voiceState.isMicOn ? 'active' : ''}`}
            onClick={toggleMicrophone}
            style={{
              background: voiceState.isMicOn ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.08)',
              color: voiceState.isMicOn ? '#000' : '#fff'
            }}
            title={voiceState.isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {voiceState.isMicOn ? <Mic size={18} /> : <MicOff size={18} color="#ef4444" />}
          </button>

          {/* Deafen */}
          <button
            className="btn-icon"
            onClick={toggleDeafen}
            title={voiceState.isDeafened ? "Undeafen Audio" : "Deafen Audio"}
          >
            {voiceState.isDeafened ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} />}
          </button>

          {/* Screen Share for Host */}
          {isHost && (
            <button
              className={isScreenSharing ? "btn btn-glass" : "btn btn-party"}
              onClick={toggleScreenShare}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {isScreenSharing ? (
                <>
                  <StopCircle size={16} color="#ef4444" />
                  <span>Stop Sharing</span>
                </>
              ) : (
                <>
                  <Tv size={16} />
                  <span>Share Screen</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Center: Live Floating Reaction Quick Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {REACTION_EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => sendReaction(emoji)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.3rem',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                padding: '2px 4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Right: Theater Dimmer & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '20px' }}>
            <Moon size={14} color="#94a3b8" />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dim:</span>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={theaterDim}
              onChange={(e) => setTheaterDim(parseFloat(e.target.value))}
              style={{ width: '60px', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>

          <button 
            className="btn-icon"
            onClick={() => setModals(prev => ({ ...prev, shareInvite: currentRoom }))}
            title="Invite link"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
