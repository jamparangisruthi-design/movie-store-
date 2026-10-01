import { Router } from 'express';
import { INITIAL_MOVIES } from '../data/initialData.js';

const router = Router();

// GET /api/movies/trending
router.get('/trending', (req, res) => {
  res.json({ success: true, count: INITIAL_MOVIES.length, data: INITIAL_MOVIES });
});

// GET /api/movies/search?q=...
router.get('/search', (req, res) => {
  const query = (req.query.q || '').toString().toLowerCase().trim();
  if (!query) {
    return res.json({ success: true, count: INITIAL_MOVIES.length, data: INITIAL_MOVIES });
  }

  const results = INITIAL_MOVIES.filter(m => 
    m.title.toLowerCase().includes(query) ||
    m.genres.some(g => g.toLowerCase().includes(query)) ||
    m.director.toLowerCase().includes(query) ||
    m.cast.some(c => c.name.toLowerCase().includes(query))
  );

  res.json({ success: true, count: results.length, data: results });
});

// GET /api/movies/:id
router.get('/:id', (req, res) => {
  const movie = INITIAL_MOVIES.find(m => m.id === req.params.id);
  if (!movie) {
    return res.status(404).json({ success: false, message: 'Movie not found' });
  }
  res.json({ success: true, data: movie });
});

export default router;
