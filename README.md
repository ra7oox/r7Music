# R7Music

A React music player powered by the Jamendo API (free/CC-licensed music) with optional Last.fm enrichment.

### Features
- Discover trending tracks, albums, and artists
- Search tracks, albums, and artists
- Favorites (persisted to localStorage)
- Full audio player with seek, volume, shuffle, repeat
- Album and artist detail pages with Last.fm bios and similar artists
- Smooth animations and glassmorphism UI

### Stack
React 19, Vite 8, Tailwind CSS v4, Zustand v5, React Query v5, React Router v7

### Setup

```bash
npm install
cp .env.example .env   # then edit with your API keys
npm run dev
```

### API Keys
- **Jamendo** (required) — free key at https://devportal.jamendo.com
- **Last.fm** (optional) — free key at https://www.last.fm/api

### Deploy to GitHub Pages

1. Push to `main`
2. Go to repo Settings → Pages → Source: **GitHub Actions**
3. The `.github/workflows/deploy.yml` handles the rest
