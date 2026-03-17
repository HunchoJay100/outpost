# THE MEDIUM — Full Project Context

## What This Is
A content command center for managing content creation, storage, and deployment across 5 companies simultaneously. Replaces scattered Google Drive folders and context-less Claude conversations with a unified system where every brand's voice, assets, and content live in one place.

Previously called OUTPOST — now rebranded as **The Medium**.

---

## Design Direction — APPROVED
**Inspired by:** [known.is](https://known.is) + [riot.nyc](https://riot.nyc)

Dark editorial aesthetic. Corporate-luxury. Forward-thinking NYC agency feel.

- **Background:** Dark (#0a0a0a), NOT sci-fi/neon/Tron
- **Typography:** Oswald (bold condensed headlines), Libre Baskerville (italic editorial accents), Oxygen Mono (system/HUD text)
- **Accent Color:** `#f6462b` (red-orange, same as Riot NYC)
- **Layout:** Massive whitespace, horizontal brand list, full-bleed hero, Swiss grid principles
- **Vibe:** Restraint, precision, expensive because it doesn't try too hard
- **Grain overlay**, side markers, blurred glass nav bar, scroll reveal animations
- **Reference file:** `the-medium-v2.html` in the repo — this is the approved mockup

### What We Tried and Killed
- Tron Ares aesthetic (neon edges, perspective grids, light beams) — looked like a video game, not a professional tool
- Orbitron font — too 8-bit/retro
- Multiple brand colors on the home screen — broke visual cohesion
- Exo 2 font — awful
- Light/editorial theme (first Medium attempt) — too boring/generic

---

## The Five Companies

### 1. Flynn Development / Modern Development Co. (FLAGSHIP)
- **Phone:** 931-510-6147 | **Website:** moderndevelopment.co
- **Services:** Custom homes, barndominiums, renovations and additions, commercial construction
- **Target Audience:** Homeowners and families in Middle Tennessee planning to build or renovate
- **Geographic Focus:** Upper Cumberland, Middle Tennessee, Cookeville, the 931
- **Tone:** Confident, process-forward, community rooted, warm but never soft, premium without arrogance
- **Hard Rules:**
  - No em dashes or hyphens mid sentence
  - No two word or fragmented sentences
  - Full flowing sentences with natural rhythm
  - Never use the phrase "coming to life"
  - Never toot your own horn or claim to be the best — let the work speak
  - No contractor clichés
  - No desperation language or discount language
  - Never say "we take that seriously" or "we don't take that lightly"
  - Never say "transformative," "innovative," "cutting-edge," or "game-changing"
  - Do not write emotionally manipulative or cheesy copy
  - Two solid paragraphs is the ideal post structure
  - Confident but never arrogant
- **CTA Style:** Soft and inviting. Never pushy. Always end with phone number and website.
- **15 Pre-loaded Spring Campaign 2026 Captions:** See SPRING CAMPAIGN 2026.pdf
  - 5 Barndominium posts (Project Spotlight)
  - 2 Outdoor posts (Project Spotlight)
  - 5 Custom Home posts (Lead Gen)
  - 3 Addition/Renovation posts (Lead Gen)

### 2. Middle TN Metals
- **Phone:** 931-510-6147 | **Website:** moderndevelopment.co
- **Services:** Barndominium design and construction exclusively
- **Tone:** Identical to Flynn Development
- **Hard Rules:** All the same as Flynn Development. Barndominium focused exclusively.
- **Brand Colors:** Dark green + metal grey

### 3. Modern Roofing Group
- **Phone:** 931-400-8788
- **Services:** Residential, commercial, and industrial roofing across Middle Tennessee
- **Tone:** Measured and grounded. Process-forward. Short punchy paragraphs. Roofing at scale.
- **Key Sales Reps:** Derick Bryant, Justin Buchanan, Connor Buis, Grant
- **Brand Colors:** Slate grey + deep red

### 4. Complete Crete Coatings
- **Phone:** TBD
- **Services:** Epoxy, polyaspartic, Spartacote, UV stable products, garage flake broadcast systems, stain and seal, pool decks, commercial and industrial floor systems
- **Tone:** Same voice family as Modern Development. Educates without being condescending.
- **Brand Colors:** Charcoal/slate + yellow

### 5. Blue Collar Hustle
- **Platform Focus:** TikTok primarily, Facebook secondary
- **Target:** Contractors, tradespeople, small business owners in the trades
- **Tone:** Raw, direct, zero corporate language. Personal platform — sounds like a real person, not a brand.
- **Hard Rules:** Short punchy sentences. No fluff. No motivational poster language. Bold contrarian takes encouraged. Never sounds polished even when it is.
- **CTA Style:** Direct. No soft sells. Straight to the point.
- **Brand Colors:** Black, white, navy

---

## Tech Stack
- **Framework:** Next.js + React + TypeScript + Tailwind CSS + Framer Motion
- **Data:** localStorage for text (captions, brand settings, posts) + IndexedDB for media (photos/videos)
- **AI Generator:** Anthropic API (claude-sonnet-4-20250514) — mocked until API key is ready
- **Location:** `~/outpost/`
- **GitHub:** https://github.com/HunchoJay100/outpost (private)
- **Deploy:** Vercel when ready for team access

---

## Project Structure
```
~/outpost/
├── .env.local                    # (future) ANTHROPIC_API_KEY
├── the-medium-v2.html            # APPROVED design mockup
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home — brand selector
│   │   ├── globals.css           # Tailwind + custom styles
│   │   ├── dashboard/page.tsx    # Master Dashboard
│   │   └── outpost/[companySlug]/
│   │       ├── layout.tsx        # Brand-themed workspace layout
│   │       ├── page.tsx          # Workspace overview
│   │       ├── captions/page.tsx # Caption Library
│   │       ├── media/page.tsx    # Media Vault
│   │       ├── builder/page.tsx  # Post Builder
│   │       └── settings/page.tsx # Brand Settings
│   ├── components/
│   ├── lib/
│   │   ├── storage.ts            # localStorage helpers
│   │   ├── companies.ts          # 5 company configs
│   │   ├── seed.ts               # Pre-loaded data
│   │   ├── theme.ts              # Dynamic theming
│   │   └── ai.ts                 # AI system prompt builder + mock
│   ├── hooks/
│   └── types/index.ts
```

---

## Data Model
- **PostType:** Lead Gen | Brand Awareness | Recruitment | Project Spotlight | Before & After | Educational | Team/BTS | Client Story
- **PostStatus:** Draft | Ready | Scheduled
- **BrandSettings:** name, phone, website, services, audience, geoFocus, tone, hardRules, bannedPhrases, ctaStyle, exampleCaptions
- **Caption:** id, companySlug, text, postType, tags, archived, timestamps
- **MediaItem:** id, companySlug, fileName, fileType, projectName, tags (blobs in IndexedDB)
- **Post:** id, companySlug, captionId, mediaIds, postType, notes, status, timestamps

---

## Build Phases

### Phase 1 — Home Screen ✅ (needs reskin to Medium aesthetic)
### Phase 2 — Workspace Layout + Brand Settings ✅ (needs reskin)
### Phase 3 — Caption Library (next up)
### Phase 4 — AI Generator (mocked)
### Phase 5 — Media Vault
### Phase 6 — Post Builder
### Phase 7 — Master Dashboard

---

## Core Features Per Workspace

**Caption Library** — Scrollable library of saved captions tagged by post type. One-tap copy. Add, edit, archive, delete. AI Generate button opens modal → 3 on-brand options.

**Media Vault** — Photo/video upload, project-based organization, multi-select, grid layout. IndexedDB storage.

**Post Builder** — Select media + caption, tag post type, add notes, mark status (Draft/Ready/Scheduled), saves to queue.

**Brand Settings** — Full editable voice profile that feeds the AI generator. Accordion sections for Identity, Audience, Voice, Rules, Example Captions.

**AI Generator** — Operator describes post in plain language → system prompt built dynamically from Brand Settings → 3 caption options returned. Each with copy + save to library.

**Master Dashboard** — Unified view across all 5 companies. Filter by company, post type, status.

---

## Key Decisions
- Build locally first, push to GitHub, deploy to Vercel when ready
- 30K token limit per build chunk — one phase at a time, test each
- Home screen uses unified accent color, brand colors only inside workspaces
- No Anthropic API key yet — AI generator is mocked with realistic placeholder responses

---

*Built by Chief. Spring 2026.*
