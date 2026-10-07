import * as cheerio from 'cheerio';

async function testScrape() {
  try {
    const res = await fetch('https://cineb.sx/home');
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Find first image
    const img = $('.bf-card__img').first();
    console.log(img.parent().html());
  } catch (error) {
    console.error(error);
  }
}

testScrape();
