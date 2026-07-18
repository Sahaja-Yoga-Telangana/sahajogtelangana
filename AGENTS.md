# SahajaYogaOdisha — Project Context

## Tech Stack
- Next.js (App Router, pages under `src/app/(auth)/` for authenticated routes)
- MongoDB via Mongoose (`src/models/`)
- NextAuth.js v4 for authentication
- Tailwind CSS with CSS variables (`--ink`, `--muted`, `--primary`, `--surface`, `--border`, `--bg`)
- Utility class `admin-input` for all form inputs (rounded, bordered, themed)
- No component library (no shadcn/ui, MUI, etc.)
- `react-hot-toast` for notifications
- `swr` for data fetching
- `axios` for HTTP calls
- `react-icons/fi` (Feather icons)

## Role System
| Role | Description |
|------|-------------|
| `Yogi` | Basic authenticated user |
| `Volunteer` | Can add seekers, access dashboard |
| `Admin` | Full access, admin panel |

### Access Control
- `hasFeatureAccess()` in `src/types/index.ts` checks roles (case-insensitive)
- Middleware at `src/middleware.ts` protects `/add-seeker` and `/dashboard/*` for Yogi/Volunteer/Admin
- `YogiDashboardShell` sidebar filters nav items by role

## City / District System (New)
### Dataset
- File: `src/data/indian-districts.ts`
- 795 entries covering all Indian districts
- Each entry: `{ name, state, zone, neighboringStates }`
- Zones: North, South, East, West, Central, NorthEast

### CityPicker Component
- File: `src/components/CityPicker.tsx`
- Searchable dropdown, filters by city name or state
- Keyboard navigation (arrows, Enter, Escape)
- Click-outside to close
- Props: `value`, `onChange`, `placeholder`, `required`, `className`, `error`

### Forms updated to use CityPicker
| Route | Page |
|-------|------|
| `/volunteer` | Volunteer interest form |
| `/seeker-registration` | Public seeker registration |
| `/add-seeker` | Authenticated manual batch entry |
| `/add-seeker/upload` | CSV/PDF import with edit modal |
| `/add-seeker/scan` | Camera OCR scan with edit modal |
| `/dashboard` | User profile edit |
| `/corporate-register` | Corporate program registration |
| `/school-programs` | School program registration |
| `/admin/add-center` | Add/edit meditation center |
| `/admin/volunteers` | Add/edit volunteer |
| `/experience` | Share experience form |

## Volunteer Invite System (New)
One-time referral links for existing volunteers to onboard other registered users.

### Flow
1. **Existing Volunteer** goes to `/volunteer` → clicks "Generate Invite Link"
2. System creates unique 48-byte hex token → returns `https://site.com/invite/<token>`
3. Volunteer shares link via WhatsApp or anywhere
4. **Friend** (already registered user, role `"User"`) clicks link
5. `/invite/[token]` page checks auth, validates token, shows accept button
6. On accept: `User.role` → `"Volunteer"`, `VolunteerProfile` created, token marked `"used"`
7. Link is dead — one-time use only

### Files
| File | Purpose |
|------|---------|
| `src/models/VolunteerInvite.ts` | Mongoose schema (`token`, `createdBy`, `status`, `usedByEmail`, `usedAt`) |
| `src/app/api/volunteer-invites/route.ts` | `GET` (list) + `POST` (generate) — volunteer-only |
| `src/app/api/volunteer-invites/[token]/route.ts` | `GET` (validate) + `POST` (accept) |
| `src/app/invite/[token]/page.tsx` | Public landing page with states: loading / not_found / used / already_volunteer / success / ready |

### Volunteer Page (`/volunteer`)
- **If user is Volunteer/Admin**: Shows "Refer a Friend" section (generate link, copy, invite history) at top + profile form below
- **If user is "User"**: Shows existing volunteer interest form only

### Admin Approve Fix
Admin approving a volunteer request now also updates `User.role` → `"Volunteer"` (previously only created `VolunteerProfile`).

## Import Aliases
- `@/*` → `./src/*` (configured in `tsconfig.json` paths)

## Key Patterns
- Forms use plain React `useState` with custom `onChange` handlers (no react-hook-form)
- Each page with form has a local `Field` or `Input` wrapper component at the bottom
- CSS variables for theming: `var(--ink)`, `var(--muted)`, `var(--primary)`, `var(--surface)`, `var(--border)`, `var(--bg)`
- `admin-input` class for standard input styling
- `admin-btn-primary` class for primary buttons
- `rounded-[28px]` or `rounded-[32px]` for card containers

## Build / Run
```bash
npm run dev        # Development
npx next build     # Production build
npx next build 2>&1 | tail -40  # Build with error checking
```

## Pre-existing Build Warnings (safe to ignore)
- `/api/auth/mobile-session` dynamic server error (uses `request.cookies`)
- `/_error` page not found (Next.js internal)
