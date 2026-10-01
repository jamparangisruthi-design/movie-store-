import { Router } from 'express';
import { INITIAL_FRIENDS } from '../data/initialData.js';

const router = Router();

// In-memory friends list
let friends = [...INITIAL_FRIENDS];
let friendRequests = [
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
];

// GET /api/friends
router.get('/', (req, res) => {
  res.json({ success: true, count: friends.length, data: friends });
});

// GET /api/friends/requests
router.get('/requests', (req, res) => {
  res.json({ success: true, count: friendRequests.length, data: friendRequests });
});

// POST /api/friends/requests/accept
router.post('/requests/accept', (req, res) => {
  const { requestId } = req.body;
  const reqItem = friendRequests.find(r => r.id === requestId);
  if (reqItem) {
    friends.push({
      ...reqItem.fromUser,
      status: "ONLINE",
      activeRoom: null
    });
    friendRequests = friendRequests.filter(r => r.id !== requestId);
  }
  res.json({ success: true, data: friends });
});

// POST /api/friends/requests/reject
router.post('/requests/reject', (req, res) => {
  const { requestId } = req.body;
  friendRequests = friendRequests.filter(r => r.id !== requestId);
  res.json({ success: true });
});

export default router;
