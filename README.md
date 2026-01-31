# TigerSwap (UofM Marketplace)

**TigerSwap** is a **university-verified** student marketplace for the **University of Memphis** where students can **give away (free), sell, or trade** items with a safe, campus-friendly pickup flow.  
The goal is to help students save money, reduce waste, and make item reuse easy during move-in/move-out seasons.

---

## Problem

Students frequently throw away usable items (mini-fridges, desks, monitors, textbooks, kitchen items) because:
- finding buyers/claimers is messy and scattered across group chats and general marketplaces
- there is no **UofM-verified** exchange space
- pickup coordination is time-consuming and safety can be a concern

---

## Solution

TigerSwap provides a UofM-only marketplace where:
- users verify with a **@memphis.edu** email
- every listing is clearly labeled as **Free / Sell / Trade**
- sellers can optionally share a pickup location (pin)
- “Public Giveaway” listings can be dropped at approved campus spots for fast pickup
- pickup completion can be validated using **location proximity (geofence)** and a **pickup code** to reduce fake claims

---

## MVP Features (Planned)

### University Verification
- Sign up / log in using **@memphis.edu**
- Basic profile and listing ownership

### Listings
- Create listing in under 30 seconds:
  - photos, title, category, condition
  - Free / Sell / Trade
  - optional location visibility: hidden / approximate / exact
- Status flow: **Available → Reserved → Completed**

### Discovery
- Mobile-first feed
- Search and filters (Free-first toggle, categories, distance range)

### Public Giveaway Mode (Impact Feature)
- Seller drops item at a campus-friendly public spot
- Buyer can claim and pick up quickly
- “Mark Picked Up” unlocks only when the buyer is near the pinned location

### Safety & Moderation
- Report listing/user
- Block users
- Admin tools to review reports and hide listings

### Impact Tracking
- Count of items reused (completed pickups)
- Free items given away

---

## Development Plan (High Level)

1. **Scaffold** mobile-first web app
2. **Auth**: UofM email verification
3. **Listings**: create + browse + filters
4. **Images**: upload and storage
5. **Map + distance**: show listing distance (when location is shared)
6. **Claim/reservation**: prevent multiple claimers + expiration timer
7. **Geofence pickup + pickup code**: reduce fake “picked up”
8. **Reports/admin**: moderation tools
9. **Pilot launch** with a small UofM student group

---

## Tech Stack (Planned)

- Frontend: **Next.js (mobile-first)** + Tailwind CSS
- Backend/Auth/DB/Storage: **Supabase** (or Firebase)
- Maps: Google Maps or Mapbox
- Hosting: Vercel

> Note: Final stack and setup steps will be documented once the initial scaffold is committed.

---

## Repository Structure (Planned)

- `/web` — mobile-first web app
- `/docs` — PRD, architecture, schema, checklist
- `README.md` — project overview and updates

---

## Docs

- `docs/PRD.md` — product requirements and scope
- `docs/MVP_CHECKLIST.md` — detailed checklist and acceptance criteria
- `docs/ROADMAP.md` — phased plan and milestones
- `docs/SECURITY.md` — rules, restricted items, reporting

---

## Contributing (Team Workflow)

- One feature = one GitHub Issue
- One branch per feature: `feat/<feature-name>`
- PRs must include:
  - what changed
  - how to test
  - screenshots (when UI changes)

---

## Restricted Items

TigerSwap will prohibit listings that are unsafe or not allowed for a campus marketplace:
- weapons, drugs, alcohol, tobacco/vapes
- stolen/counterfeit goods
- anything illegal or unsafe

---

## Status

🚧 **In development** — repo currently contains the initial project plan.  
Code scaffold and setup instructions will be added soon.
