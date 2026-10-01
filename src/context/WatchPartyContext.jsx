import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '../services/socket';
import { webrtcService } from '../services/webrtc';
import { playSoundEffect } from '../services/sound';
import { INITIAL_MOVIES, INITIAL_ROOMS, INITIAL_FRIENDS } from '../../server/data/initialData.js';

const WatchPartyContext = createContext();

export const useWatchParty = () => {
  const context = useContext(WatchPartyContext);
  if (!context) throw new Error('useWatchParty must be used within WatchPartyProvider');
  return context;
};

export const WatchPartyProvider = ({ children }) => {
  // Current User
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_user');
      return saved ? JSON.parse(saved) : {
        id: `u-${Math.floor(1000 + Math.random() * 9000)}`,
        displayName: "Rahul Sharma",
        username: "rahul",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
        role: "USER"
      };
    } catch {
      return { id: "u-101", displayName: "Rahul Sharma", username: "rahul", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop", role: "USER" };
    }
  });

  // Navigation View State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'search' | 'room' | 'watchlist' | 'history' | 'friends' | 'admin'

  // Data Collections
  const [movies, setMovies] = useState(INITIAL_MOVIES);
  const [activeRooms, setActiveRooms] = useState(INITIAL_ROOMS);
  const [friends, setFriends] = useState(INITIAL_FRIENDS);

  // Active Room & Real-time State
  const [currentRoom, setCurrentRoom] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [activeTrivia, setActiveTrivia] = useState(null);

  // Voice State
  const [voiceState, setVoiceState] = useState({
    isMicOn: false,
    isDeafened: false,
    isSpeaking: false
  });

  // Watchlist & History Persistence
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_watchlist');
      return saved ? JSON.parse(saved) : ["mv-avengers-endgame", "mv-dune-2", "mv-stranger-things"];
    } catch {
      return [];
    }
  });

  const [watchHistory, setWatchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_history');
      return saved ? JSON.parse(saved) : [
        {
          id: "hist-1",
          roomName: "Friday Movie Night 🍿",
          movieTitle: "Avengers: Endgame",
          poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
          provider: "Disney+",
          date: "Yesterday",
          duration: "3h 01m",
          participants: ["Rahul", "Anu", "Sruthi", "Ravi"]
        },
        {
          id: "hist-2",
          roomName: "Interstellar 10th Anniversary",
          movieTitle: "Interstellar",
          poster: "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?q=80&w=800&auto=format&fit=crop",
          provider: "Prime Video",
          date: "3 days ago",
          duration: "2h 49m",
          participants: ["Rahul", "Elena", "Alex"]
        }
      ];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Watch Party Invite", message: "Rahul invited you to Friday Movie Night 🍿", time: "5m ago", actionRoomId: "room-friday-night" },
    { id: "n2", title: "Friend Request", message: "Kiran sent you a friend request.", time: "1h ago" }
  ]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterTab, setSearchFilterTab] = useState('all'); // 'all' | 'movies' | 'shows' | 'videos' | 'parties'

  // Modals
  const [modals, setModals] = useState({
    createRoom: false,
    movieDetails: null, // Movie object
    shareInvite: null,  // Room object
    friends: false,
    admin: false,
    selectedContentForParty: null
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync User & Watchlist
  useEffect(() => {
    localStorage.setItem('wt_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wt_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('wt_history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  // Socket.IO Event Setup
  useEffect(() => {
    const socket = getSocket();

    socket.on('room:state', (roomData) => {
      setCurrentRoom(roomData);
      setChatMessages(roomData.messages || []);
      if (roomData.polls && roomData.polls.length > 0) {
        setActivePoll(roomData.polls[0]);
      }
      if (roomData.trivia) {
        setActiveTrivia(roomData.trivia);
      }
    });

    socket.on('chat:message', (msg) => {
      setChatMessages(prev => [...prev, msg]);
      playSoundEffect('message');
    });

    socket.on('chat:deleted', ({ messageId }) => {
      setChatMessages(prev => prev.filter(m => m.id !== messageId));
    });

    socket.on('chat:typing', ({ userId, displayName, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          if (!prev.find(u => u.userId === userId)) {
            return [...prev, { userId, displayName }];
          }
          return prev;
        } else {
          return prev.filter(u => u.userId !== userId);
        }
      });
    });

    socket.on('reaction:received', (reaction) => {
      setFloatingReactions(prev => [...prev, reaction]);
      playSoundEffect('reaction');
      // Clean up reaction after 4s animation
      setTimeout(() => {
        setFloatingReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 4000);
    });

    socket.on('screen:started', () => {
      setIsScreenSharing(true);
      showToast('Screen Sharing Started', 'The host is now sharing their screen with the room.', 'info');
    });

    socket.on('screen:stopped', () => {
      setIsScreenSharing(false);
      showToast('Screen Sharing Stopped', 'The screen broadcast has ended.', 'info');
    });

    socket.on('voice:speaking', ({ userId, isSpeaking }) => {
      setCurrentRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map(p => p.id === userId ? { ...p, isSpeaking } : p)
        };
      });
    });

    socket.on('voice:muted', ({ userId, isMuted }) => {
      setCurrentRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map(p => p.id === userId ? { ...p, isMuted } : p)
        };
      });
    });

    socket.on('poll:updated', (poll) => {
      setActivePoll(poll);
    });

    socket.on('trivia:started', (trivia) => {
      setActiveTrivia(trivia);
      showToast('Movie Trivia Started', 'Test your cinema knowledge with the group!', 'info');
    });

    socket.on('trivia:updated', (trivia) => {
      setActiveTrivia(trivia);
    });

    socket.on('host:kicked_user', ({ targetUserId }) => {
      if (currentUser.id === targetUserId) {
        showToast('Kicked from Room', 'You were removed from the watch party by the host.', 'warning');
        leaveRoom();
      }
    });

    socket.on('host:muted_user', ({ targetUserId }) => {
      if (currentUser.id === targetUserId) {
        webrtcService.toggleMute(true);
        setVoiceState(prev => ({ ...prev, isMicOn: false }));
        showToast('Microphone Muted', 'The host muted your microphone.', 'warning');
      }
    });

    return () => {
      socket.off('room:state');
      socket.off('chat:message');
      socket.off('chat:deleted');
      socket.off('chat:typing');
      socket.off('reaction:received');
      socket.off('screen:started');
      socket.off('screen:stopped');
      socket.off('voice:speaking');
      socket.off('voice:muted');
      socket.off('poll:updated');
      socket.off('trivia:started');
      socket.off('trivia:updated');
      socket.off('host:kicked_user');
      socket.off('host:muted_user');
    };
  }, [currentUser, showToast]);

  // Join Room
  const joinRoom = (roomId, movieAttachment = null) => {
    playSoundEffect('join');
    const socket = getSocket();

    let targetRoom = activeRooms.find(r => r.id === roomId);
    if (!targetRoom) {
      targetRoom = {
        id: roomId,
        code: `WT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: movieAttachment ? `${movieAttachment.title} Watch Party 🍿` : "Cinema Watch Room",
        host: currentUser,
        privacy: "PUBLIC",
        maxParticipants: 25,
        participantCount: 1,
        isLocked: false,
        isActive: true,
        isScreenSharing: false,
        movie: movieAttachment ? {
          id: movieAttachment.id,
          title: movieAttachment.title,
          poster: movieAttachment.poster,
          year: movieAttachment.year,
          genre: movieAttachment.genres.join(' • '),
          provider: movieAttachment.providers[0]?.name || "Screen Share"
        } : null,
        participants: [
          {
            id: currentUser.id,
            displayName: currentUser.displayName,
            avatarUrl: currentUser.avatarUrl,
            role: "HOST",
            isSpeaking: false,
            isMuted: false
          }
        ],
        messages: [
          {
            id: `sys-${Date.now()}`,
            userId: "system",
            userName: "WatchTogether Bot",
            text: `Welcome! Host can click 'Start Screen Sharing' to stream. 🍿`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "SYSTEM"
          }
        ],
        polls: [],
        trivia: null
      };
      setActiveRooms(prev => [...prev, targetRoom]);
    }

    setCurrentRoom(targetRoom);
    setChatMessages(targetRoom.messages || []);
    setCurrentView('room');

    socket.emit('room:join', { roomId, user: currentUser });
    showToast('Joined Watch Party', `Connected to ${targetRoom.name}`, 'success');
  };

  // Leave Room
  const leaveRoom = () => {
    playSoundEffect('click');
    const socket = getSocket();
    socket.emit('room:leave');

    // Stop streams
    webrtcService.stopScreenCapture();
    webrtcService.stopMicrophone();
    setScreenStream(null);
    setIsScreenSharing(false);
    setVoiceState({ isMicOn: false, isDeafened: false, isSpeaking: false });

    // Log to Watch History if watched
    if (currentRoom?.movie) {
      const newHist = {
        id: `hist-${Date.now()}`,
        roomName: currentRoom.name,
        movieTitle: currentRoom.movie.title,
        poster: currentRoom.movie.poster,
        provider: currentRoom.movie.provider,
        date: "Just now",
        duration: "Live Session",
        participants: currentRoom.participants.map(p => p.displayName)
      };
      setWatchHistory(prev => [newHist, ...prev.slice(0, 19)]);
    }

    setCurrentRoom(null);
    setCurrentView('home');
  };

  // Create Room
  const createRoom = (formData) => {
    playSoundEffect('join');
    const roomId = `room-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const code = `WT-${Math.floor(1000 + Math.random() * 9000)}`;

    const movie = formData.movie || null;

    const newRoom = {
      id: roomId,
      code,
      name: formData.name || `${currentUser.displayName}'s Movie Night 🍿`,
      host: currentUser,
      privacy: formData.privacy || "PUBLIC",
      maxParticipants: formData.maxParticipants || 25,
      participantCount: 1,
      isLocked: false,
      isActive: true,
      isScreenSharing: false,
      movie: movie ? {
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        year: movie.year,
        genre: movie.genres.join(' • '),
        provider: movie.providers?.[0]?.name || "Screen Share"
      } : null,
      participants: [
        {
          id: currentUser.id,
          displayName: currentUser.displayName,
          avatarUrl: currentUser.avatarUrl,
          role: "HOST",
          isSpeaking: false,
          isMuted: false
        }
      ],
      messages: [
        {
          id: `sys-${Date.now()}`,
          userId: "system",
          userName: "WatchTogether Bot",
          text: `Room created! Invite friends with code ${code} or copy the invitation link. 🍿`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "SYSTEM"
        }
      ],
      polls: [],
      trivia: null
    };

    setActiveRooms(prev => [newRoom, ...prev]);
    setCurrentRoom(newRoom);
    setChatMessages(newRoom.messages);
    setCurrentView('room');

    const socket = getSocket();
    socket.emit('room:join', { roomId, user: currentUser });

    setModals(prev => ({ ...prev, createRoom: false }));
    showToast('Watch Party Created!', `Room code: ${code}`, 'success');

    // Auto open invite modal
    setModals(prev => ({ ...prev, shareInvite: newRoom }));
  };

  // Chat Actions
  const sendChatMessage = (text, replyToId = null) => {
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit('chat:message', { text: text.trim(), replyToId });

    // Local echo for instant response
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const localMsg = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatarUrl,
      text: text.trim(),
      time: timeStr,
      replyToId,
      type: "TEXT"
    };
    setChatMessages(prev => {
      if (prev.find(m => m.id === localMsg.id)) return prev;
      return [...prev, localMsg];
    });
    playSoundEffect('message');
  };

  const deleteChatMessage = (messageId) => {
    const socket = getSocket();
    socket.emit('chat:delete', { messageId });
    setChatMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const sendTypingIndicator = (isTyping) => {
    const socket = getSocket();
    socket.emit('chat:typing', { isTyping });
  };

  // Reactions Action
  const sendReaction = (emoji) => {
    const socket = getSocket();
    socket.emit('reaction:send', { emoji });

    const localRx = {
      id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      emoji: emoji || '❤️',
      userId: currentUser.id,
      userName: currentUser.displayName,
      x: Math.floor(20 + Math.random() * 60)
    };
    setFloatingReactions(prev => [...prev, localRx]);
    playSoundEffect('reaction');

    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== localRx.id));
    }, 4000);
  };

  // Screen Sharing Action (WebRTC + Browser Screen Capture API)
  const toggleScreenShare = async () => {
    playSoundEffect('click');
    const socket = getSocket();

    if (isScreenSharing) {
      webrtcService.stopScreenCapture();
      setScreenStream(null);
      setIsScreenSharing(false);
      socket.emit('screen:stop');
      showToast('Screen Share Stopped', 'You stopped broadcasting your screen.', 'info');
    } else {
      try {
        webrtcService.onScreenShareEnded = () => {
          setScreenStream(null);
          setIsScreenSharing(false);
          socket.emit('screen:stop');
          showToast('Screen Share Stopped', 'Screen broadcast ended.', 'info');
        };

        const stream = await webrtcService.startScreenCapture();
        setScreenStream(stream);
        setIsScreenSharing(true);
        socket.emit('screen:start');
        showToast('Screen Sharing Active', 'Your screen is now streaming live to all participants!', 'success');
      } catch (err) {
        showToast('Screen Share Error', err.message || 'Permission denied or cancelled.', 'warning');
      }
    }
  };

  // Voice Chat Controls
  const toggleMicrophone = async () => {
    playSoundEffect('click');
    const socket = getSocket();

    if (voiceState.isMicOn) {
      webrtcService.toggleMute(true);
      setVoiceState(prev => ({ ...prev, isMicOn: false, isSpeaking: false }));
      socket.emit('voice:mute', { isMuted: true });
      socket.emit('voice:speaking', { isSpeaking: false });
    } else {
      const stream = await webrtcService.startMicrophone((isSpeaking) => {
        setVoiceState(prev => ({ ...prev, isSpeaking }));
        socket.emit('voice:speaking', { isSpeaking });
      });

      if (stream) {
        webrtcService.toggleMute(false);
        setVoiceState(prev => ({ ...prev, isMicOn: true }));
        socket.emit('voice:mute', { isMuted: false });
        showToast('Microphone On', 'You are now connected to room voice chat.', 'success');
      } else {
        showToast('Microphone Permission', 'Please allow microphone access to talk.', 'warning');
      }
    }
  };

  const toggleDeafen = () => {
    playSoundEffect('click');
    setVoiceState(prev => {
      const newDeaf = !prev.isDeafened;
      if (newDeaf && prev.isMicOn) {
        webrtcService.toggleMute(true);
      }
      return { ...prev, isDeafened: newDeaf, isMicOn: newDeaf ? false : prev.isMicOn };
    });
  };

  // Watchlist Toggle
  const toggleWatchlist = (movie) => {
    playSoundEffect('click');
    const exists = watchlist.includes(movie.id);
    if (exists) {
      setWatchlist(prev => prev.filter(id => id !== movie.id));
      showToast('Removed from Watchlist', `${movie.title} removed.`, 'info');
    } else {
      setWatchlist(prev => [...prev, movie.id]);
      showToast('Added to Watchlist', `${movie.title} saved to your watchlist!`, 'success');
    }
  };

  // Polls & Trivia
  const createPoll = (question, options) => {
    const socket = getSocket();
    socket.emit('poll:create', { question, options });
    showToast('Poll Created', 'Group vote has started!', 'success');
  };

  const votePoll = (pollId, optionId) => {
    const socket = getSocket();
    socket.emit('poll:vote', { pollId, optionId });
  };

  const startTrivia = () => {
    const socket = getSocket();
    socket.emit('trivia:start');
  };

  const answerTrivia = (selectedOption) => {
    const socket = getSocket();
    socket.emit('trivia:answer', { selectedOption });
  };

  // Host Moderation Controls
  const kickUser = (userId) => {
    const socket = getSocket();
    socket.emit('host:kick', { targetUserId: userId });
    showToast('Participant Removed', 'User has been removed from the room.', 'info');
  };

  const muteUser = (userId) => {
    const socket = getSocket();
    socket.emit('host:mute', { targetUserId: userId });
    showToast('Participant Muted', 'User microphone has been muted.', 'info');
  };

  const lockRoom = (isLocked) => {
    const socket = getSocket();
    socket.emit('room:lock', { isLocked });
    showToast(isLocked ? 'Room Locked' : 'Room Unlocked', isLocked ? 'New guests cannot enter.' : 'Room is now open.', 'info');
  };

  const value = {
    currentUser,
    setCurrentUser,
    currentView,
    setCurrentView,
    movies,
    activeRooms,
    friends,
    currentRoom,
    screenStream,
    isScreenSharing,
    chatMessages,
    floatingReactions,
    typingUsers,
    activePoll,
    activeTrivia,
    voiceState,
    watchlist,
    watchHistory,
    notifications,
    searchQuery,
    setSearchQuery,
    searchFilterTab,
    setSearchFilterTab,
    modals,
    setModals,
    toasts,
    showToast,
    removeToast,
    joinRoom,
    leaveRoom,
    createRoom,
    sendChatMessage,
    deleteChatMessage,
    sendTypingIndicator,
    sendReaction,
    toggleScreenShare,
    toggleMicrophone,
    toggleDeafen,
    toggleWatchlist,
    createPoll,
    votePoll,
    startTrivia,
    answerTrivia,
    kickUser,
    muteUser,
    lockRoom
  };

  return <WatchPartyContext.Provider value={value}>{children}</WatchPartyContext.Provider>;
};
