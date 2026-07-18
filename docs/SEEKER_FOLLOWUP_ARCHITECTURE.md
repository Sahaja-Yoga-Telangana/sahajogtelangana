# Seeker Follow-Up System: Engineering Design Document

> **Author:** System Architecture Review  
> **Date:** 2026-07-18  
> **Status:** Approved Design — Ready for Implementation  
> **Applies to:** SahajaYogaTelangana_APP (Expo) + SahajaYogaOdisha (Next.js Website)

---

## Table of Contents

1. [Current System Analysis](#1-current-system-analysis)
2. [Proposed Architecture](#2-proposed-architecture)
3. [Database Schema (Proposed Changes)](#3-database-schema-proposed-changes)
4. [State Machine Design](#4-state-machine-design)
5. [Assignment Algorithm](#5-assignment-algorithm)
6. [API Design](#6-api-design)
7. [Queue Management](#7-queue-management)
8. [Language Management](#8-language-management)
9. [Concurrency and Race Conditions](#9-concurrency-and-race-conditions)
10. [UI/UX Design](#10-uiux-design)
11. [Edge Cases](#11-edge-cases)
12. [Migration Plan](#12-migration-plan)
13. [Rollout Strategy](#13-rollout-strategy)
14. [Testing Strategy](#14-testing-strategy)
15. [Future Scalability Considerations](#15-future-scalability-considerations)
16. [Risks and Mitigations](#16-risks-and-mitigations)
17. [Open Questions / Assumptions](#17-open-questions--assumptions)
18. [Summary of Recommendations](#18-summary-of-recommendations)
19. [Appendix: Sequence Diagram — Fetch Flow](#19-appendix-sequence-diagram--fetch-flow)
20. [Appendix: State Diagram — Seeker Lifecycle](#20-appendix-state-diagram--seeker-lifecycle)

---

## 1. Current System Analysis

### 1.1 Database Schema (Current)

**Seeker Model** (`Seeker.ts` — 182 lines)

| Field | Type | Problem |
|-------|------|---------|
| `name` | String | OK |
| `city` | String (free text) | "Hyderabad", "HYDERABAD", "Hyderabad, Telangana" — inconsistent |
| `phone` | String | OK |
| `email` | String | OK |
| `addedBy` | String | OK |
| `preferredLanguage` | String (free text) | "Hindi", "hindi", "HINDI", "Hindi." — all different. Matching broken. |
| `followUpStatus` | String (free text) | No standardization. "New", "Contacted", "scheduled", etc. |
| `assignedVolunteer` | String (by **name**, not ID) | Breaks if two volunteers share a name or a volunteer changes display name. No referential integrity. |
| `volunteerFollowUpCompletedAt` | Date | Should be on Assignment, not Seeker |
| `volunteerFollowUpCompletedBy` | String (by name) | Same fragility as assignedVolunteer |
| `lastContactDate` | Date | OK |
| `notes` | String | OK |
| `journeySessionId` | ObjectId ref | OK |

**VolunteerProfile Model** (`VolunteerProfile.ts` — 63 lines)

| Field | Type | Problem |
|-------|------|---------|
| `name` | String | OK |
| `email` | String (unique) | OK |
| `phone` | String | OK |
| `city` | String (free text) | Cannot do reliable geo matching |
| `roles` | String[] | Used for follow-up access check via brittle substring match |
| `assignments` | String[] | Organizational labels, not assignment tracking |
| `staffingFocus` | String | Used in access check — brittle |
| `isActive` | Boolean | OK |
| **No `userId` field** | — | Cannot link to User collection reliably |
| **No `preferredLanguage` field** | — | Language-based matching impossible |
| **No `district`/`state`/`zone`** | — | Cannot use Indian districts dataset |

### 1.2 Current Assignment Algorithm

Lives in `yogi-seeker-followups/route.ts`. Exact behavior:

```
POST /api/yogi-seeker-followups:
  1. Load VolunteerProfile by email
  2. Check hasFollowUpAccess() — scans roles[] and staffingFocus for substring "follow"
  3. Count active seekers assigned to this volunteer (volunteerFollowUpCompletedAt is null/missing)
  4. If activeCount > 0 → return existing batch, block new fetch
  5. Loop 4 times:
     a. findOneAndUpdate where assignedVolunteer = '' or missing,
        AND followUpStatus IN ['New', '', null]
     b. $set: assignedVolunteer = volunteer.name, followUpStatus = 'New'
     c. $unset: volunteerFollowUpCompletedAt, volunteerFollowUpCompletedBy
     d. Sort by addedAt ASC (FIFO)
  6. Return claimed seekers
```

**Weaknesses:**

1. **No language matching** — Telugu-speaking volunteers get Hindi-speaking seekers.
2. **No location matching** — A volunteer in Mumbai gets a seeker in Chennai.
3. **Race condition in the loop** — Between iterations, another volunteer can claim the same seeker. Each `findOneAndUpdate` is atomic, but state changes between iterations.
4. **Duplicates across volunteers** — Allocation is non-deterministic based on timing.
5. **No priority** — All seekers treated equally regardless of language match, city match, wait time.
6. **No maximum queue enforcement** — Correctly blocks new fetch if any active seeker exists, but no partial refill support.
7. **Brittle role check** — Substring match on "follow" in roles/staffingFocus.
8. **Crash-only error handling** — No transaction rollback. If loop claims 2 seekers then crashes, those 2 are orphaned.
9. **No assignment expiry** — A volunteer can hold 4 seekers indefinitely.

### 1.3 Expo App vs Website Feature Parity

| Capability | Expo App `seeker/followups.tsx` | Website `dashboard/seeker-followups/` |
|---|---|---|
| View assigned seekers | ✅ Read-only list | ✅ Read-write |
| Fetch new batch | ❌ | ✅ (POST endpoint) |
| WhatsApp/call action | ✅ | ❌ |
| Update follow-up status | ❌ | ✅ (dropdown) |
| Update seeker attributes | ❌ | ✅ (language, event, center, notes) |
| Mark completion | ❌ | ✅ (auto on PATCH) |
| Progress tracking | ❌ | ✅ |
| Empty/loading/error states | ✅ Basic | ✅ Basic |

---

## 2. Proposed Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │  Expo Mobile App     │  │  Next.js Website                  │ │
│  │  ┌─────────────────┐ │  │  ┌─────────────────────────────┐ │ │
│  │  │ Shared UI Kit   │ │  │  │ Shared Components           │ │ │
│  │  │ - SeekerCard    │ │  │  │ - SeekerCard                │ │ │
│  │  │ - FollowUpForm  │ │  │  │ - FollowUpForm              │ │ │
│  │  │ - FetchButton   │ │  │  │ - FetchButton               │ │ │
│  │  │ - StatusBadge   │ │  │  │ - StatusBadge               │ │ │
│  │  └─────────────────┘ │  │  │ - ProgressBar               │ │ │
│  └──────────────────────┘  │  └─────────────────────────────┘ │ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER (Next.js)                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  /api/volunteer/seeker-assignment                            │ │
│  │  ├── GET    → fetch my active queue                          │ │
│  │  ├── POST   → fetch new batch (6 seekers)                    │ │
│  │  ├── PATCH  → update follow-up + completion                  │ │
│  │  └── DELETE → release a seeker back to pool                  │ │
│  │                                                               │ │
│  │  /api/volunteer/queue                                         │ │
│  │  ├── GET    → queue status (counts, wait time)                │ │
│  │                                                               │ │
│  │  /api/admin/assignments                                       │ │
│  │  ├── GET    → overview of all assignments                     │ │
│  │  ├── POST   → manual reassign                                 │ │
│  │  └── DELETE → force-release                                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                                │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │ Assignment Engine    │  │ Matching Algorithm                 │ │
│  │ - Lock acquisition   │  │ - Language filter                 │ │
│  │ - Batch allocation   │  │ - Geo expansion                   │ │
│  │ - Queue management   │  │ - Scoring engine                  │ │
│  │ - Expiry scheduler   │  │ - Fallback logic                  │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │ Transaction Manager  │  │ Notification Service              │ │
│  │ - Mongo transactions │  │ - WhatsApp template               │ │
│  │ - Retry logic        │  │ - Email alerts                    │ │
│  │ - Dead letter queue  │  └──────────────────────────────────┘ │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER (MongoDB)                         │
│  Collections:                                                    │
│  ┌──────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────┐ │
│  │ Seekers  │ │ Volunteers   │ │ Assignments │ │ Languages    │ │
│  ├──────────┤ ├──────────────┤ ├────────────┤ ├──────────────┤ │
│  │ _id      │ │ _id          │ │ _id        │ │ _id          │ │
│  │ name     │ │ userId (ref) │ │ seekerId   │ │ code         │ │
│  │ district │ │ name         │ │ volunteerId│ │ name         │ │
│  │ state    │ │ email        │ │ status     │ │ nativeName   │ │
│  │ phone    │ │ district     │ │ assignedAt │ │ isActive     │ │
│  │ language │ │ state        │ │ claimedAt  │ └──────────────┘ │
│  │ status   │ │ language     │ │ completedAt│                   │
│  │ priority │ │ isActive     │ │ releasedAt │                   │
│  └──────────┘ └──────────────┘ └────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Core Philosophy

- **Unified component library:** Both the Expo app and the Website share the same logical components rendered with their respective frameworks. The data flow, validation, state machine, and API contract are identical. The rendering layer differs (React Native vs React DOM).
- **Single source of truth:** The assignment state machine lives in the API layer. Clients are thin — they display state and trigger transitions. No assignment logic runs on the client.

---

## 3. Database Schema (Proposed Changes)

### 3.1 New `Assignment` Collection

```typescript
const assignmentSchema = new Schema({
  seekerId:        { type: Schema.Types.ObjectId, ref: "Seeker", required: true },
  volunteerId:     { type: Schema.Types.ObjectId, ref: "User", required: true },
  volunteerProfileId: { type: Schema.Types.ObjectId, ref: "VolunteerProfile" },

  status: {
    type: String,
    enum: ["assigned", "claimed", "in_progress", "completed", "released", "expired"],
    default: "assigned",
  },

  // Timelines
  assignedAt:      { type: Date, default: Date.now },
  claimedAt:       Date,
  firstContactedAt: Date,
  completedAt:     Date,
  releasedAt:      Date,
  expiresAt:       Date,

  // Follow-up tracking
  contactAttempts: { type: Number, default: 0 },
  lastContactDate: Date,
  followUpNotes:   { type: String, trim: true, default: "" },
  followUpOutcome: {
    type: String,
    enum: [
      "not_contacted", "contacted_followup_needed",
      "interested_coming", "converted",
      "not_interested", "wrong_number", "dormant",
    ],
    default: "not_contacted",
  },

  // Audit
  followUpStatusBefore: String,
  assignedBy: {
    type: String,
    enum: ["auto_assign", "admin_manual", "volunteer_fetch", "reassign"],
    default: "auto_assign",
  },

  version: { type: Number, default: 1 },
});

// Indexes
assignmentSchema.index({ volunteerId: 1, status: 1 });
assignmentSchema.index({ seekerId: 1, status: 1 });
assignmentSchema.index({ status: 1, expiresAt: 1 });
assignmentSchema.index({ volunteerId: 1, status: 1, assignedAt: -1 });
```

### 3.2 Modified Seeker Model (Additions)

```typescript
// Fields to ADD
district:    { type: String, trim: true, default: "" },  // from Indian districts dataset
state:       { type: String, trim: true, default: "" },
zone:        { type: String, trim: true, default: "" },
language:    { type: Schema.Types.ObjectId, ref: "Language" },  // controlled vocabulary
priority:    { type: Number, default: 0, min: 0, max: 100 },
status:      { type: String, enum: SEEKER_STATUSES, default: "new" },
lastActivity: { type: Date },

// Fields to DEPRECATE (keep for dual-write during migration)
// assignedVolunteer → moved to Assignment
// volunteerFollowUpCompletedAt → moved to Assignment.completedAt
// volunteerFollowUpCompletedBy → moved to Assignment.volunteerId
// followUpStatus → replaced by standardized status
```

### 3.3 Modified VolunteerProfile Model (Additions)

```typescript
// Fields to ADD
userId:        { type: Schema.Types.ObjectId, ref: "User", required: true },
district:      { type: String, trim: true, default: "" },
state:         { type: String, trim: true, default: "" },
zone:          { type: String, trim: true, default: "" },
language:      { type: Schema.Types.ObjectId, ref: "Language", required: true },
maxQueueSize:  { type: Number, default: 6 },
isAvailable:   { type: Boolean, default: true },
lastFetchAt:   { type: Date },

// Fields to DEPRECATE
// assignments (string[]) → replaced by Assignment collection
// staffingFocus → replaced by roles
```

### 3.4 New `Language` Collection

```typescript
const languageSchema = new Schema({
  code:       { type: String, required: true, unique: true, uppercase: true, minlength: 2, maxlength: 5 },
  name:       { type: String, required: true, trim: true },
  nativeName: { type: String, trim: true, default: "" },
  isActive:   { type: Boolean, default: true },
  sortOrder:  { type: Number, default: 0 },
});

// Seed data (12 languages)
[
  { code: "ENG", name: "English",    nativeName: "English",   sortOrder: 1  },
  { code: "HIN", name: "Hindi",      nativeName: "हिन्दी",    sortOrder: 2  },
  { code: "TEL", name: "Telugu",     nativeName: "తెలుగు",    sortOrder: 3  },
  { code: "TAM", name: "Tamil",      nativeName: "தமிழ்",     sortOrder: 4  },
  { code: "KAN", name: "Kannada",    nativeName: "ಕನ್ನಡ",     sortOrder: 5  },
  { code: "MAL", name: "Malayalam",  nativeName: "മലയാളം",   sortOrder: 6  },
  { code: "MAR", name: "Marathi",    nativeName: "मराठी",     sortOrder: 7  },
  { code: "ODI", name: "Odia",       nativeName: "ଓଡ଼ିଆ",     sortOrder: 8  },
  { code: "BEN", name: "Bengali",    nativeName: "বাংলা",     sortOrder: 9  },
  { code: "GUJ", name: "Gujarati",   nativeName: "ગુજરાતી",   sortOrder: 10 },
  { code: "PUN", name: "Punjabi",    nativeName: "ਪੰਜਾਬੀ",    sortOrder: 11 },
  { code: "ASM", name: "Assamese",   nativeName: "অসমীয়া",   sortOrder: 12 },
]
```

### 3.5 Seeker Status Enum

```typescript
const SEEKER_STATUSES = [
  "new",
  "assigned",
  "contacted",
  "follow_up_scheduled",
  "converted",
  "not_interested",
  "wrong_number",
  "dormant",
  "completed",
] as const;
```

### 3.6 Complete Index Strategy

| Collection | Index | Purpose |
|---|---|---|
| `Assignments` | `{ volunteerId: 1, status: 1 }` | "Get my active queue" |
| `Assignments` | `{ seekerId: 1, status: 1 }` | "Is this seeker already assigned?" |
| `Assignments` | `{ status: 1, expiresAt: 1 }` | Expiry sweep — find expired |
| `Assignments` | `{ volunteerId: 1, status: 1, assignedAt: -1 }` | Volunteer's assignment history |
| `Seekers` | `{ status: 1, priority: -1, addedAt: 1 }` | "Who gets assigned next?" |
| `Seekers` | `{ language: 1, district: 1, status: 1 }` | Geo + language matching |
| `Seekers` | `{ language: 1, state: 1, status: 1 }` | State-level fallback |
| `Seekers` | `{ language: 1, zone: 1, status: 1 }` | Zone-level fallback |
| `VolunteerProfiles` | `{ language: 1, district: 1, isAvailable: 1 }` | "Find nearby volunteers" |
| `VolunteerProfiles` | `{ userId: 1 }` | Unique user→volunteer lookup |

---

## 4. State Machine Design

### 4.1 Assignment State Diagram

```
                  ┌──────────────────┐
                  │   UNASSIGNED     │  (Seeker in pool, no Assignment doc)
                  └────────┬─────────┘
                           │
                    POST /fetch-batch
                           │
                           ▼
                  ┌──────────────────┐
                  │    ASSIGNED      │  Assignment created, seeker in queue
                  └────────┬─────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              │       Volunteer        │  Expiry timer (48h)
              │       views seeker     │
              │            │            │
              ▼            ▼            ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────┐
    │  IN_PROGRESS │ │ CLAIMED  │ │ EXPIRED  │──→ Released back to pool
    └──────┬───────┘ └──────────┘ └──────────┘
           │              │
           │       First contact made
           │              │
           └──────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │  CONTACTED     │
         └────┬───────────┘
              │
    ┌─────────┼──────────┐
    │         │          │
    ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌────────────┐
│FOLLOWUP│ │NOT_INT │ │WRONG_NUM   │
│NEEDED  │ │ERESTED │ │BER/DORMANT │
└───┬────┘ └────────┘ └────────────┘
    │         │              │
    ▼         ▼              ▼
┌────────┐ ┌────────────┐ ┌───────────┐
│CONVERT-│ │ COMPLETED  │ │ COMPLETED │
│ED      │ │ (negative) │ │ (neutral) │
└───┬────┘ └────────────┘ └───────────┘
    │
    ▼
┌──────────┐
│COMPLETED │  Final state — seeker archived
│(active)  │  Assignment.status = "completed"
└──────────┘
```

### 4.2 Batch Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        VOLUNTEER QUEUE (max 6)                          │
│                                                                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                             │
│  │ S1 │ │ S2 │ │ S3 │ │ S4 │ │ S5 │ │ S6 │   Max 6 seekers             │
│  │NEW │ │NEW │ │NEW │ │NEW │ │NEW │ │NEW │                             │
│  └──┬─┘ └──┬─┘ └────┘ └────┘ └────┘ └────┘                             │
│     │      │                                                             │
│     │      ├── Contacted ──► Completed ──► Removed from queue           │
│     │      │                                                             │
│     │      └── Not interested ──► Completed ──► Removed from queue       │
│     │                                                                     │
│     └── Expired (48h) ──► Released back to pool                          │
│                                                                          │
│  Fetch button disabled until: activeQueue.length === 0                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Assignment Algorithm

### 5.1 Steps

**Step 1: Language Hard Filter**
```
Seeker.language.code === VolunteerProfile.language.code
Exact match via ObjectId reference.
NO fallback. If no volunteer speaks the seeker's language, the seeker stays in the pool.
```

**Step 2: Geo-Expansion Rings**
```
Ring 1:  Same district        (seeker.district === volunteer.district)
Ring 2:  Same state           (seeker.state === volunteer.state, different district)
Ring 3:  Neighboring state    (seeker.state ∈ NEIGHBORING_STATES[volunteer.state])
Ring 4:  Same zone            (seeker.zone === volunteer.zone)
Ring 5:  All India            (any active volunteer with matching language)
```

Within each ring: prefer volunteers with fewer active assignments, then longest idle time.

### 5.2 Comparison of Geo-Matching Approaches

| Approach | Perf | Complexity | Maintenance | Scale | Accuracy | Cost |
|---|---|---|---|---|---|---|
| **Admin hierarchy** (district→state→zone) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ Simple | ⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Zero |
| **Adjacency graph** (neighboring districts) | ⭐⭐⭐⭐⭐ | ⭐⭐ Simple | ⭐⭐ Moderate | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Zero |
| **MongoDB 2dsphere + $geoNear** | ⭐⭐⭐ | ⭐⭐⭐ Need coords | ⭐⭐⭐ Coords maint | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free |
| **Geohash prefix** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Free |
| **Haversine + PostGIS** | ⭐⭐⭐ | ⭐⭐⭐⭐ High | ⭐⭐ Two DBs | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Extra DB |
| **Google Maps API** | ⭐ Too slow | ⭐⭐ | ⭐ Paid | ⭐ | ⭐⭐⭐⭐⭐ | $$$$ |

### 5.3 Recommendation: Hybrid

**Primary:** Admin hierarchy using the existing Indian districts dataset (`src/data/indian-districts.ts` with 795 entries). Zero-cost, zero-latency, zero-infrastructure.

**Supplement:** Precomputed neighboring-district mapping for fine-grained expansion within states.

**Why NOT geo/GIS:** No lat/lng for most records. Admin hierarchy is sufficient for district-level matching. If we surpass 500K seekers, reassess.

### 5.4 Assignment Flow (Detailed)

```
1. Volunteer clicks "Fetch Seekers"
2. POST /api/volunteer/seeker-assignment

3. Auth check:
   a. Load User from session
   b. Verify User.role === "Volunteer" || "Admin"
   c. Load VolunteerProfile by User._id
   d. Verify volunteer.isAvailable !== false

4. Queue check:
   a. Assignment.countDocuments({ volunteerId, status: { $in: ["assigned","claimed","in_progress"] } })
   b. If count > 0 → 409 Conflict

5. Begin MongoDB transaction

6. Matching query (ring-by-ring):
   - Exclude seekers already assigned to ANY volunteer
   - Filter by language match
   - Apply geo ring, sort by priority DESC + addedAt ASC, limit to batch size

7. For each selected seeker:
   a. atomicUpdate = Seeker.findOneAndUpdate({ _id, status: "new" }, { status: "assigned" })
   b. If null → skip (claimed by another volunteer concurrently)
   c. Assignment.create({ seekerId, volunteerId, status: "assigned", assignedAt: now })

8. Commit transaction. Return batch.
```

---

## 6. API Design

### 6.1 `GET /api/volunteer/seeker-assignment`

Fetch volunteer's active queue.

**Auth:** Bearer token (Volunteer/Admin)

**Response 200:**
```json
{
  "queue": [{
    "assignmentId": "665abc...",
    "seeker": {
      "_id": "664def...",
      "name": "Rahul Sharma",
      "phone": "+919876543210",
      "city": "Hyderabad",
      "district": "Hyderabad",
      "state": "Telangana",
      "language": { "code": "TEL", "name": "Telugu" },
      "notes": "Met at public program"
    },
    "status": "assigned",
    "assignedAt": "2026-07-18T10:00:00Z",
    "expiresAt": "2026-07-20T10:00:00Z",
    "contactAttempts": 0,
    "followUpOutcome": "not_contacted"
  }],
  "queueCount": 4,
  "maxQueueSize": 6,
  "canFetch": false
}
```

`canFetch = queue.length === 0 AND volunteer.isAvailable !== false AND volunteer.isActive !== false`

### 6.2 `POST /api/volunteer/seeker-assignment`

Fetch a new batch. Empty body — criteria from volunteer profile.

**Response 200:** `{ "assignments": [...], "batchCount": 4, "totalPool": 327 }`
**Response 400:** `{ "error": "already_has_active_queue", "activeCount": 3 }`
**Response 404:** `{ "error": "no_available_seekers", "message": "No seekers match your language and region." }`

### 6.3 `PATCH /api/volunteer/seeker-assignment/:assignmentId`

Update follow-up state. Volunteer must own this assignment.

**Body:** `{ "followUpOutcome", "followUpNotes", "lastContactDate" }`

State transitions enforced server-side. Terminal outcomes (converted, not_interested, wrong_number, dormant) auto-complete the assignment.

### 6.4 `DELETE /api/volunteer/seeker-assignment/:assignmentId`

Release seeker back to pool. Idempotent — returns 200 if already released.

### 6.5 `GET /api/admin/assignments` + `POST` + `DELETE`

Admin override endpoints. Admin bypasses matching algorithm.

---

## 7. Queue Management

### 7.1 Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Assignment timing | **On-demand fetch** | Voluntary, not pushy |
| Queue size | **Configurable** (default 6) | Per-volunteer via admin panel |
| Expiry | **48h without contact** | Prevents hoarding |
| Partial refill | **Not allowed** | All or nothing — prevents cherry-picking |
| Reassignment | **Automatic after expiry** | No manual admin needed at scale |
| Abandoned seekers | **Back to pool** | Reset to "new" status |

### 7.2 Expiry Scheduler

```typescript
// Runs every 15 minutes via cron or serverless function
async function expireStaleAssignments() {
  const expired = await Assignment.find({
    status: { $in: ["assigned", "claimed"] },
    assignedAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
  });

  for (const a of expired) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await Seeker.findByIdAndUpdate(a.seekerId, { status: "new" }, { session });
      await Assignment.findByIdAndUpdate(a._id,
        { status: "expired", releasedAt: new Date() }, { session });
      await session.commitTransaction();
    } catch {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
```

### 7.3 Duplicate Contact Prevention

- Seekers track full assignment history in the Assignment collection.
- On expiry/release, append note: `"Previously assigned to X on Y. Outcome: Z."`
- Same volunteer will NOT receive the same seeker again (excluded in matching query).

---

## 8. Language Management

### 8.1 Approach Comparison

| Approach | Pros | Cons |
|---|---|---|
| **Enum in code** | Simple, no DB lookup | Requires code deploy to add/change languages |
| **Single collection** (recommended) | Runtime-manageable via admin panel; supports future fields; no code deploy needed | One extra query (or cache) |
| **JSON config** | Very simple | Cannot change at runtime |

**Recommendation:** Collection-based. Language rarely changes but should be admin-manageable without code deploys.

### 8.2 Standardization Strategy

Migration script maps all existing free-text values using a normalization table:
```
"hindi" → HIN, "Hindi" → HIN, "HINDI" → HIN, "hind" → HIN
"telgu" → TEL, "telugu" → TEL, "Telugu" → TEL, "telegu" → TEL
...etc.
```
Unknown values default to English. Old `preferredLanguage` field retained during dual-write period.

### 8.3 Every Surface Needing Language Dropdown

| Surface | Change |
|---|---|
| `Seeker.preferredLanguage` | Replace free text with `language: ObjectId` |
| `VolunteerProfile` | Add `language: ObjectId` (required) |
| Seeker registration form (website) | Dropdown |
| Seeker registration API | Validate ObjectId |
| Volunteer interest form | Mandatory dropdown |
| Volunteer invite acceptance | Mandatory dropdown |
| Admin add/edit seeker | Dropdown |
| Admin add/edit volunteer | Dropdown |
| Expo: add-manually form | Dropdown |
| Expo: upload-document edit modal | Dropdown |
| Expo: scan-page edit modal | Dropdown |
| Expo: volunteer registration | Mandatory dropdown |

---

## 9. Concurrency and Race Conditions

### 9.1 Threat Model

| Scenario | Risk | Mitigation |
|---|---|---|
| 1000 volunteers simultaneously fetch | Multiple volunteers claim same seeker | Atomic `findOneAndUpdate` with status check |
| Network timeout after assignment | Seeker assigned but volunteer never receives | Idempotent POST — client retries, server returns existing |
| Double-click "Fetch" | Two requests from same volunteer | Client debounce + server duplicate detection |
| Expiry sweeper overlaps with volunteer completing | Race between expiry and completion | `findOneAndUpdate` with status filter on non-completed states |
| Admin manually assigns someone else's seeker | Double assignment | Assignment lookup + error before manual assign |

### 9.2 Locking Strategy

**Recommended: Optimistic concurrency with MongoDB transactions**

```typescript
const session = await mongoose.startSession();
session.startTransaction({
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
});

try {
  // All reads and writes within the transaction see a consistent snapshot
  await Assignment.create([...], { session });
  await session.commitTransaction();
} catch {
  await session.abortTransaction();
}
```

**Why NOT pessimistic locking:** MongoDB doesn't support row-level locks. `findOneAndUpdate` with condition is the MongoDB-native atomic operation. Transactions handle multi-collection consistency.

### 9.3 Duplicate Assignment Guarantee

A seeker can NEVER be assigned to two volunteers simultaneously:

1. `Seeker.findOneAndUpdate({ _id, status: "new" }, { status: "assigned" })` is atomic
2. Only ONE volunteer's write succeeds — the other gets `null` and skips
3. Assignment record created only for the successful claim
4. If crash occurs between the update and Assignment.create, transaction rollback reverts the seeker status

---

## 10. UI/UX Design

### 10.1 Expo App — Revamped Contact Seeker Page

```
┌─────────────────────────────────┐
│  ← Contact Seeker      🔄      │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ 📞 Seekers Assigned to You  ││
│  │  ┌──────┬───────────────┐   ││
│  │  │  4   │  Max 6 slots  │   ││
│  │  └──────┴───────────────┘   ││
│  │  [═══════════════════════]  ││
│  │  4/6 active                 ││
│  └─────────────────────────────┘│
│                                  │
│  ┌─────────────────────────────┐│
│  │ 👤 Rahul Sharma             ││
│  │ 📞 +91 98765 43210          ││
│  │ 📍 Hyderabad, Telangana     ││
│  │ 🗣️ Telugu                   ││
│  │                             ││
│  │ Status: [Contacted    ▼]    ││
│  │ Outcome: [Select...    ▼]   ││
│  │ ┌──────────────────────┐    ││
│  │ │ Notes: Called on...  │    ││
│  │ └──────────────────────┘    ││
│  │                             ││
│  │ [💬 WhatsApp] [📞 Call]    ││
│  │ [✅ Save & Complete]       ││
│  │                             ││
│  │ ⏰ Assigned 2 days ago      ││
│  │ ⚠️ Expires in 22 hours     ││
│  └─────────────────────────────┘│
│                                  │
│  (When queue empty):             │
│  [🚀 Fetch New Seekers]          │
│                                  │
│  (When queue active):            │
│  [⛔ Complete current batch]     │
└─────────────────────────────────┘
```

### 10.2 State Table

| State | Fetch Button | Empty State | Loading | Error |
|---|---|---|---|---|
| Not auth'd | None | "Sign in required" | — | — |
| Not volunteer | None | "Volunteer access required" | — | — |
| Queue loading | Skeleton | — | 3 skeleton cards | — |
| Queue loaded, >0 | Hidden | — | — | — |
| Queue loaded, =0 | **Enabled** | "No seekers. Fetch a batch!" | — | — |
| Fetch in progress | Spinner | — | Loading overlay | — |
| Fetch → queue >0 | Hidden | — | — | — |
| Fetch → no results | Enabled | "No matching seekers" | — | — |
| Network error | Enabled (retry) | — | — | Error toast |

### 10.3 Shared Component Architecture

Both apps use the same API contract. A shared hook (`useAssignmentQueue`) encapsulates all data fetching:

```typescript
// Shared interface (implemented separately per platform)
function useAssignmentQueue() {
  return {
    queue,           // SeekerAssignment[]
    queueCount,      // number
    maxQueueSize,    // number
    canFetch,        // boolean
    isFetching,      // boolean
    isUpdating,      // boolean
    fetchBatch,      // () => Promise<void>
    updateSeeker,    // (id, data) => Promise<void>
    releaseSeeker,   // (id) => Promise<void>
    refetch,         // () => Promise<void>
  };
}
```

Website: `components/SeekerCard.tsx` (React DOM)  
Expo App: `components/ui/SeekerCard.tsx` (React Native)  
Both consume the same hook and render platform-appropriate UI.

---

## 11. Edge Cases

| # | Edge Case | Handling |
|---|---|---|
| 1 | **Volunteer changes language** | Existing queue keeps old language. New fetches use new language. |
| 2 | **Volunteer changes district** | Same as #1 — existing queue unaffected. |
| 3 | **Volunteer becomes inactive** | Expiry sweeper releases queue. Immediate release on profile update trigger. |
| 4 | **Volunteer deletes account** | Cron sweeper finds orphaned assignments (volunteerId not in User collection). Releases them. |
| 5 | **Seeker changes language after assignment** | Language snapshot stored in Assignment record at assignment time. |
| 6 | **Seeker moves city** | If still "new" (unclaimed), release and re-match. If claimed, complete as-is. |
| 7 | **Volunteer never contacts (repeatedly)** | After 3 consecutive expired batches, auto-mark `isAvailable=false` and notify admin. |
| 8 | **Volunteer partially completes queue** | Cannot fetch until ALL done. Enforced by `canFetch = queue.length === 0`. |
| 9 | **Network failure during PATCH** | Idempotent PATCH — server returns current state. Client retries. |
| 10 | **Duplicate PATCH requests** | Use `version` field — increment on each update, reject on mismatch. |
| 11 | **Concurrent FETCH same volunteer** | Server checks active count within transaction. Second request gets 409. |
| 12 | **Seeker pool depleted** | Return 200 with empty array. Show "No matching seekers currently." |
| 13 | **Seeker registered mid-session** | Pull-to-refresh (poll every 30s). Future: WebSocket. |
| 14 | **maxQueueSize changed mid-session** | Current queue continues. New fetches respect new max. |
| 15 | **Admin assigns to full volunteer** | Admin API checks queue size. Returns 409 if at capacity. |
| 16 | **Two admins assign same seeker** | Atomic `findOneAndUpdate` with `status: "new"` prevents this. |
| 17 | **Expiry fires during active update** | Expiry skips "contacted"/"completed" statuses. |
| 18 | **Seeker phone changes after assignment** | Volunteer marks "wrong_number" or uses current data. |
| 19 | **Language code changes in master data** | Migration on code change, or use stable `code` string as reference. |
| 20 | **Bulk import of 10K seekers** | Matching is volunteer-driven (on fetch). No performance spike on import. |

---

## 12. Migration Plan

### Phase 1: Data Schema
1. Create `Language` collection with seed data
2. Create `Assignment` collection (empty)
3. Migration: add `district`, `state`, `zone`, `language` (ObjectId), `status` to Seeker
4. Migration: add `userId`, `district`, `state`, `zone`, `language`, `maxQueueSize`, `isAvailable` to VolunteerProfile
5. Keep old fields during dual-write period

### Phase 2: API
6. Build AssignmentService with matching algorithm
7. Deploy new endpoints alongside old ones
8. Write expiry scheduler (cron-triggered API route)

### Phase 3: UI
9. Rewrite website dashboard/seeker-followups for new API
10. Rewrite Expo seeker/followups.tsx (full-featured)
11. Add Language dropdown to all forms

### Phase 4: Cutover
12. Dry-run validation — compare old vs new assignment counts
13. Flip default. Old API returns 301. Old UI shows deprecation banner.
14. Drop old fields after 30-day observation

---

## 13. Rollout Strategy

| Stage | Duration | Success Criteria |
|---|---|---|
| **Alpha** (dev team) | 1 week | All 20 edge cases pass |
| **Beta** (10 volunteers) | 2 weeks | Zero duplicate assignments, zero support tickets |
| **Gradual** (25%→50%→75%→100%) | 2 weeks | No regressions |
| **Full rollout** (archive old) | 1 month | Steady state |

**Rollback:** Feature flag on API (`?version=1`/`?version=2`). Old endpoints live for 30 days. Flip flag for instant rollback.

---

## 14. Testing Strategy

### Unit Tests
- Matching algorithm: each geo ring produces correct candidates
- State machine: every legal/illegal transition
- Concurrency guard: two simultaneous fetches → no duplicates
- Expiry logic: 48h expiry returns seeker to pool
- Language normalization: fuzzy match → canonical code

### Integration Tests
- In-memory MongoDB, 100 seekers, 10 volunteers, 20 concurrent fetches
- Assert: zero duplicates, correct language, geo priority order

### Load Tests
- 500 concurrent volunteer fetches
- Target: <500ms P95, zero duplicates

---

## 15. Future Scalability Considerations

| Threshold | Action |
|---|---|
| 100K seekers | Current architecture handles with proper indexing |
| 500K seekers | Add materialized view for queue queries |
| 1M+ seekers | Shard by language.code or state. Consider PostGIS migration. |
| 10K volunteers | Distributed expiry sweeper (Bull/BullMQ) |
| 100 req/s | Redis cache for Language and district lookup |
| Real-time notifications | WebSocket (Socket.io) for live queue updates |

---

## 16. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Data loss during migration | Low | Critical | Dual-write period. Full backup. |
| Double assignment race | Medium | High | Atomic findOneAndUpdate + transaction |
| Expiry releasing recent assignments | Low | Medium | Only expires >48h old, status "assigned"/"claimed" |
| Volunteer overload | Medium | Medium | Configurable maxQueueSize |
| Language migration breaks data | Medium | Medium | Keep old field during migration. Fallback logic. |
| Geo query performance | Low | Medium | All geo via indexed fields. No geo operators. |

---

## 17. Open Questions / Assumptions

- **Q:** Should a seeker be assignable to multiple volunteers for different purposes (language follow-up vs center visit)?
  - **A:** No — one volunteer at a time. Seeker returns to pool after completion.
- **Q:** Multi-language volunteers?
  - **A:** MVP: single language. Future: `languages[]` array.
- **Q:** Max assignments before "exhausted"?
  - **A:** Yes — after 3 unsuccessful assignments (`not_interested`/`wrong_number`), mark `dormant`.
- **Q:** Journey Hub seekers treated differently?
  - **A:** No — same matching algorithm. Journey source is just a `source` field.
- **Q:** Volunteer teams sharing a queue?
  - **A:** Not in MVP. Future enhancement.
- **Q:** WhatsApp message templates?
  - **A:** Not in MVP. Volunteer messages freely.

---

## 18. Summary of Recommendations

1. **Unify UI** — Expo Contact Seeker page gets full parity with Website dashboard. Same API contract, different render layer.
2. **New Assignment collection** — Separate from Seeker and Volunteer for history, auditing, and complex queries.
3. **Language as controlled vocabulary** — Dedicated `Language` collection. Standardized dropdown everywhere.
4. **Intelligent geo matching** — Admin hierarchy (district→state→neighboring state→zone→all India) using existing Indian districts dataset. Zero-cost, zero-latency, zero-infrastructure.
5. **Queue size limit** — Hard limit of 6 (configurable). No new fetch until all complete.
6. **48-hour expiry** — Auto-release stale assignments. Sweeper runs every 15 minutes.
7. **Atomic assignments** — `findOneAndUpdate` with status filter + MongoDB transactions. No double-assignment possible.
8. **Dual-write migration** — Keep old fields populated during transition. No breaking changes.
9. **Gradual rollout** — Alpha → Beta → Gradual → Full. Feature flag for instant rollback.
10. **Monitor and scale** — Current architecture handles 100K seekers. Beyond 500K, consider sharding or PostGIS.

---

## 19. Appendix: Sequence Diagram — Fetch Flow

```
Volunteer         Expo App           API Server           MongoDB
    │                │                   │                  │
    │  Tap "Fetch"   │                   │                  │
    │───────────────➤│                   │                  │
    │                │ POST /assignment   │                  │
    │                │──────────────────➤│                  │
    │                │                   │ startTransaction │
    │                │                   │─────────────────➤│
    │                │                   │ countActiveQueue │
    │                │                   │─────────────────➤│
    │                │                   │← { count: 0 }    │
    │                │                   │◄─────────────────│
    │                │                   │                  │
    │                │                   │ findCandidates   │
    │                │                   │ (language match  │
    │                │                   │  + geo rings)    │
    │                │                   │─────────────────➤│
    │                │                   │← [4 seekers]     │
    │                │                   │◄─────────────────│
    │                │                   │                  │
    │                │                   │ for each:        │
    │                │                   │ findOneAndUpdate │
    │                │                   │ {status:"new"}   │
    │                │                   │ → {status:"assigned"}
    │                │                   │─────────────────➤│
    │                │                   │ Assignment.create│
    │                │                   │─────────────────➤│
    │                │                   │                  │
    │                │                   │ commitTransaction│
    │                │                   │─────────────────➤│
    │                │                   │                  │
    │                │← { 4 assigned }   │                  │
    │                │◄──────────────────│                  │
    │                │                   │                  │
    │ Show queue     │                   │                  │
    │◄───────────────│                   │                  │
```

---

## 20. Appendix: State Diagram — Seeker Lifecycle

```
                  ┌──────────┐
                  │   NEW    │ ← Created via registration, import, self-service
                  └────┬─────┘
                       │
                  ┌────▼─────┐
                  │ ASSIGNED │ ← Matched via algorithm, Assignment.created
                  └────┬─────┘
                       │
              ┌────────┴────────┐
              │ 48h no contact  │ ← Expiry timer
              └────────┬────────┘
                       │
                  ┌────▼─────┐
                  │ CLAIMED  │ ← Volunteer acknowledges
                  └────┬─────┘
                       │
                  ┌────▼─────┐
                  │CONTACTED │ ← First contact made
                  └────┬─────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │FOLLOW-UP│   │NOT INT- │   │WRONG    │
   │NEEDED   │   │ERESTED  │   │NUMBER   │
   └────┬────┘   └────┬────┘   └────┬────┘
        │             │             │
        ▼             ▼             ▼
   ┌────────┐   ┌───────────┐  ┌───────────┐
   │CONVERT-│   │ COMPLETED │  │ COMPLETED │
   │ED      │   │(negative) │  │(neutral)  │
   └────┬───┘   └───────────┘  └───────────┘
        │
        ▼
   ┌──────────┐
   │COMPLETED │ ← Final state. Excluded from future matching.
   └──────────┘

Alternative paths:
NEW ──┬──► DORMANT (after 3 failed assignments)
      │
      ├──► NOT_INTERESTED (self-declined during registration)
      │
      └──► DUPLICATE (merged with existing)

CONTACTED ──┬──► DORMANT (3+ attempts, no response)
            │
            └──► NOT_INTERESTED (explicit decline)

Any active state ──► EXPIRED (48h no activity)
                           │
                           ▼
                       NEW (back to pool)
```

---

*End of Design Document*
