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

### 🛡️ Privacy, Localization & Moderation (Phase 4)
- **Privacy Levels** — choose between `Public` (discoverable), `Unlisted` (direct link only), and `Private` (owner only)
- **Multi-language Support** — Full UI localization for English, Indonesian, Spanish, French, German, Portuguese, and Korean
- **AI-Powered Moderation** — Automated detection of spam, ads, and suspicious patterns using Gemini 2.5 Flash
- **Admin Shield** — Secure dashboard with human review, **Traffic Flow (24h/7d/30d) analytics**, and abandoned session cleanup
- **Activity Tracking** — Global `lastSeenAt` tracking for all users to monitor platform health

### 📖 Personal Prayer Journaling (Phase 7)
- **Journal Timeline** — Add follow-up notes and journal entries to your prayers to track how God is moving over time.
- **Prayer Insights** — Statistics dashboard showing Answered Rate, Community Impact (intercessions received), and Consistency Streaks.
- **Tagging System** — Categorize prayers with hashtags (e.g., #Family, #Healing) and filter your dashboard by topic.
- **Premium PDF Export** — Elegant, printable serif-style journal export for personal records (replacing raw JSON data).

---

## Technical Details

### 🔐 AI Moderation Logic
Every prayer submission passes through a content analysis engine (`src/lib/moderation.ts`):
1. **Fast Pass**: Regex-based keyword matching with word boundaries to catch obvious spam while avoiding false positives (e.g., "product" vs "productive").
2. **Deep Pass**: Gemini 2.5 Flash analysis for semantic intent, multi-language support, and ambiguous patterns.
3. **Decision Types**:
    - **REJECT**: Commercial spam or explicit content.
    - **FLAG**: Suspicious patterns set to `Private` for admin review.
    - **ALLOW**: Clean prayers proceed with intended visibility.

### 🛡️ Admin Shield Dashboard
Accessible via a secret key stored in Firestore: `/admin/[secret-key]`.
- **Platform Insights**: Tri-column analytics showing Privacy Breakdown, Rolling Traffic Flow, and Core Health (Conversion & Stale Ratios).
- **Engagement Monitoring**: Real-time tracking of the "Intercession Rate" (Intercessions vs. Prayers).
- **Session Cleanup**: One-click detection and removal of "stale" sessions (inactive for 7+ days).

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, global TrafficTracker
│   ├── page.tsx                # Homepage: prayer form + global map
│   ├── discover/page.tsx       # Browse all prayers
│   ├── dashboard/
│   │   ├── page.tsx            # User's personal prayer history & insights
│   │   └── export/page.tsx     # Printable PDF-ready journal export
│   ├── p/[id]/page.tsx         # Individual prayer detail page (includes Journal)
│   ├── admin/[key]/page.tsx    # Admin Shield Hub (Insights & Moderation)
│   └── actions/
│       ├── admin.ts            # Admin-only actions (approve, delete, cleanup)
│       ├── auth.ts             # User registration + activity tracking
│       ├── prayer.ts           # Submit prayer + Add Follow-up
│       ├── intercede.ts        # "I Prayed" action
│       ├── owner.ts            # Edit + Mark as Answered
│       └── recovery.ts         # Session recovery logic
├── components/
│   ├── GlobalMap.tsx           # Homepage world map (MapLibre)
│   ├── JournalTimeline.tsx     # Chronological log for prayer updates (Owner only)
│   ├── IntercessionMap.tsx     # Per-prayer intercessor mini-map
│   ├── PrayerOwnerActions.tsx  # Owner-only edit and answered controls
│   └── ShareButton.tsx         # Web Share API / clipboard fallback
└── lib/
    ├── firebase/server.ts      # Firebase Admin SDK connection
    ├── moderation.ts           # NLP/Pattern-based moderation logic (Word boundary aware)
    ├── i18n.ts                 # Full UI localization (multi-language)
    └── geo.ts                  # Privacy-preserving geo-utilities
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

### Session Cleanup
Integrated tool available in the **Admin Shield**. It identifies and removes anonymous sessions with no prayer history and no intercessions that have been inactive for over 7 days.

---

## Roadmap / Future Phase Items

| Feature | Notes |
|---|---|
| 🔔 **Push Notifications (FCM)** | Notify users when someone prays for their request |
| 🔐 **Real email/password auth** | Optional Firebase Auth login to persist sessions across devices |
| 🔍 **Advanced Search** | Full-text search across all public prayers |
| 🚨 **Crisis detection** | NLP to flag emergency markers and surface resources |
| �️ **Marker clustering** | Optimization for high-traffic regions on the world map |
