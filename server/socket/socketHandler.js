// Real-time Socket.IO and WebRTC Signaling Handler for WatchTogether

import { INITIAL_ROOMS, TRIVIA_QUESTIONS } from '../data/initialData.js';

// In-memory active room storage (backed by PostgreSQL in production)
export const activeRooms = new Map();

// Initialize initial rooms into map
INITIAL_ROOMS.forEach(room => {
  activeRooms.set(room.id, {
    ...room,
    polls: [],
    trivia: null
  });
});

export const initSocketHandler = (io) => {
  io.on('connection', (socket) => {
    let currentRoomId = null;
    let currentUser = null;

    // Join Room
    socket.on('room:join', ({ roomId, user }) => {
      currentRoomId = roomId;
      currentUser = user;
      socket.join(roomId);

      let room = activeRooms.get(roomId);
      if (!room) {
        // Create new dynamic room if not present
        room = {
          id: roomId,
          code: roomId.toUpperCase(),
          name: `${user.displayName}'s Watch Party 🍿`,
          host: user,
          privacy: "PUBLIC",
          maxParticipants: 50,
          participantCount: 1,
          isLocked: false,
          isActive: true,
          isScreenSharing: false,
          movie: null,
          participants: [],
          messages: [],
          polls: [],
          trivia: null
        };
        activeRooms.set(roomId, room);
      }

      // Add user to participants if not existing
      const existingIdx = room.participants.findIndex(p => p.id === user.id);
      const participantData = {
        id: user.id,
        displayName: user.displayName || user.username || "Guest",
        avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
        role: room.host.id === user.id ? "HOST" : "MEMBER",
        isSpeaking: false,
        isMuted: false,
        socketId: socket.id
      };

      if (existingIdx > -1) {
        room.participants[existingIdx] = participantData;
      } else {
        room.participants.push(participantData);
      }

      room.participantCount = room.participants.length;

      // Broadcast room state to all in room
      io.to(roomId).emit('room:state', room);
      socket.to(roomId).emit('user:join', { user: participantData, timestamp: new Date().toISOString() });
    });

    // Leave Room
    socket.on('room:leave', () => {
      if (currentRoomId && currentUser) {
        const room = activeRooms.get(currentRoomId);
        if (room) {
          room.participants = room.participants.filter(p => p.id !== currentUser.id);
          room.participantCount = room.participants.length;
          io.to(currentRoomId).emit('room:state', room);
          socket.to(currentRoomId).emit('user:leave', { userId: currentUser.id, displayName: currentUser.displayName });
        }
        socket.leave(currentRoomId);
        currentRoomId = null;
      }
    });

    // Chat Message
    socket.on('chat:message', ({ text, replyToId }) => {
      if (!currentRoomId || !currentUser || !text.trim()) return;
      const room = activeRooms.get(currentRoomId);
      if (!room) return;

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const newMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: currentUser.id,
        userName: currentUser.displayName || currentUser.username,
        userAvatar: currentUser.avatarUrl,
        text: text.trim(),
        time: timeStr,
        replyToId: replyToId || null,
        type: "TEXT"
      };

      room.messages.push(newMsg);
      io.to(currentRoomId).emit('chat:message', newMsg);
    });

    // Chat Typing Indicator
    socket.on('chat:typing', ({ isTyping }) => {
      if (!currentRoomId || !currentUser) return;
      socket.to(currentRoomId).emit('chat:typing', {
        userId: currentUser.id,
        displayName: currentUser.displayName,
        isTyping
      });
    });

    // Chat Delete (Host or Author)
    socket.on('chat:delete', ({ messageId }) => {
      if (!currentRoomId) return;
      const room = activeRooms.get(currentRoomId);
      if (room) {
        room.messages = room.messages.filter(m => m.id !== messageId);
        io.to(currentRoomId).emit('chat:deleted', { messageId });
      }
    });

    // Floating Reactions
    socket.on('reaction:send', ({ emoji }) => {
      if (!currentRoomId || !currentUser) return;
      const reactionPayload = {
        id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        emoji: emoji || '❤️',
        userId: currentUser.id,
        userName: currentUser.displayName,
        x: Math.floor(20 + Math.random() * 60) // % across screen
      };
      io.to(currentRoomId).emit('reaction:received', reactionPayload);
    });

    // Screen Share Toggle
    socket.on('screen:start', () => {
      if (!currentRoomId) return;
      const room = activeRooms.get(currentRoomId);
      if (room) {
        room.isScreenSharing = true;
        io.to(currentRoomId).emit('screen:started', { hostId: room.host.id });
        io.to(currentRoomId).emit('room:state', room);
      }
    });

    socket.on('screen:stop', () => {
      if (!currentRoomId) return;
      const room = activeRooms.get(currentRoomId);
      if (room) {
        room.isScreenSharing = false;
        io.to(currentRoomId).emit('screen:stopped');
        io.to(currentRoomId).emit('room:state', room);
      }
    });

    // WebRTC Signaling (Screen & Voice Peer Connection)
    socket.on('webrtc:offer', ({ toSocketId, offer }) => {
      socket.to(toSocketId).emit('webrtc:offer', { fromSocketId: socket.id, offer });
    });

    socket.on('webrtc:answer', ({ toSocketId, answer }) => {
      socket.to(toSocketId).emit('webrtc:answer', { fromSocketId: socket.id, answer });
    });

    socket.on('webrtc:ice-candidate', ({ toSocketId, candidate }) => {
      socket.to(toSocketId).emit('webrtc:ice-candidate', { fromSocketId: socket.id, candidate });
    });

    // Voice Speaking Indicator & Mute
    socket.on('voice:speaking', ({ isSpeaking }) => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room) {
        const p = room.participants.find(part => part.id === currentUser.id);
        if (p) p.isSpeaking = isSpeaking;
        socket.to(currentRoomId).emit('voice:speaking', { userId: currentUser.id, isSpeaking });
      }
    });

    socket.on('voice:mute', ({ isMuted }) => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room) {
        const p = room.participants.find(part => part.id === currentUser.id);
        if (p) p.isMuted = isMuted;
        io.to(currentRoomId).emit('voice:muted', { userId: currentUser.id, isMuted });
      }
    });

    // Host Controls: Mute User
    socket.on('host:mute', ({ targetUserId }) => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room && room.host.id === currentUser.id) {
        io.to(currentRoomId).emit('host:muted_user', { targetUserId });
      }
    });

    // Host Controls: Kick User
    socket.on('host:kick', ({ targetUserId }) => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room && room.host.id === currentUser.id) {
        room.participants = room.participants.filter(p => p.id !== targetUserId);
        io.to(currentRoomId).emit('host:kicked_user', { targetUserId });
        io.to(currentRoomId).emit('room:state', room);
      }
    });

    // Host Controls: Lock Room
    socket.on('room:lock', ({ isLocked }) => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room && room.host.id === currentUser.id) {
        room.isLocked = isLocked;
        io.to(currentRoomId).emit('room:locked', { isLocked });
        io.to(currentRoomId).emit('room:state', room);
      }
    });

    // Movie Voting / Polls
    socket.on('poll:create', ({ question, options }) => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room) {
        const newPoll = {
          id: `poll-${Date.now()}`,
          question: question || "What should we watch next? 🍿",
          options: options.map((opt, idx) => ({ id: idx, text: opt, votes: 0, votedUsers: [] })),
          isActive: true
        };
        room.polls = [newPoll];
        io.to(currentRoomId).emit('poll:updated', newPoll);
      }
    });

    socket.on('poll:vote', ({ pollId, optionId }) => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room && room.polls && room.polls.length > 0) {
        const poll = room.polls[0];
        if (poll && poll.id === pollId) {
          // Remove previous vote by this user if any
          poll.options.forEach(opt => {
            opt.votedUsers = opt.votedUsers.filter(u => u !== currentUser.id);
            opt.votes = opt.votedUsers.length;
          });
          // Add new vote
          const opt = poll.options.find(o => o.id === optionId);
          if (opt) {
            opt.votedUsers.push(currentUser.id);
            opt.votes = opt.votedUsers.length;
          }
          io.to(currentRoomId).emit('poll:updated', poll);
        }
      }
    });

    // Movie Trivia Game
    socket.on('trivia:start', () => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room) {
        const randomQ = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
        room.trivia = {
          ...randomQ,
          startTime: Date.now(),
          answers: {}
        };
        io.to(currentRoomId).emit('trivia:started', room.trivia);
      }
    });

    socket.on('trivia:answer', ({ selectedOption }) => {
      if (!currentRoomId || !currentUser) return;
      const room = activeRooms.get(currentRoomId);
      if (room && room.trivia) {
        room.trivia.answers[currentUser.id] = {
          selectedOption,
          isCorrect: selectedOption === room.trivia.correctAnswer,
          displayName: currentUser.displayName
        };
        io.to(currentRoomId).emit('trivia:updated', room.trivia);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (currentRoomId && currentUser) {
        const room = activeRooms.get(currentRoomId);
        if (room) {
          room.participants = room.participants.filter(p => p.id !== currentUser.id);
          room.participantCount = room.participants.length;
          io.to(currentRoomId).emit('room:state', room);
          socket.to(currentRoomId).emit('user:leave', { userId: currentUser.id, displayName: currentUser.displayName });
        }
      }
    });
  });
};
