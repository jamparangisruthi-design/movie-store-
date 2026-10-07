import React, { useState } from 'react';
import { useWatchParty } from '../context/WatchPartyContext';
import { 
  Newspaper, 
  Calendar, 
  Search, 
  Tag, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Filter,
  Bookmark,
  Share2,
  Tv
} from 'lucide-react';

const INITIAL_ARTICLES = [
  {
    id: "news-1",
    category: "Film Festivals",
    title: "CineHome International Film Festival 2026 Announced",
    summary: "A premier global cinema gathering showcasing groundbreaking 4K restorations, indie premieres, and interactive virtual watch parties.",
    date: "06 October 2026",
    readTime: "4 min read",
    author: "Editorial Team",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    url: "https://www.cinehome.in/news-and-events/festival-2026"
  },
  {
    id: "news-2",
    category: "Red Carpet",
    title: "Exclusive World Premiere: Dune Part Two Director Q&A",
    summary: "Join Denis Villeneuve and the cast for a live stream broadcast and interactive audience trivia session before the gala screening.",
    date: "04 October 2026",
    readTime: "3 min read",
    author: "Elena Rostova",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    featured: false,
    url: "https://www.cinehome.in/news-and-events/dune-2-qa"
  },
  {
    id: "news-3",
    category: "Special Screenings",
    title: "4K IMAX Restoration of Interstellar 10th Anniversary",
    summary: "Christopher Nolan's masterpiece returns to theaters and online social watch rooms with ultra low-latency WebRTC commentary.",
    date: "01 October 2026",
    readTime: "5 min read",
    author: "Rahul Sharma",
    image: "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?q=80&w=800&auto=format&fit=crop",
    featured: false,
    url: "https://www.cinehome.in/news-and-events/interstellar-10th"
  },
  {
    id: "news-4",
    category: "Press Releases",
    title: "WatchTogether Platform Reaches 1 Million Live Watch Parties",
    summary: "Milestone achieved as movie enthusiasts host over 10 million hours of synchronous cinema streaming across 120 countries.",
    date: "28 September 2026",
    readTime: "2 min read",
    author: "Corporate Relations",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    featured: false,
    url: "https://www.cinehome.in/news-and-events/1m-parties"
  },
  {
    id: "news-5",
    category: "Special Screenings",
    title: "Stranger Things Season 5 Midnight Fan Marathon",
    summary: "Reserve your digital seat for the multi-host midnight watch party complete with live voice chat rooms and reaction leaderboards.",
    date: "24 September 2026",
    readTime: "4 min read",
    author: "Community Guild",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    featured: false,
    url: "https://www.cinehome.in/news-and-events/stranger-things-marathon"
  }
];

const UPCOMING_EVENTS = [
  {
    id: "evt-1",
    title: "CineHome Autumn Gala 2026",
    date: "15 Oct 2026",
    time: "19:00 IST",
    location: "Main Auditorium & Online Room 1",
    status: "OPEN"
  },
  {
    id: "evt-2",
    title: "Spider-Verse Animator Masterclass",
    date: "22 Oct 2026",
    time: "20:30 IST",
    location: "Virtual Workshop Stage",
    status: "LIMITED"
  },
  {
    id: "evt-3",
    title: "Halloween Midnight Horror Marathon",
    date: "31 Oct 2026",
    time: "23:59 IST",
    location: "All Social Watch Rooms",
    status: "OPEN"
  }
];

