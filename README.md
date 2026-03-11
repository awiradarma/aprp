# Anonymous Prayer Platform(APRP)

A serverless, privacy-first platform for sharing anonymous prayers — requests, praises, or thanksgivings — and interceding for one another, with a live global map showing where believers around the world are praying.

---

## Project Intent

This is a personal ministry tool designed to connect believers across geographical boundaries through intercessory prayer. Core values:

- **Anonymity** — No account required. Identity is managed via secure session cookies and optional recovery codes.
- **Privacy** — Exact locations are never stored. All geo-data is jittered (±0.01°) and snapped to a Level-6 Geohash before reaching the database.
- **Presence** — A live global map visually shows where prayer is happening, reducing the sense of spiritual isolation for those who submit a prayer.
- **Simplicity** — Submit a prayer in seconds. No sign-up, no friction.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router, Server Actions, RSC) |
| **Database** | GCP Firestore (real-time, serverless, on-demand) |
| **Mapping** | MapLibre GL JS + AWS Location Service (HERE Explore tiles) |
| **Geocoding** | OpenStreetMap Nominatim (free, server-side, no API key needed) |
| **Deployment** | Vercel (serverless, auto-deploys on `git push`) |
| **Privacy** | Coordinate jittering + ngeohash Level-6 geohashing |

---

## Current Features (Phases 1–3)

### 🔐 Anonymous Identity (Phase 1)
- A `stub_user_id` UUID is automatically generated and stored in a secure `HttpOnly` cookie on first visit — no sign-up needed
- Every prayer gets a unique `nanoid(16)` URL (e.g. `/p/M0f5gIENRmkJFdpR`) that can be shared

### 🔑 Recovery & Intercession Tracking (Phase 2)
- **Recovery Code** — a 12-character alphanumeric code shown on the Dashboard, exportable to restore a session on a new device via `/recover`
- **"I Prayed" button** — any visitor can click to intercede; an atomic Firestore counter tracks the total
- **Dashboard** — shows all prayers you submitted and all prayers you've interceded for
- **Intercessor locations** — when clicking "I Prayed", users can optionally share their location (privacy-preserving) which appears as an amber marker on a mini-map on the prayer page

### 🌍 Discovery & Global Map (Phase 3)
- **Global Map** on the homepage — live MapLibre map showing blue markers for every geolocated prayer around the world
- **Discover page** (`/discover`) — browsable list of all prayers with location tags, timestamps, and intercession counts
- **Intercessor mini-map** — each prayer detail page shows a small world map with amber markers showing where intercessors prayed from

### ✏️ Prayer Management
- **Edit prayer** — owners can inline-edit their prayer after submission
- **Mark as Answered** — owners can mark a prayer as answered; the header turns green and shows "🙌 Answered Prayer"
- **Share button** — uses the native Web Share API on mobile; falls back to clipboard copy on desktop

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, page title, metadata
│   ├── page.tsx                # Homepage: prayer form + global map
│   ├── discover/page.tsx       # Browse all prayers
│   ├── dashboard/page.tsx      # User's personal prayer history
│   ├── recover/page.tsx        # Restore session via recovery code
│   ├── p/[id]/page.tsx         # Individual prayer detail page
│   └── actions/
│       ├── prayer.ts           # Submit prayer (geocode → jitter → geohash → Firestore)
│       ├── intercede.ts        # "I Prayed" action with optional location capture
│       ├── map.ts              # Fetch markers for global map
│       ├── discover.ts         # Fetch prayers for Discover page
│       ├── intercessions.ts    # Fetch intercessor locations for prayer mini-map
│       ├── owner.ts            # Edit + Mark as Answered (server-side auth)
│       └── recovery.ts        # Generate/retrieve recovery codes; track lastSeenAt
├── components/
│   ├── GlobalMap.tsx           # Homepage world map (MapLibre)
│   ├── IntercessionMap.tsx     # Per-prayer intercessor mini-map
│   ├── ShareButton.tsx         # Web Share API / clipboard fallback
│   └── PrayerOwnerActions.tsx  # Owner-only edit and answered controls
└── lib/
    ├── firebase/server.ts      # Firebase Admin SDK connection (server-side only)
    └── geo.ts                  # jitterCoordinate() + getGeohash() privacy utilities
```

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.local.example .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required Environment Variables

```env
# Firebase (server-side only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# AWS Location Service (public, used by the browser map)
NEXT_PUBLIC_AWS_LOCATION_API_KEY=
NEXT_PUBLIC_AWS_LOCATION_MAP_NAME=aprp-map
NEXT_PUBLIC_AWS_LOCATION_REGION=us-east-1
```

---

## Deployment

Deployed on [Vercel](https://vercel.com). Every push to `main` triggers an automatic deployment.

```bash
git push origin main
```

Add all environment variables above in **Vercel → Project → Settings → Environment Variables**.

---

## Database Maintenance

### Cleaning up inactive anonymous stubs

Every dashboard visit creates or updates a `users` document. To remove stubs that have had no activity in over a year **and have no prayer data**:

```bash
# Preview (no deletions)
node scripts/cleanup-inactive-users.js --dry-run

# Delete stubs inactive for >365 days (default)
node scripts/cleanup-inactive-users.js

# Custom threshold
node scripts/cleanup-inactive-users.js --days 180
```

---

## Roadmap

| Feature | Notes |
|---|---|
| 🔔 **Push Notifications (FCM)** | Notify users when someone prays for their request |
| 🌐 **Multi-language UI** | react-i18next + AI-powered prayer translation |
| 🗺️ **Marker clustering** | Cluster overlapping map dots for clarity at low zoom |
| 🛡️ **Content moderation** | Offensive content detection for Public & Unlisted prayers. |
| ☎️ **Support system** | Dedicated channel for user support and feedback. |
| 📜 **Community Guidelines** | Clear rules for prayer content and platform usage. |
| 🔐 **Real email/password auth** | Firebase Auth login page to replace the stub registration |
| 🔍 **Search & Filters** | Search by keyword, filter by topic tag or geohash proximity |
| 📖 **Scripture recommendations** | AI-suggested Bible verses based on prayer sentiment |
| 🚨 **Crisis detection** | NLP to flag self-harm markers and surface resources |
| 🎖️ **Prayer streaks** | Gamification to encourage consistent intercession |
| 🎙️ **Voice-to-prayer** | Audio dictation and playback for accessibility |
