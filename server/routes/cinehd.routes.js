import express from 'express';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// We use dynamic scraping and fallback to local JSON when blocked
router.get('/', async (req, res) => {
  try {
    const isAction = req.query.category === 'action';
    // Use cineb.sx as alternative to cinehd.vc
    const targetUrl = isAction ? 'https://cineb.sx/genre/action' : 'https://cineb.sx/home';
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html'
      }
    });
    const html = await response.text();

    if (html.includes('Cloudflare') || html.includes('Just a moment...')) {
      // Return fallback data
      const fallbackFileName = isAction ? 'cinehd_fallback_action.json' : 'cinehd_fallback.json';
      const fallbackPath = path.join(__dirname, `../data/${fallbackFileName}`);
      const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      return res.json({ success: true, source: 'fallback', movies: fallbackData });
    }

    const $ = cheerio.load(html);
    const movies = [];
    
    // Attempting to scrape based on cineb.sx selectors
    $('img.bf-card__img').each((i, el) => {
      const aTag = $(el).closest('a');
      const href = aTag.attr('href');
      
      const img = $(el).attr('data-src') || $(el).attr('src');
      let title = $(el).attr('alt') || aTag.find('.bf-card__title').text() || aTag.attr('title');
      if (title) title = title.trim();
      
      // Extract a mock ID from the href
      const id = href ? (href.split('-').pop() || href) : null;
      
      if (title && id && href && !href.includes('genre') && !title.includes('View All')) {
        // If image is a lazy placeholder, we can use a mock TMDB image or keep it as is
        const finalImg = img && img.startsWith('data:image') ? `https://image.tmdb.org/t/p/w500/${id}.jpg` : img;
        
        movies.push({
          id,
          title,
          year: '2026', // Use default year since some cards omit it
          type: href.includes('/watch/tv-') ? 'tv' : 'movie',
          link: `https://cineb.sx${href}`,
          image: finalImg || `https://image.tmdb.org/t/p/w500/${id}.jpg` 
        });
      }
    });

    // Remove duplicates
    const uniqueMovies = Array.from(new Map(movies.map(m => [m.id, m])).values());

    res.json({ success: true, source: 'live', movies: uniqueMovies.slice(0, 20) });
  } catch (error) {
    console.error('Scraping Error:', error);
    const isAction = req.query.category === 'action';
    const fallbackFileName = isAction ? 'cinehd_fallback_action.json' : 'cinehd_fallback.json';
    const fallbackPath = path.join(__dirname, `../data/${fallbackFileName}`);
    const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    res.json({ success: true, source: 'fallback', movies: fallbackData });
  }
});

export default router;
