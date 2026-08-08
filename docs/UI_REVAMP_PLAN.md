# Sahaja Yoga Telangana — UI/UX Revamp Master Plan

**Status:** Draft v1 — awaiting approval
**Scope:** Full-site design-system revamp + page-by-page redesign
**Aesthetic direction:** "Warm Editorial Serenity" — a modern temple of calm
**Motion:** Zero-dependency scroll-reveal system (IntersectionObserver + CSS), no new libraries
**Constraint:** All i18n keys (`t('...')`, inline `{ en, te }` objects), role-gating, and business logic must be preserved untouched.

---

## 0. Table of Contents

1. [Vision & Design Direction](#1-vision--design-direction)
2. [Design Tokens — Color](#2-design-tokens--color)
3. [Design Tokens — Typography](#3-design-tokens--typography)
4. [Design Tokens — Spacing, Radius, Shadow, Motion](#4-design-tokens--spacing-radius-shadow-motion)
5. [Core Components Revamp](#5-core-components-revamp)
6. [Motion System Spec](#6-motion-system-spec)
7. [Page-by-Page Revamp](#7-page-by-page-revamp)
8. [Asset Plan (dummy placeholders)](#8-asset-plan)
9. [Engineering Ratios — Reference Tables](#9-engineering-ratios--reference-tables)
10. [Implementation Order & Phases](#10-implementation-order--phases)
11. [QA Checklist](#11-qa-checklist)

---

## 1. Vision & Design Direction

### 1.1 The concept — "A modern temple of calm"

Sahaja Yoga is about **self-realization, silence, and union** — the site should *feel* like what it teaches. The current design is competent but generic: a brown-on-cream template with inconsistent radii, a fragmented system, and zero motion.

The revamp commits to one unforgettable quality: **the warmth of dawn light on ivory paper**. Every screen should feel hand-set, editorial, and quiet — like a beautifully typeset spiritual pamphlet, not a SaaS template.

### 1.2 Design principles (rule every decision)

| # | Principle | Meaning in UI terms |
|---|-----------|---------------------|
| 1 | **Quiet surfaces, one voice** | Near-white warm paper background; ink is espresso, never pure black; single bronze accent. |
| 2 | **Editorial type first** | Serif display headlines (Fraunces) + refined humanist body (Ysabeau). Eyebrows = tracked uppercase micro-labels. |
| 3 | **Generous negative space** | Section rhythm `clamp(96px, 12vh, 140px)`; never cram. Padding-first, not box-first. |
| 4 | **Measured structure** | Thin container guide-lines with corner ticks (subtle, pointer-events: none) give the "hand-measured" editorial feel. |
| 5 | **Motion with intent** | One masked headline reveal per section, staggered card entrances, slow parallax on hero imagery. Nothing bounces. |
| 6 | **Deep ratios, not decorations** | One spacing scale, one type scale, one radius token set — engineered, then applied everywhere. |

### 1.3 What we are NOT doing

- No purple gradients, no blue buttons, no `bg-black`, no generic shadows
- No new npm dependencies (no framer-motion/gsap — custom IO + CSS system instead)
- No restructuring of routes, data models, auth, or i18n
- No removing features (all pages keep every function/CTA)

---

## 2. Design Tokens — Color

### 2.1 Light theme (default)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#FBF7F0` | Page paper (warm ivory) |
| `--surface` | `#FFFFFF` | Cards, nav, footer |
| `--surface-2` | `#F5EFE6` | Alternating sections, inputs, hover |
| `--surface-3` | `#EDE4D6` | Chips, pressed states, subtle fills |
| `--ink` | `#292420` | Headlines & body (espresso, never `#000`) |
| `--ink-soft` | `#4A433C` | Secondary text |
| `--muted` | `#7A7168` | Body copy, meta |
| `--muted-light` | `#A39A90` | Captions, placeholder |
| `--primary` | `#6E5543` | Brand bronze-brown (CTAs, links, active states) |
| `--primary-600` | `#59433A` | Hover of primary |
| `--primary-700` | `#463529` | Pressed / deep accents |
| `--accent` | `#C29A5E` | Gold accent — hairlines, eyebrows, quote marks, highlights |
| `--accent-200` | `#F0E2C8` | Tint fills, glow washes |
| `--accent-300` | `#E3CDA6` | Slightly stronger tint |
| `--border` | `#E9E0D3` | Hairlines |
| `--border-strong` | `#D8CCBA` | Stronger borders, dividers on tinted bg |
| `--success` / `--danger` | `#5E7D54` / `#A44B3C` | Status (muted earth tones, no neon) |
| `--focus` | `#B98F56` | Focus ring (3px ring @ 24% opacity) |
| `--shadow-color` | `rgba(61, 46, 33, 0.10)` | All shadows derive from this one tint |

**Gradient recipes (used for hero washes, section tints):**
- `--wash-dawn`: `radial-gradient(120% 80% at 85% -10%, color-mix(in srgb, var(--accent-200) 65%, transparent), transparent 55%), linear-gradient(180deg, var(--surface), var(--bg))`
- `--wash-cream`: `linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)`
- Grain: fixed SVG noise overlay at 3–4% opacity on major sections (nav + hero), `pointer-events: none`.

### 2.2 Dark theme (refined espresso, not black)

| Token | Value |
|-------|-------|
| `--bg` | `#1E1916` |
| `--surface` | `#262019` |
| `--surface-2` | `#312A21` |
| `--surface-3` | `#3D352A` |
| `--ink` | `#F2EADA` |
| `--ink-soft` | `#D8CFC0` |
| `--muted` | `#B3A894` |
| `--primary` | `#C9A15F` (gold shifts to *the* accent in dark — buttons become gold) |
| `--primary-600` | `#D9B67E` |
| `--accent` | `#D9B67E` |
| `--border` | `#40372C` |
| `--shadow-color` | `rgba(0, 0, 0, 0.45)` |

**Dark-mode hard-fix list** (must be converted to vars): `TestimonialsSection` hardcoded cream gradients, `sahaja-yoga` `border-gray-100` cards, `AboutUs` hex cream/maroon, `corporate-register` `#f2d8c5` border.

---

## 3. Design Tokens — Typography

### 3.1 Font pairing

| Role | Font | Why |
|------|------|-----|
| Display (h1–h3, big numerals) | **Fraunces** (Google Font, `opsz`/`wght` axis, `soft` + `wonk` optional) | Warm, characterful old-style serif with optical sizing — instantly "editorial + spiritual", not a generic grotesque. |
| Body & UI | **Ysabeau** (already loaded) | Current humanist sans, keep for body/meta/buttons — pairs beautifully with Fraunces. |
| Telugu | `Noto Sans Telugu` (already loaded) | Unchanged; Telugu headings fall back to Ysabeau bold. |

**Implementation:** add `Fraunces` via `next/font/google` with `variable: '--font-display'`, weights `400;500;600;700`, `opsz` auto. Add to `tailwind.config.js` → `fontFamily.display: ['var(--font-display)', 'var(--font-sans)']`. Headline utility class `.font-display` used on all `h1/h2/h3`.

### 3.2 Type scale (modular 1.25, tuned by hand)

| Token | Size | Weight / Style | Usage |
|-------|------|----------------|-------|
| `--text-display` | `clamp(48px, 6vw, 76px)` | Fraunces 500, `-0.02em`, lh `1.05` | Hero h1 |
| `--text-h1` | `clamp(36px, 4.5vw, 56px)` | Fraunces 500, `-0.02em`, lh `1.1` | Page h1 |
| `--text-h2` | `clamp(28px, 3.4vw, 40px)` | Fraunces 500, `-0.015em`, lh `1.15` | Section titles |
| `--text-h3` | `clamp(21px, 2.2vw, 26px)` | Fraunces 500 / Ysabeau 600, lh `1.3` | Card titles |
| `--text-h4` | `18px` | Ysabeau 600 | Card/column titles |
| `--text-body` | `17px` (mobile `16.5px`) | Ysabeau 400, lh `1.75` | Paragraphs (down from 18.5px for elegance) |
| `--text-body-lg` | `19px` | lh `1.7` | Hero lead paragraphs |
| `--text-sm` | `14.5px` | lh `1.6` | Meta, cards |
| `--text-xs` | `13px` | lh `1.5` | Micro-labels |
| Eyebrow | `12px`, uppercase, `+0.24em` tracking, 600 | Ysabeau | Section eyebrows (single canonical value — kills the 5 competing trackings) |
| Numerals | `font-variant-numeric: lining-nums tabular-nums` | — | Stats, prices, times (already `.numeric-font`, keep) |

**Canonical global CSS overrides (globals.css):**
```css
p, li { font-size: var(--text-body); line-height: 1.75; }
h1 { font: var(--text-h1) var(--font-display); }
```
Keep `letter-spacing: -0.01em` on body. Remove the hardcoded `p, li { font-size: 1.25rem }` rule (too large) → replace with the token.

---

## 4. Design Tokens — Spacing, Radius, Shadow, Motion

### 4.1 Spacing scale (4px base — single source of truth)

`--space-1:4 · 2:8 · 3:12 · 4:16 · 5:20 · 6:24 · 7:32 · 8:40 · 9:48 · 10:64 · 11:80 · 12:96 · 13:128`

Section rhythm: `padding-block: clamp(88px, 11vh, 128px)` on light sections; `clamp(72px, 9vh, 104px)` on tinted/alternate sections.

Containers (explicit ratio engineering):
| Container | Max width | Usage |
|-----------|-----------|-------|
| `--container-page` | `1200px` | Default pages (max-w-6xl) |
| `--container-wide` | `1320px` | Events grid, admin |
| `--container-narrow` | `880px` | Forms, prose pages, testimonials |
| Gutter | `clamp(20px, 5vw, 48px)` | Side padding everywhere |

**Fix:** `shrine-container`, `max-container`, `padding-container` all converge onto `--container-page`.

### 4.2 Radius tokens (kills the 11-value fragmentation)

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `14px` | Inputs, chips, small tiles (replaces 8/10/12/14) |
| `--radius-md` | `20px` | Buttons secondary? No — buttons are pill. Cards compact, code blocks |
| `--radius-lg` | `24px` | Default card (replaces 16/18/20/22/24) |
| `--radius-xl` | `32px` | Feature cards, hero panels, large surfaces (replaces 26/28/30/32/36) |
| `--radius-pill` | `999px` | Buttons, badges, chips, search inputs, language toggle |

**Rule of thumb:** interactive = pill; data cards = `--radius-lg`; hero/section surfaces = `--radius-xl`; never `rounded-md/lg/xl/2xl` defaults.

### 4.3 Shadow tokens (layered, warm-tinted, non-blurry)

Replace `shadow-soft` (single 60px blur) with a 3-step layered system, all from `--shadow-color`:

| Token | Recipe (layered, like "beautiful-shadows" skill) |
|-------|---------------------------------------------------|
| `--shadow-sm` (compact cards, controls) | `0 1px 2px rgba(61,46,33,0.05), 0 0 0 1px color-mix(in srgb, var(--border) 90%, transparent)` |
| `--shadow-md` (default card lift) | `0 1px 2px -1px rgba(61,46,33,0.06), 0 4px 8px -2px rgba(61,46,33,0.06), 0 12px 24px -6px rgba(61,46,33,0.08), 0 0 0 1px var(--border)` |
| `--shadow-lg` (hero panels, modals, dropdowns) | `0 2px 4px -2px rgba(61,46,33,0.06), 0 8px 16px -4px rgba(61,46,33,0.08), 0 24px 48px -12px rgba(61,46,33,0.12), 0 0 0 1px var(--border)` |
| Hover lift | `translateY(-3px)` + shadow-md→lg, `transition 250ms` |

CSS classes: `.shadow-card`, `.shadow-panel`, `.shadow-pop` mapped to the above (keep `.shadow-soft` name as alias for `--shadow-md` so existing 90 usages degrade gracefully, then migrate).

### 4.4 Motion tokens

| Token | Value |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-ish settle) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--dur-fast` | `150ms` (hovers) |
| `--dur-base` | `250ms` (interactions) |
| `--dur-reveal` | `650ms` (entrances) |
| `--dur-hero` | `900ms` |
| Stagger | `60ms` per element (cards), `35ms` per word (headline masks) |
| Trigger | IntersectionObserver, `threshold: 0.15`, `rootMargin: 0px 0px -8% 0px`, play once |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → all reveals render static, no parallax |

---

## 5. Core Components Revamp

### 5.1 NavBar (`NavBar.tsx` + `layout.tsx` header)

**Current issues:** 74px generic white bar; rounded dropdowns with `shadow-[0_20px_60px...]` literal; sign-in is a plain outlined pill; no brand differentiation.

**New spec:**
- Height: `72px` desktop / `64px` mobile (fixed constant). Header bg: `color-mix(var(--surface) 86%, transparent)` + `backdrop-blur-xl` + hairline bottom border (always visible, shadow only after scroll — keep scroll JS).
- Logo: `logo-brown.svg` inside a small **lotus-crest mark**: keep image, wrap in `h-8`, add hover `opacity-90`.
- Nav links: `text-[15px] font-medium text-muted`, active page → `text-ink` + underline dot `w-1 h-1 rounded-full bg-accent` below; hover → ink + subtle bg `surface-2` rounded-full `px-4 py-2`.
- Dropdowns: `rounded-2xl` + `shadow-pop` + entrance animation (`scale .98→1, opacity 0→1, 180ms, transform-origin top`), items `rounded-xl` hover fill.
- Sign in: primary pill (`bg-primary text-white`) `h-11 px-6`; user chip unchanged structurally but `rounded-full border bg-surface shadow-sm`.
- Language + theme toggles: unify to `h-11 w-11 rounded-full` icon buttons inside one pill cluster.
- Mobile menu: full-height sheet (not dropdown), `rounded-t-3xl` bottom sheet style, stagger-fade items 40ms.

### 5.2 Footer (`Footer.tsx`)

**New spec:**
- Top: brand row — logo + 2-line description + socials (gold hover).
- `border-t` hairline separators between columns; column titles = eyebrow style (12px uppercase tracked); links `text-muted hover:text-ink hover:translate-x-0.5 transition` (subtle drift).
- Bottom bar: `© 2026 Sahaja Yoga Telangana` + privacy/delete-account links + "Made with ❤" removed.
- Add subtle top wash `--wash-cream` on footer bg instead of flat white.

### 5.3 Button (`Button.tsx`) → canonical `.btn` system

| Variant | Spec |
|---------|------|
| Primary | `bg-primary text-white`, hover `bg-primary-600`, `h-12 px-7`, pill, `shadow-card`, hover `-translate-y-0.5 shadow-md` |
| Secondary | `bg-surface border border-border-strong text-ink`, hover `bg-surface-2` |
| Ghost / link | `text-primary hover:text-primary-600` + arrow drift |
| Sizes | `h-11` (sm), `h-12` (md, default), `h-14 px-9 text-[16px]` (lg, hero CTAs) |
| Icon | 16px, `transition-transform group-hover:translate-x-1` on arrow |

Export shared class strings from `globals.css` utilities: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-lg`, `.btn-sm`, `.btn-ghost` so **all** pages (incl. `corporate-register`'s `#5B2C41` button and `magic-link`'s purple one) adopt them.

### 5.4 SectionTitle (`SectionTitle.tsx`)

- Eyebrow (12px tracked) + Fraunces h2 (`clamp(28-40px)`) + optional lead `text-body-lg muted`.
- Divider: replace `w-24 h-px` with a **16px gold rule + 8px diamond tick** (editorial flourish): `w-16 h-[2px] bg-accent` + rotated 45° 6px square centered.
- Add optional `align-left` prop (many sections currently fake left-alignment).

### 5.5 Cards (shared recipe)

```
surface = bg-[color:var(--surface)] border border-[color:var(--border)] rounded-[var(--radius-lg)]
padding: p-6 / p-8 (data) ; image cards: overflow-hidden + image aspect [16/10]
elevation: shadow-card; hover: -translate-y-1 + shadow-panel (only on interactive cards)
entrance: <Reveal> with stagger 60ms
```

### 5.6 Inputs (`admin-input` upgrade + `.field`)

- Radius `--radius-sm` (14px), `h-12` default, padding `0 16px`, bg `surface-2` at 60%, focus ring `0 0 0 3px color-mix(var(--focus) 24%, transparent)` + border `focus` color.
- Labels: 14px, 500 weight, `space-y-2` with field. Error: `danger` text + `border-danger/60`.
- All legacy inputs (`magic-link`, `forgot-password`, `corporate/school local Input`, `seeker-registration` 8px) migrate to `admin-input`.

### 5.7 Container guide-lines ("measured structure")

Utility `.guides` (from container-lines skill): two 1px vertical hairlines at container edges + 4px corner ticks at major section boundaries, `rgba(41,36,32,0.10)` (dark: `rgba(242,234,218,0.08)`), `pointer-events:none`, applied on `main` at page level only (home + long-form pages). Removed below `768px`.

### 5.8 Badges, chips, pills, tables, modals, empty states

- Badges (`admin-badge-*`): keep semantic colors but earth-tone them (green `#5E7D54`, yellow `#B38A3B`, red `#A44B3C`, blue `#5A6E93`, purple `#7A6A9C`).
- Chips: `h-9 px-4 rounded-full text-sm border`, selected = `bg-primary text-white`.
- Tables: header 12px uppercase tracked muted, row `border-t border-border`, hover `bg-surface-2/50`.
- Modals: `rounded-[var(--radius-xl)]` + `shadow-pop` + backdrop `bg-ink/40 backdrop-blur-sm` + scale/fade entrance; bottom sheets `rounded-t-[28px]`.

---

## 6. Motion System Spec

### 6.1 The `Reveal` component (`src/components/motion/Reveal.tsx` — NEW)

Zero-dependency. Wraps children; observes once; applies variant classes.

```tsx
type Variant = 'fade-up' | 'fade' | 'mask' | 'scale' | 'slide-left' | 'slide-right';
<Reveal variant="fade-up" delay={120} as="div" className="...">...</Reveal>
```

CSS keyframes (globals.css):
```css
[data-reveal] { opacity: 0; transition: opacity var(--dur-reveal) var(--ease-out), transform var(--dur-reveal) var(--ease-out); transition-delay: var(--reveal-delay, 0ms); }
[data-reveal].is-visible { opacity: 1; transform: none; }
[data-reveal="fade-up"] { transform: translateY(26px); }
[data-reveal="fade"] { transform: none; }
[data-reveal="scale"] { transform: scale(0.96); }
[data-reveal="slide-left"] { transform: translateX(-32px); }
[data-reveal="slide-right"] { transform: translateX(32px); }
@media (prefers-reduced-motion: reduce) { [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; } }
```
A tiny hook `useInView()` backs it; a `stagger` prop applies `transition-delay: i*60ms` to children with `data-stagger` class.

### 6.2 Masked headline reveal (`src/components/motion/MaskedReveal.tsx` — NEW)

For h1/h2: split text into `<span class="mask"><span class="word">` on mount (preserve i18n text, set `aria-label`), words translateY(110%) → 0, stagger 35ms, `--dur-hero`. Uses same `useInView` observer. Falls back to plain text when `prefers-reduced-motion` or SSR.

### 6.3 Parallax (`.parallax` — NEW)

`useInView`-based `transform: translateY(±24px)` with `transform: translateZ(0)` + `will-change: transform`, only applied while section in viewport, disabled under reduced motion. Used on: hero image, corporate bg image, features image. Strength `0.15` of scroll delta — implemented with a scroll listener + rAF throttle, or pure CSS `animation-timeline` fallback only if supported.

### 6.4 Count-up stats (`src/components/motion/CountUp.tsx` — NEW)

For impact numbers (300+, 50K+, 25+, 30+): rAF-driven easing counter over 1400ms when in view; suffix support; tabular-nums.

### 6.5 Marquee (`src/components/Marquee.tsx` — NEW)

Duplicated-track CSS marquee (`translateX 0 → -50%`, linear, 28s), edge-mask via `mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent)`, pause on hover. Used for: testimonial pull-quotes strip, chakra-word strip ("peace · silence · balance · stillness · love").

### 6.6 Page-load hero choreography (Home, all content pages)

Timeline (CSS animation-delay, `both` fill):
1. `0ms` — grain + wash fade in
2. `120ms` — eyebrow (fade-up 12px)
3. `240ms` — h1 masked reveal (words, 35ms stagger)
4. `520ms` — lead paragraph (fade-up)
5. `680ms` — CTA row (fade-up)
6. `760ms` — hero media (scale 0.98→1 + fade, 900ms)

### 6.7 Hover micro-interactions (global)

- Cards: `-translate-y-1`, shadow-md→panel, image `scale(1.04)` 500ms ease-out
- Pills: `-translate-y-0.5`, primary darkens, icon nudges
- Nav links: underline-dot fades in
- Socials: gold fill + slight scale

---

## 7. Page-by-Page Revamp

> Format per page: **Current state** → **Revamp spec** (layout, ratios, motion, assets). Every section uses `Reveal`; every h1/h2 uses `MaskedReveal` unless noted.

### 7.1 Home Page (`src/app/page.tsx` + `HomeClient.tsx`)

**Current:** 9 stacked sections with flat `<hr/>` separators, inconsistent rhythm, no motion, hardcoded testimonial gradients.

**New composition & ratios:**
1. **Hero** — full-bleed `--wash-dawn` + grain. Grid `lg:grid-cols-[1.05fr_0.95fr]`, `min-h-[88vh]` on desktop, vertical-center. Left: eyebrow → Fraunces h1 (clamp 48–76px) → lead → quote (floating `“` glyph in Fraunces, gold) → CTAs (`lg` primary + secondary). Right: **image in tall arch** — `rounded-t-[999px] rounded-b-[var(--radius-xl)]` (arch = temple motif, unforgettable), aspect `3/4`, border hairline, `parallax`, layered behind: offset gold `--accent-200` blob + thin ring circle (pure CSS). Quote + stat strip below CTAs: "300+ orgs · 50K+ yogis · 30+ years" with `CountUp`.
2. **LocalSeoSection** — convert to "Local presence" band: eyebrow + h2 + two pills. Add marquee strip of city names above/below (Hyderabad · Secunderabad · Warangal · Khammam … from `indian-districts.ts` neighbors) — fixes empty-feeling SEO text.
3. **VirtualTour** — panel `rounded-[var(--radius-xl)]`, 16:9 iframe with **cinematic border treatment** (`p-3 bg-surface-2` frame + hairline), play-time hint. Keep IDs (`#VirtualTour` anchor!) and `t('virtual.*')`.
4. **IntroButton (booklets)** — redesign as 3 **tile cards** (Hindi/English/Telugu) instead of 3 green pills: each = icon tile `h-14 w-14 rounded-2xl bg-accent-200` + title + download arrow; hover lift. Fix invalid `lg:py-50`.
5. **TestimonialsSection** — full dark-mode fix. Layout: eyebrow + h2 + "Share your experience" pill; featured testimonial `rounded-[32px]` with **grain + soft gold ring**; side cards `rounded-[var(--radius-lg)]`; replace `#b55d38 #d9a65d #7ea07d` bar with `linear-gradient(90deg, var(--accent), var(--primary), var(--accent))` at 2px height; quote mark in Fraunces gold. Keep 5s auto-advance + arrows.
6. **Camp (centers gallery)** — scroll-snap horizontal cards (keep horizontal scroll, add `snap-x snap-mandatory`, `scrollbar` styled 3px gold). Card = full-bleed image `h-[360px]` with bottom gradient + map pin + "Centers Near Me" pill. Add progress hint (fade edges).
7. **Guide (Shri Mataji + Corporate)** — Shri Mataji split: **arch-cropped portrait** (matches hero motif), gold ring; eyebrow + h2 + Know More. Corporate: replace flat `corporate-bg.svg` with **tinted panel**: bg image at `bg-cover` + `bg-primary-700/70` overlay, white text card overlapping `-mt-24` — fix contrast + add `parallax` on bg.
8. **Features (benefits)** — 4 cards on `lg:grid-cols-4` (not 2×2 beside one image) OR keep 2×2 but replace `boy-beach.svg` with real photo placeholder (`/assets/dummy/feature.jpg` → user replaces). Icon tiles: `h-14 w-14 rounded-2xl` gradient `accent-200→surface` with brown glyph, not filled green circles. Stagger 60ms.
9. **ContactUs** — split panel: left = contact info card (titles + phone/email + 2 program pills), right = form. Keep `#contact-us` anchor + `t('contact.*')`. Form inputs = `admin-input h-12`.

**Dummy assets needed:** `hero-arch.jpg` (Shri Mataji portrait, already exists → `Shri-Mataji-Nirmala-Devi-Lane-Cove-Sydney-X4.jpg` is portrait-ish; else use it), `feature-meditation.jpg` (replace boy-beach.svg), `center-1..3.jpg` (replace `pp1/2/3` if low quality).

### 7.2 Centers (`centers/page.tsx` + `CentersClient.tsx`)

**Current:** functional but flat list; `w-16` label columns; plain chips.

**Revamp:** hero header with `--wash-dawn` + eyebrow/h1/lead (masked). Search `h-12 rounded-full` with gold search icon. Zone chips = pill cluster `h-10 px-5`. Cards: `rounded-[var(--radius-lg)]` + image strip (16/9, center photo placeholder) + follow pill; day/time in `numeric-font`; "View details" arrow-drawer on hover. Stagger entrance 60ms. Empty state → friendly illustration + "Be the first" CTA.

### 7.3 Events (`events/page.tsx`, `Events.tsx`, `EventCard.tsx`, `register-event/[id]`, `download-receipt`)

- Hero card → full hero band (gradient wash + masked h1). Grid stays `xl:grid-cols-3` (remove 2xl:grid-cols-4 — cards too cramped at 1320px; ratio engineering).
- EventCard: image `aspect-[16/10]`, type pill gold-outline, date pill `bg-surface-2`, hover image zoom + lift; body `p-6`; CTA row split: date-left, arrow-right. Fix `hover:shadow-[0_22px_55px...]` → `shadow-panel`.
- Subscription form → inline card `rounded-[var(--radius-lg)]` with email `h-12` + gold pill.
- `register-event/[id]`: migrate `#8A1457`/`#F1E2CE` hardcoded to tokens; `rounded-[18px]` → tokens; keep multi-section panels; QR panel gets gold border + `shadow-panel`.
- `download-receipt`: swap hexes to tokens (maroon → `var(--primary-700)`).

### 7.4 Meditate (`meditate/page.tsx`)

Already the most polished page (gradient cards, step badges, `heroButtonVariants`). **Revamp:** unify `rounded-[28/32/36px]` → tokens; add `MaskedReveal` on h1/h2; step cards get numbered gold ring + connector line; hero image arch-crop to match motif; convert `heroButtonVariants` to `.btn` classes. Keep `JourneyHubEntry` + `DailyTalkOfTheDay`.

### 7.5 Shri Mataji (`shri-mataji/page.tsx`)

**Current:** plain stacked text page, no hero.

**Revamp:** editorial hero (eyebrow + Fraunces h1 + quote mark) + `guides` container lines; portrait arch-crop; sections become alternating two-col grid with `Reveal slide-left/right`; h2s get 16px gold rule; pull-quote centerpiece `text-2xl Fraunces italic` with giant quote glyph. Keep all copy.

### 7.6 Sahaja Yoga (`sahaja-yoga/page.tsx`)

Fix `border-gray-100` → `border-border`; benefits cards `rounded-[var(--radius-lg)]` + icon tiles; CTA band `bg-primary` with white text + gold pill at `pb-32`; science section gets subtle wash bg. YouTube panel keeps `rounded-3xl` frame treatment.

### 7.7 Meditation Hyderabad (`meditation-hyderabad/page.tsx`)

Hero + 3 cards + FAQ + explore card. FAQ → **accordion** (details/summary styled, `rounded-[var(--radius-lg)]`, plus-icon rotation) — big usability win; h2 masked; explore pills as card grid 2-col.

### 7.8 Contact (`contact-us/page.tsx` + `ContactUs.tsx`)

Split panel: left info (card, contact rows, program pills), right form card. Inputs `admin-input`. Success state: gold check circle + Fraunces "Thank you" + fade. Keep `t('contact.*')` keys.

### 7.9 Auth pages — Login (`login/SignInOne.tsx`), Register, Magic Link, Forgot Password

**Current:** login/register share a decent split layout but inline input classes; magic-link = purple legacy; forgot-password = black button.

**Revamp (unified "sanctum" template):**
- Full-bleed left panel: `pune.jpeg` (or dummy `auth-side.jpg`) with **espresso gradient + grain** + centered white Fraunces quote + site logo; parallax-slow on the image.
- Right panel: `max-w-[420px]` centered, eyebrow ("Welcome back" / "Begin the journey"), Fraunces h1, form fields `admin-input h-12`, submit `.btn btn-primary w-full h-13`.
- **Magic-link & forgot-password**: rebuild into the same sanctum template (kill purple/black/`react-toastify` inline styles; move to `react-hot-toast` already global or inline success states).
- Keep: Google button (brand hexes OK, but pill-ify), `homePractice` anti-spam, Levenshtein logic, all auth flows.

### 7.10 Dashboard (`dashboard/page.tsx` + `YogiDashboardShell.tsx`)

- Shell: sidebar `w-72`, `rounded-[var(--radius-lg)]`, active item = `bg-surface-2` + **gold left notch** (`before` 3px accent bar); mobile bottom-nav keep but pill-ify.
- Hero card: greeting in Fraunces ("Namaste, {name}" — keep i18n), gradient wash.
- Metric cards: `rounded-[var(--radius-lg)]`, value `text-4xl Fraunces` + `CountUp`, delta arrows muted green/red.
- Profile form: `admin-input` (already), CityPicker.
- FAB: replace inline boxShadow with `shadow-panel`.
- Bottom sheet: `rounded-t-[28px]` + backdrop blur.

### 7.11 Add Seeker (`add-seeker/page.tsx`) + upload + scan pages

- Keep `YogiDashboardShell`; header cards `rounded-[var(--radius-xl)]`; status banners: earth-tone (`success`/`danger` tints at 10%, borders at 25%).
- Entry cards `rounded-[var(--radius-lg)]`; chips pill; `admin-input`.
- Upload/scan modals: `rounded-[var(--radius-xl)]`, `shadow-pop`, gold focus on camera/CSV drop zones.

### 7.12 Volunteer (`volunteer/page.tsx`)

- Refer-a-Yogi card: gold icon tile; invite link row with copy pill (works already); history rows with status dots (`success` green / `zinc-400` → `muted`).
- Fix undefined `animate-fadeIn` → `animate-fade-in`. Interest form via `admin-input`.

### 7.13 Corporate Register & School Programs (`corporate-register`, `school-programs`)

**Highest-priority cleanup:** hardcoded `#5B2C41` buttons, `#f2d8c5` border, `border-gray-300` inputs, non-token radii.
- Map to: hero wash + masked h1; benefits cards `rounded-[var(--radius-lg)]` with gold icon tiles; customized section `bg-surface-2` + `border-border-strong`; form `max-w-4xl` card `rounded-[var(--radius-xl)]`; inputs `admin-input`; submit `.btn btn-primary btn-lg w-full` + datepicker themed (already themed in globals).

### 7.14 Seeker Registration (`seeker-registration/page.tsx`)

Migrate the **8px radius system** → `admin-input` + tokens. Keep sticky left aside; add event-chip + countdown pill; consent card `rounded-[var(--radius-lg)]`; status banners earth-tone.

### 7.15 Journey Hub (`start-your-journey`, `JourneyHubPage.tsx`, `JourneyHubEntry.tsx`)

- Entry banner: gradient panel already on-brand; add masked h2 + CTA pill; auto-open modal → `rounded-[var(--radius-xl)]` + blur backdrop + gold gradient header (fix hardcoded rgba shadows → tokens).
- Wizard: step indicators gold ring on active; `ChoiceButton` `rounded-[var(--radius-md)]` with check on select; question panel `Reveal` per step; rail cards consistent.

### 7.16 Share Experience (`share-your-experience/page.tsx` + `ExperienceForm.tsx`)

Keep gradient hero card; `admin-input` fields; textarea `min-h-[160px]`; success state with gold check + Fraunces heading.

### 7.17 Admin (`admin/dashboard/page.tsx` + admin pages)

- Keep `admin-card`/`admin-sidebar` but: stat cards `CountUp`; menu cards hover gold icon glow; tables keep `admin-table` (already good). Not a focus — light-touch only (tokens + motion) since admin is functional-first.

### 7.18 Invite page (`invite/[token]/page.tsx`), Events public pages, misc

- Invite landing: center card `rounded-[var(--radius-xl)]` + state-aware icons (gold check / neutral hourglass / red for used); keep all states (loading/not_found/used/already_volunteer/success/ready).
- `EventBanner`: keep marquee-ish banner but use `--accent-200` bg + ink text instead of `--primary` white (calmer); fix any literal shadows.
- `events/[id]`-equivalent (`register-event/[id]`): covered in 7.3.

---

## 8. Asset Plan

Strategy: **generate elegant dummy SVG placeholders** in `public/assets/dummy/` that ship the final look; user swaps in real photos later (same filenames → zero code changes).

| Asset | Type | Size/ratio | Used by |
|-------|------|-----------|---------|
| `dummy/hero-arch.jpg` | Portrait photo placeholder (warm gradient + lotus silhouette) | 3:4 arch | Home hero |
| `dummy/feature-meditation.jpg` | Wide photo placeholder | 4:5 | Features |
| `dummy/center-1..3.jpg` | Center interior placeholders | 16:9 | Centers cards, Camp |
| `dummy/shri-mataji-arch.jpg` | Portrait placeholder | 3:4 arch | Guide, Shri Mataji page |
| `dummy/auth-side.jpg` | Split-screen side image | 1:1.2 | Login/Register/Magic/Forgot |
| `dummy/event-fallback.jpg` | Event card fallback | 16:10 | EventCard |
| `dummy/og-default.jpg` | OG fallback | 1200×630 | seo metadata |
| `dummy/quote-marquee` | n/a (text marquee, no asset) | — | Testimonials strip |

Each dummy: warm `#F0E2C8→#C29A5E` diagonal gradient + soft grain + centered Fraunces glyph (lotus ॐ / Om symbol) — on-brand and clearly a placeholder. Also remove unused legacy assets later (`GetApp`, `VideoSection` deps).

---

## 9. Engineering Ratios — Reference Tables

### 9.1 Component heights (fixed constants)
| Component | Height |
|-----------|--------|
| Nav (desktop / mobile) | 72 / 64 |
| Button sm / md / lg | 44 / 48 / 56 |
| Input / select / CityPicker | 48 |
| Textarea | 48 min, 160 preferred |
| Chips / pills (filter) | 36–40 |
| Badges | 24–28 |
| Icon tile (card header) | 48–56 (14px icons at 24) |
| Metric value | 36–40 (Fraunces) |
| Card image strips | 16/9 → 180px @ 320w card |

### 9.2 Type rhythm (baseline 4px)
| Line | Size | Line-height | Margin-bottom |
|------|------|------------|---------------|
| H1 (page) | clamp(36–56) | 1.1 | 24 |
| H2 (section) | clamp(28–40) | 1.15 | 20 |
| H3 (card) | 21–26 | 1.3 | 12 |
| Body | 17 | 1.75 | 16 |
| Lead | 19 | 1.7 | 24 |
| Eyebrow | 12 (tracked) | 1.5 | 16 |

### 9.3 Grids & gutters
| Context | Columns | Gap |
|---------|---------|-----|
| Page | 12 @ 1200px | 24 (mobile 16) |
| Cards (events/centers) | 3 @ ≥1100px, 2 @ 700–1099, 1 @ <700 | 24 |
| Features | 2×2 ≥900px | 32 |
| Forms | 1 @ ≤600, 2 @ >600 | 24 |
| Hero | asymmetric 1.05 / 0.95 | 64 |

### 9.4 Section rhythm
| Section type | Padding-block |
|--------------|---------------|
| Default | `clamp(88px, 11vh, 128px)` |
| Tinted/alt | `clamp(72px, 9vh, 104px)` |
| Hero | `clamp(96px, 14vh, 160px)` |
| Band/marquee | `36px` |

---

## 10. Implementation Order & Phases

> Each phase is independently shippable + reviewable (matches "broken into page by page").

| Phase | Scope | Deliverables |
|-------|-------|--------------|
| **P0 — Foundation** | globals.css tokens (color/type/space/radius/shadow/motion), tailwind.config (Fraunces, display font), layout.tsx (grain + guides), motion primitives (`Reveal`, `MaskedReveal`, `CountUp`, `Marquee`, `Parallax`), `.btn`/`.admin-input`/`.shadow-*` utilities | Build green; no page regressions |
| **P1 — Shell** | NavBar, Footer, mobile menu, language/theme toggles, page-load hero choreography on home | Nav/Footer rebuilt |
| **P2 — Home** | Hero, LocalSeo+marquee, VirtualTour, IntroButton, Testimonials, Camp, Guide, Features, ContactUs | Home fully revamped |
| **P3 — Marketing pages** | Meditate, Sahaja Yoga, Shri Mataji, Meditation Hyderabad, Events + EventCard, Centers, Contact page | Content pages |
| **P4 — Forms & auth** | Login, Register, Magic Link, Forgot Password (sanctum template), Seeker Registration, Corporate, School | All forms unified |
| **P5 — Dashboard suite** | Dashboard shell, Add Seeker, Volunteer, Share Experience, Journey Hub, invite page | Auth'd suite |
| **P6 — Admin + polish** | Admin dashboard light-touch, register-event/[id], download-receipt, dummy assets, dead-code cleanup (GetApp/VideoSection/AboutUs if unused), dark-mode sweep | Final QA |

**Per-page task template** (paste into new task when executing):
```
## Page: <route>
### Current issues
### Target layout (with ratios)
### Motion spec (reveal/parallax/stagger)
### Token migrations (radius/shadow/color)
### Assets (dummy or existing)
### Verification: build + visual check at 375/768/1440, light+dark, en+te
```

---

## 11. QA Checklist

- [ ] `npx next build 2>&1 | tail -40` clean (only pre-existing warnings)
- [ ] No hardcoded hex colors remain in UI components (grep `#[0-9A-Fa-f]{6}` excluding SVG/icons/email templates)
- [ ] No `border-gray-*`, `bg-blue-*`, `bg-purple-*` in src/app + src/components
- [ ] Radius tokens only (`--radius-*`, `rounded-full`) in new/edited pages
- [ ] All 4 breakpoints (375 / 768 / 1024 / 1440) checked on every revamped page
- [ ] Light + dark theme both pass on TestimonialsSection, saahaja-yoga, corporate/school
- [ ] `prefers-reduced-motion` → all content visible, no motion
- [ ] Telugu locale renders (headings may fall back to Ysabeau — acceptable, note it)
- [ ] Every pre-existing anchor (`#VirtualTour`, `#contact-us`), i18n key, role-gate, and API call intact
- [ ] Lighthouse pass on home (a11y ≥ 95, best-practices ≥ 95)
- [ ] Buttons/links have visible focus rings (gold 3px @ 24%)

---

*This document is the source of truth. Individual page tasks can be sliced from Section 7 — each subsection is self-contained (issues → spec → tokens → assets → verify).*