export const NewsAndEventsPage = () => {
  const { showToast } = useWatchParty();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Newsletter State (Testing full 7-state matrix)
  const [emailInput, setEmailInput] = useState('');
  const [newsletterState, setNewsletterState] = useState('default'); // 'default' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const categories = ['All', 'Film Festivals', 'Red Carpet', 'Special Screenings', 'Press Releases'];

  // Filter Articles
  const filteredArticles = INITIAL_ARTICLES.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = !searchQuery.trim() || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find(a => a.featured) || filteredArticles[0];
  const gridArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  // Newsletter Form Handler
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setNewsletterState('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setNewsletterState('loading');
    setTimeout(() => {
      setNewsletterState('success');
      showToast('Subscribed!', 'You will now receive official CineHome News updates.', 'success');
    }, 1200);
  };

  return (
    <div style={{
      fontFamily: 'var(--news-font-family-primary)',
      backgroundColor: 'var(--news-color-surface-base)',
      color: 'var(--news-color-text-secondary)',
      minHeight: '100vh',
      padding: '90px 20px 60px 20px'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* 1. HERO BRANDING & MISSION HEADER */}
        <header style={{
          backgroundColor: 'var(--news-color-surface-raised)',
          border: '1px solid rgba(255,215,52,0.2)',
          borderRadius: '12px',
          padding: 'var(--news-space-8)',
          marginBottom: 'var(--news-space-8)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--news-space-3)', marginBottom: 'var(--news-space-3)' }}>
            <span style={{
              background: 'rgba(255,215,52,0.15)',
              color: 'var(--news-color-text-primary)',
              padding: 'var(--news-space-1) var(--news-space-3)',
              borderRadius: '20px',
              fontSize: 'var(--news-font-size-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Official Portal • CineHome
            </span>
            <span style={{ fontSize: 'var(--news-font-size-sm)', color: 'var(--news-color-text-inverse)' }}>
              https://www.cinehome.in/news-and-events/
            </span>
          </div>

          <h1 style={{
            fontSize: 'var(--news-font-size-3xl)',
            fontWeight: 700,
            color: 'var(--news-color-text-primary)',
            lineHeight: 1.2,
            marginBottom: 'var(--news-space-4)'
          }}>
            News and Events
          </h1>

          <p style={{
            fontSize: 'var(--news-font-size-lg)',
            color: 'var(--news-color-text-secondary)',
            maxWdith: '780px',
            lineHeight: 1.6
          }}>
            Implementation-ready news, event coverage, festival schedules, and press releases for readers and cinema knowledge seekers.
          </p>
        </header>

        {/* 2. SEARCH & FILTER CONTROLS BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--news-space-6)',
          marginBottom: 'var(--news-space-8)',
          flexWrap: 'wrap'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 'var(--news-space-2)', flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    fontFamily: 'var(--news-font-family-primary)',
                    fontSize: 'var(--news-font-size-md)',
                    fontWeight: isActive ? 700 : 400,
                    backgroundColor: isActive ? 'var(--news-color-text-primary)' : 'var(--news-color-surface-raised)',
                    color: isActive ? 'var(--news-color-surface-base)' : 'var(--news-color-text-secondary)',
                    border: isActive ? '1px solid var(--news-color-text-primary)' : '1px solid rgba(255,255,255,0.15)',
                    padding: 'var(--news-space-3) var(--news-space-6)',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all var(--news-motion-duration-instant)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--news-color-text-primary)';
                    e.currentTarget.style.outlineOffset = 'var(--news-space-1)';
                  }}
                  onBlur={(e) => e.currentTarget.style.outline = 'none'}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input Control */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="Search news and upcoming events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                fontFamily: 'var(--news-font-family-primary)',
                fontSize: 'var(--news-font-size-lg)',
                backgroundColor: 'var(--news-color-surface-muted)',
                color: 'var(--news-color-text-tertiary)',
                border: '1px solid var(--news-color-text-inverse)',
                borderRadius: '6px',
                padding: 'var(--news-space-4) var(--news-space-5)',
                paddingLeft: '38px',
                outline: 'none',
                transition: 'border-color var(--news-motion-duration-instant)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--news-color-text-primary)';
                e.currentTarget.style.outline = '2px solid var(--news-color-text-primary)';
                e.currentTarget.style.outlineOffset = 'var(--news-space-1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--news-color-text-inverse)';
                e.currentTarget.style.outline = 'none';
              }}
            />
            <Search size={16} color="#313131" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* 3. FEATURED HEADLINE SPOTLIGHT */}
        {featuredArticle && (
          <section style={{ marginBottom: 'var(--news-space-8)' }}>
            <div style={{
              backgroundColor: 'var(--news-color-surface-raised)',
              border: '1px solid rgba(255,215,52,0.3)',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
            }}>
              <div style={{ position: 'relative', minHeight: '300px' }}>
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'var(--news-color-text-primary)',
                  color: 'var(--news-color-surface-base)',
                  fontWeight: 700,
                  fontSize: 'var(--news-font-size-sm)',
                  padding: 'var(--news-space-2) var(--news-space-4)',
                  borderRadius: '4px'
                }}>
                  FEATURED STORY
                </span>
              </div>

              <div style={{ padding: 'var(--news-space-8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--news-space-4)', fontSize: 'var(--news-font-size-sm)', color: 'var(--news-color-text-inverse)', marginBottom: 'var(--news-space-3)' }}>
                    <span>{featuredArticle.date}</span>
                    <span>•</span>
                    <span>{featuredArticle.readTime}</span>
                    <span>•</span>
                    <span>{featuredArticle.category}</span>
                  </div>

                  <h2 style={{
                    fontSize: 'var(--news-font-size-2xl)',
                    fontWeight: 700,
                    color: 'var(--news-color-text-primary)',
                    lineHeight: 1.3,
                    marginBottom: 'var(--news-space-4)'
                  }}>
                    {featuredArticle.title}
                  </h2>

                  <p style={{
                    fontSize: 'var(--news-font-size-lg)',
                    color: 'var(--news-color-text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--news-space-6)'
                  }}>
                    {featuredArticle.summary}
                  </p>
                </div>

                <div>
                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--news-space-3)',
                      backgroundColor: 'var(--news-color-text-primary)',
                      color: 'var(--news-color-surface-base)',
                      fontFamily: 'var(--news-font-family-primary)',
                      fontSize: 'var(--news-font-size-lg)',
                      fontWeight: 700,
                      padding: 'var(--news-space-4) var(--news-space-6)',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'transform var(--news-motion-duration-instant)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid var(--news-color-text-primary)';
                      e.currentTarget.style.outlineOffset = 'var(--news-space-1)';
                    }}
                    onBlur={(e) => e.currentTarget.style.outline = 'none'}
                  >
                    <span>Read Full Coverage</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. MAIN CONTENT GRID & UPCOMING EVENTS SIDEBAR */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--news-space-8)',
          marginBottom: 'var(--news-space-8)'
        }}>
          {/* News Articles Column */}
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{
              fontSize: 'var(--news-font-size-xl)',
              fontWeight: 700,
              color: 'var(--news-color-text-primary)',
              marginBottom: 'var(--news-space-6)',
              borderBottom: '1px solid rgba(255,215,52,0.3)',
              paddingBottom: 'var(--news-space-3)'
            }}>
              Latest News &amp; Reports ({filteredArticles.length})
            </h3>

            {gridArticles.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--news-color-surface-raised)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: 'var(--news-space-8)',
                textAlign: 'center'
              }}>
                <Newspaper size={40} color="#888888" style={{ marginBottom: 'var(--news-space-4)' }} />
                <h4 style={{ fontSize: 'var(--news-font-size-xl)', color: 'var(--news-color-text-secondary)', marginBottom: 'var(--news-space-2)' }}>
                  No events found for this category.
                </h4>
                <p style={{ fontSize: 'var(--news-font-size-md)', color: 'var(--news-color-text-inverse)' }}>
                  Try selecting a different filter tab or clearing your search term.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--news-space-7)'
              }}>
                {gridArticles.map(article => (
                  <article
                    key={article.id}
                    style={{
                      backgroundColor: 'var(--news-color-surface-raised)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color var(--news-motion-duration-instant)'
                    }}
                  >
                    <div>
                      <div style={{ position: 'relative', height: '160px' }}>
                        <img 
                          src={article.image} 
                          alt={article.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: 'var(--news-color-text-primary)',
                          fontSize: 'var(--news-font-size-sm)',
                          fontWeight: 700,
                          padding: 'var(--news-space-1) var(--news-space-3)',
                          borderRadius: '4px'
                        }}>
                          {article.category}
                        </span>
                      </div>

                      <div style={{ padding: 'var(--news-space-6)' }}>
                        <div style={{ fontSize: 'var(--news-font-size-sm)', color: 'var(--news-color-text-inverse)', marginBottom: 'var(--news-space-2)' }}>
                          {article.date} • {article.readTime}
                        </div>

                        {/* Title Clamped at 2 lines per specification */}
                        <h4 style={{
                          fontSize: 'var(--news-font-size-xl)',
                          fontWeight: 700,
                          color: 'var(--news-color-text-secondary)',
                          lineHeight: 1.4,
                          marginBottom: 'var(--news-space-3)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {article.title}
                        </h4>

                        <p style={{
                          fontSize: 'var(--news-font-size-md)',
                          color: 'var(--news-color-text-inverse)',
                          lineHeight: 1.5,
                          marginBottom: 'var(--news-space-4)',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: '0 var(--news-space-6) var(--news-space-6) var(--news-space-6)' }}>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--news-space-2)',
                          color: 'var(--news-color-text-primary)',
                          fontFamily: 'var(--news-font-family-primary)',
                          fontSize: 'var(--news-font-size-md)',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.outline = '2px solid var(--news-color-text-primary)';
                          e.currentTarget.style.outlineOffset = 'var(--news-space-1)';
                        }}
                        onBlur={(e) => e.currentTarget.style.outline = 'none'}
                      >
                        <span>Read Article</span>
                        <ChevronRight size={14} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Upcoming Event Schedule */}
          <div>
            <h3 style={{
              fontSize: 'var(--news-font-size-xl)',
              fontWeight: 700,
              color: 'var(--news-color-text-primary)',
              marginBottom: 'var(--news-space-6)',
              borderBottom: '1px solid rgba(255,215,52,0.3)',
              paddingBottom: 'var(--news-space-3)'
            }}>
              Upcoming Events Calendar
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--news-space-5)' }}>
              {UPCOMING_EVENTS.map(evt => (
                <div
                  key={evt.id}
                  style={{
                    backgroundColor: 'var(--news-color-surface-raised)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: 'var(--news-space-6)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--news-space-2)' }}>
                    <span style={{ fontSize: 'var(--news-font-size-sm)', fontWeight: 700, color: 'var(--news-color-text-primary)' }}>
                      {evt.date} • {evt.time}
                    </span>
                    <span style={{
                      fontSize: 'var(--news-font-size-sm)',
                      backgroundColor: evt.status === 'OPEN' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                      color: evt.status === 'OPEN' ? '#10b981' : '#f59e0b',
                      padding: 'var(--news-space-1) var(--news-space-3)',
                      borderRadius: '10px',
                      fontWeight: 700
                    }}>
                      {evt.status}
                    </span>
                  </div>

                  <h5 style={{ fontSize: 'var(--news-font-size-lg)', fontWeight: 700, color: 'var(--news-color-text-secondary)', marginBottom: 'var(--news-space-2)' }}>
                    {evt.title}
                  </h5>

                  <p style={{ fontSize: 'var(--news-font-size-sm)', color: 'var(--news-color-text-inverse)', marginBottom: 'var(--news-space-4)' }}>
                    📍 {evt.location}
                  </p>

                  <button
                    onClick={() => showToast('Registration Confirmed', `RSVP received for ${evt.title}`, 'success')}
                    style={{
                      width: '100%',
                      fontFamily: 'var(--news-font-family-primary)',
                      fontSize: 'var(--news-font-size-md)',
                      fontWeight: 700,
                      backgroundColor: 'var(--news-color-text-primary)',
                      color: 'var(--news-color-surface-base)',
                      border: 'none',
                      padding: 'var(--news-space-3)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all var(--news-motion-duration-instant)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid var(--news-color-text-primary)';
                      e.currentTarget.style.outlineOffset = 'var(--news-space-1)';
                    }}
                    onBlur={(e) => e.currentTarget.style.outline = 'none'}
                  >
                    Register for Event
                  </button>
                </div>
              ))}
            </div>

            {/* 5. NEWSLETTER FORM (Testing 7 Component States) */}
            <div style={{
              marginTop: 'var(--news-space-8)',
              backgroundColor: 'var(--news-color-surface-raised)',
              border: '1px solid rgba(255,215,52,0.3)',
              borderRadius: '10px',
              padding: 'var(--news-space-6)'
            }}>
              <h4 style={{ fontSize: 'var(--news-font-size-lg)', fontWeight: 700, color: 'var(--news-color-text-primary)', marginBottom: 'var(--news-space-2)' }}>
                Subscribe to Press Releases
              </h4>
              <p style={{ fontSize: 'var(--news-font-size-sm)', color: 'var(--news-color-text-inverse)', marginBottom: 'var(--news-space-4)' }}>
                Receive official updates and festival bulletins straight to your inbox.
              </p>

              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--news-space-4)' }}>
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (newsletterState === 'error') setNewsletterState('default');
                    }}
                    disabled={newsletterState === 'loading'}
                    style={{
                      width: '100%',
                      fontFamily: 'var(--news-font-family-primary)',
                      fontSize: 'var(--news-font-size-lg)',
                      backgroundColor: 'var(--news-color-surface-muted)',
                      color: 'var(--news-color-text-tertiary)',
                      border: newsletterState === 'error' ? '2px solid #ef4444' : '1px solid var(--news-color-text-inverse)',
                      borderRadius: '6px',
                      padding: 'var(--news-space-4) var(--news-space-5)',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid var(--news-color-text-primary)';
                      e.currentTarget.style.outlineOffset = 'var(--news-space-1)';
                    }}
                    onBlur={(e) => e.currentTarget.style.outline = 'none'}
                  />
                  {newsletterState === 'error' && (
                    <div style={{ fontSize: 'var(--news-font-size-sm)', color: '#ef4444', marginTop: 'var(--news-space-2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={newsletterState === 'loading'}
                  style={{
                    fontFamily: 'var(--news-font-family-primary)',
                    fontSize: 'var(--news-font-size-lg)',
                    fontWeight: 700,
                    backgroundColor: 'var(--news-color-text-primary)',
                    color: 'var(--news-color-surface-base)',
                    border: 'none',
                    padding: 'var(--news-space-4)',
                    borderRadius: '6px',
                    cursor: newsletterState === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: newsletterState === 'loading' ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--news-space-3)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--news-color-text-primary)';
                    e.currentTarget.style.outlineOffset = 'var(--news-space-1)';
                  }}
                  onBlur={(e) => e.currentTarget.style.outline = 'none'}
                >
                  {newsletterState === 'loading' ? (
                    <span>Subscribing...</span>
                  ) : newsletterState === 'success' ? (
                    <>
                      <CheckCircle2 size={16} color="#000" />
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <span>Subscribe to Bulletin</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
