# WatchTogether — Production-Grade Social Watch Party Platform

![WatchTogether Banner](https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop)

> **"One Screen. Many Friends. One Experience."**
> 
> *Search what you want to watch, create a room, invite your friends, share your screen, and experience it together in real time.*

---

## 🌟 Executive Summary

**WatchTogether** is a real-time social watch party platform engineered for friends to stream content together across remote locations. Built with a modern cinematic aesthetic (Netflix-inspired UI meets Discord-style voice and text communication), WatchTogether leverages standard browser **Screen Capture API (`navigator.mediaDevices.getDisplayMedia`)**, **WebRTC**, and **Socket.IO** for ultra-low-latency synchronization.

---

## 🏗️ System Architecture

```text
┌───────────────────────────────┐
│          Host Browser         │
│   (Screen Capture + Mic Audio)│
└──────────────┬────────────────┘
               │
               │ 1. WebRTC MediaStream (Video/Audio)
               ▼
┌───────────────────────────────┐        ┌───────────────────────────────┐
│     LiveKit / SFU Relay       ├───────►│      Connected Friends        │
│    (Scalable Media Mesh)      │        │    (Screen Stream + Voice)    │
└───────────────────────────────┘        └──────────────┬────────────────┘
                                                        │
┌───────────────────────────────┐                       │ 2. Chat / Reactions / Polls
│    Node.js + Socket.IO Server │◄──────────────────────┘
│    (Express + PostgreSQL)     │
└───────────────────────────────┘
```

---

## 🚀 Key Features

### 1. 🔎 Legitimate Metadata Discovery & Movie Search
- Prominent search bar on the landing page with **300ms debounced live autocomplete**.
- Search across Movies, TV Series, and Live Watch Parties (e.g., *Avengers: Endgame*, *Stranger Things*, *Dune: Part Two*).
- Instant action buttons: `[ View Details ]`, `[ + Watchlist ]`, and `[ Create Watch Party 🍿 ]`.

### 2. 🍿 Virtual Watch Room (`/room/:roomId`)
- **Shared Screen Viewport**: Broadcasts the host's screen with user-authorized browser permissions and theater dimming controls.
- **Floating Live Reactions**: Floating emoji particles (❤️ 😂 😱 🔥 👏 🍿 😍) that float upward across the video stream with realistic physics.
- **Live Voice Chat**: WebRTC voice channels with **speaking indicator halos** (glowing green avatar rings detecting microphone activity).
- **Live Text Chat**: Real-time Socket.IO messaging with typing indicators, emoji reactions, reply threading, and host moderation deletion.
- **Interactive Party Games & Polls**:
  - *"What should we watch?"* live group movie voting with real-time percentage bars.
  - Cinema Trivia quiz challenge with live scoreboard.
- **Host Controls**: Screen sharing start/stop, room locking, participant mute, and participant kick.

### 3. 👥 Social System & Friends
- Search users, send friend requests, accept/reject invites.
- Real-time online presence and *"Friends Watching Now"* activity ticker (e.g., *"Rahul is watching Avengers: Endgame [Join Party]"*).

### 4. 🗄️ Watchlist & History
- `/watchlist`: Bookmark movies and shows to launch watch parties with one click.
- `/history`: Chronological watch logs with duration, provider, and participant squad lists.

### 5. 🛡️ Admin & Moderation Hub
- `/admin`: Real-time system health metrics, active room monitor with force-termination capability, and user moderation logs.

---

## 🔒 Legal & Compliance Policy

WatchTogether is **NOT** a streaming piracy platform:
- ❌ Does not download, rehost, or distribute copyrighted video files.
- ❌ Does not bypass DRM or content protection.
- ❌ Does not scrape protected subscription services.
- ✅ Media synchronization operates via **user-authorized browser screen sharing**. Users use their own legitimate accounts and share their screen with friends.

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Installation
```bash
git clone https://github.com/jamparangisruthi-design/movie-store-.git
cd movie-store-
npm install
```

### 2. Run Backend Server & Socket.IO (Port 5000)
```bash
npm run server
```

### 3. Run Frontend Development Server (Port 3000)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TypeScript/JSX, Vanilla CSS Custom Properties |
| **Icons & FX** | Lucide React, Canvas Confetti, Web Audio API |
| **Real-Time Communication** | Socket.IO Client, WebRTC MediaStream, Browser Screen Capture API |
| **Backend** | Node.js, Express, Socket.IO Server, CORS, Dotenv |
| **Database ORM** | PostgreSQL + Prisma Schema (`prisma/schema.prisma`) |

---

## 📄 License
This project is open source and available under the ISC License.