import { Router } from 'express';
import { activeRooms } from '../socket/socketHandler.js';
import { INITIAL_ROOMS, INITIAL_MOVIES } from '../data/initialData.js';

const router = Router();

// GET /api/rooms - List all active public rooms
router.get('/', (req, res) => {
  const roomsArray = Array.from(activeRooms.values()).filter(r => r.isActive && r.privacy === 'PUBLIC');
  res.json({ success: true, count: roomsArray.length, data: roomsArray });
});

// GET /api/rooms/:id - Get specific room details
router.get('/:id', (req, res) => {
  const room = activeRooms.get(req.params.id);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Watch party not found' });
  }
  res.json({ success: true, data: room });
});

// POST /api/rooms - Create a new watch room
router.post('/', (req, res) => {
  const { name, privacy, maxParticipants, movieId, hostUser } = req.body;
  const roomId = `room-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const code = `WT-${Math.floor(1000 + Math.random() * 9000)}`;

  const selectedMovie = movieId ? INITIAL_MOVIES.find(m => m.id === movieId) : null;

  const newRoom = {
    id: roomId,
    code,
    name: name || `${hostUser?.displayName || 'User'}'s Watch Party 🍿`,
    host: hostUser || { id: "u-host", displayName: "Host", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop" },
    privacy: privacy || "PUBLIC",
    maxParticipants: maxParticipants || 25,
    participantCount: 1,
    isLocked: false,
    isActive: true,
    isScreenSharing: false,
    movie: selectedMovie ? {
      id: selectedMovie.id,
      title: selectedMovie.title,
      poster: selectedMovie.poster,
      year: selectedMovie.year,
      genre: selectedMovie.genres.join(' • '),
      provider: selectedMovie.providers[0]?.name || "Screen Share"
    } : null,
    participants: [
      {
        id: hostUser?.id || "u-host",
        displayName: hostUser?.displayName || "Host",
        avatarUrl: hostUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
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
        text: `Welcome to ${name || "the watch party"}! Host can start screen sharing whenever ready. 🍿`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "SYSTEM"
      }
    ],
    polls: [],
    trivia: null
  };

  activeRooms.set(roomId, newRoom);
  res.status(201).json({ success: true, data: newRoom });
});

export default router;
