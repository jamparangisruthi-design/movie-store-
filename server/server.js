import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import moviesRouter from './routes/movies.routes.js';
import roomsRouter from './routes/rooms.routes.js';
import friendsRouter from './routes/friends.routes.js';
import adminRouter from './routes/admin.routes.js';
import cinehdRouter from './routes/cinehd.routes.js';
import { initSocketHandler } from './socket/socketHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Enable CORS for client
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/movies', moviesRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cinehd', cinehdRouter);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', platform: 'WatchTogether', timestamp: new Date().toISOString() });
});

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach real-time event pipeline
initSocketHandler(io);

httpServer.listen(PORT, () => {
  console.log(`🎬 WatchTogether Backend Server & Socket.IO live on port ${PORT}`);
});
