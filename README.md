# CineVault — Interactive 4K Ultra HD Movie Store & Streaming Platform

![CineVault Banner](https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop)

**CineVault** is a modern, interactive movie streaming and digital purchase platform built with React, Vite, and high-fidelity Vanilla CSS. It provides digital ownership purchases (4K UHD), 48-hour weekend rentals, an interactive trailer theater with ambient dimming lights, TMDB API live sync, user reviews, and personal digital vault storage.

---

## 🌟 Key Features

### 1. 🎬 Cinematic Spotlight & Hero Carousel
- High-impact dynamic hero banner with 4K UHD badges, Rotten Tomatoes match score, IMDb ratings, age ratings, and audio spec indicators (Dolby Vision, Dolby Atmos 7.1.4, IMAX Enhanced).
- Direct "Watch 4K Trailer", "Buy 4K UHD", "Rent HD", and "Add to Watchlist" actions.
- Interactive thumbnail carousel with smooth cross-fading backdrop transitions.

### 2. 🍿 Interactive 4K Trailer Theater
- Built-in video player modal featuring official high-resolution trailers.
- **Ambient Theater Dimmer Slider**: Dynamically dim the surrounding lights (50% to 100% ambient blackout).
- **Stream Specs Switcher**: Toggle resolutions (4K UHD 2160p HDR, 1080p FHD, 720p), audio channels (Dolby Atmos 7.1.4, 5.1 Surround, Stereo), and multilingual subtitles.

### 3. 💳 Digital 4K Store & Checkout System
- Multi-tier store offerings:
  - **4K UHD Keep-Forever Copy**: Lifetime cloud streaming + bonus features & artbook.
  - **48-Hour Rental**: Instant 48-hour viewing window with live countdown timer.
- **Promo Code Discounts**:
  - `CINE50` — 50% discount on entire cart
  - `CINEMA2026` / `FREE` — 100% free checkout pass
  - `VIP30` — 30% VIP member discount
- Multi-payment simulator (Credit/Debit Card, Apple Pay, Google Pay, CinePass Balance).
- Realistic animated checkout with confetti celebration and **CineVault Digital Pass Ticket** with QR code and download license certificates.

### 4. 🗄️ My Digital Vault & Personal Library
- **4K Purchases Library**: Permanent collection of owned movies with instant 4K playback and downloadable `.txt` ownership licenses.
- **Active Rentals**: Real-time 48-hour rental passes with live ticking countdown timers.
- **Watchlist**: Quick-access bookmarks stored in `localStorage`.

### 5. 🔍 Discovery Hub, Search & Filters
- Real-time instant search bar with autocomplete dropdown and `/` keyboard shortcut.
- Filter by Genre chips (Sci-Fi, Action, Drama, Horror, Animation, Thriller, Crime, etc.).
- Filter by minimum IMDb score slider (7.0+, 8.0+, 8.5+).
- Filter by release year and digital format (4K UHD, Dolby Atmos, Weekend Deals).
- Sort by Popularity, Highest Rated, Price (Low/High), Newest, or Title (A-Z).
- Switch between **Grid View** and **Compact List View**.

### 6. 🌐 TMDB Live API & Curated 4K Mode
- Built-in rich offline database of 50+ blockbusters with trailers, cast headshots, and technical specs for instant offline performance.
- Seamless **TMDB Live API Switcher Modal**: Plug in any TMDB API key to search and stream 800,000+ live movies.

### 7. 🔊 Web Audio API Cinema Sound Effects
- Interactive synthesized UI sound effects (cinema sub-bass rumble, clicks, and purchase fanfare) with a master sound toggle in the header.

### 8. 💱 Multi-Currency Converter
- Switch currencies on the fly: USD ($), EUR (€), GBP (£), INR (₹), JPY (¥).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/jamparangisruthi-design/movie-store-.git
   cd movie-store-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

5. To build for production:
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite 6
- **Styling**: Vanilla CSS3 (Custom Properties, Glassmorphism, CSS Grid & Flexbox, Ambient Glows)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio**: Web Audio API Synthesizer
- **Data & API**: TMDB API + Curated 4K Master Dataset

---

## 📄 License
This project is open source and available under the ISC License.