import { Router } from 'express';
import { activeRooms } from '../socket/socketHandler.js';
import { INITIAL_FRIENDS, INITIAL_MOVIES } from '../data/initialData.js';

const router = Router();

// Demo users and reports
const users = [
  { id: "u-rahul", displayName: "Rahul Sharma", email: "rahul@example.com", role: "USER", isOnline: true, createdAt: "2026-01-10" },
  { id: "u-anu", displayName: "Anu Patel", email: "anu@example.com", role: "USER", isOnline: true, createdAt: "2026-01-12" },
  { id: "u-sruthi", displayName: "Sruthi Jamparangi", email: "sruthi@example.com", role: "ADMIN", isOnline: true, createdAt: "2026-01-01" },
  { id: "u-ravi", displayName: "Ravi Teja", email: "ravi@example.com", role: "USER", isOnline: false, createdAt: "2026-02-05" }
];

const reports = [
  { id: "rep-1", reporter: "Anu Patel", reportedUser: "Troll99", reason: "Spam in chat", status: "RESOLVED", date: "Yesterday" },
  { id: "rep-2", reporter: "Rahul Sharma", reportedUser: "StreamPirate", reason: "Attempted prohibited links", status: "OPEN", date: "1 hour ago" }
];

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const roomsArray = Array.from(activeRooms.values());
  const totalParticipants = roomsArray.reduce((sum, r) => sum + (r.participantCount || 0), 0);
  const totalMessages = roomsArray.reduce((sum, r) => sum + (r.messages?.length || 0), 0);

  res.json({
    success: true,
    data: {
      totalUsers: users.length + 142,
      activeUsers: totalParticipants + 18,
      activeRooms: roomsArray.length,
      totalMessages: totalMessages + 850,
      systemHealth: "100% Operational",
      uptime: "99.98%",
      sfuRegion: "us-east / auto-mesh",
      bandwidthUsage: "1.4 Gbps"
    }
  });
});

// GET /api/admin/rooms
router.get('/rooms', (req, res) => {
  const roomsArray = Array.from(activeRooms.values());
  res.json({ success: true, data: roomsArray });
});

// DELETE /api/admin/rooms/:id
router.delete('/rooms/:id', (req, res) => {
  activeRooms.delete(req.params.id);
  res.json({ success: true, message: 'Room terminated by admin' });
});

// GET /api/admin/reports
router.get('/reports', (req, res) => {
  res.json({ success: true, data: reports });
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  res.json({ success: true, data: users });
});

export default router;
