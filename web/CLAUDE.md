# Claude Code Project Instructions

This file provides context and instructions for Claude Code when working on this project.

---

## Project Overview

**Authentic Motorcars** - A car dealership website built with Next.js 16 (App Router), TypeScript, Prisma/MongoDB, and Auth.js.

- **Main documentation:** `ARCHITECTURE.md` (keep this updated!)
- **Visual overview:** `PROJECT_OVERVIEW.md` (non-technical summary with mermaid diagrams)
- **DNS migration guide:** `../DNS_MIGRATION_GUIDE.md`

---

## Documentation Maintenance

**IMPORTANT:** After making significant changes to the codebase, check if `ARCHITECTURE.md` needs updating.

### What counts as "significant"?
- Adding/removing pages or routes
- Adding/modifying database models (Prisma schema)
- Adding/modifying server actions
- Changing authentication logic
- Adding new external services or integrations
- Changing the deployment or infrastructure setup

### How to update
Use the `doc-keeper` agent to scan for drift and update both `ARCHITECTURE.md` and `PROJECT_OVERVIEW.md` automatically. It compares routes, models, actions, components, deps, and env vars against what's documented.

For manual updates:
1. Read the current `ARCHITECTURE.md`
2. Identify what sections need changes
3. Update the relevant sections (use mermaid diagrams for visual representations)
4. Update the "Last Updated" date at the top

---

## Project-Specific Context

### Key Patterns
- **Server Components by default** - Only use `"use client"` when needed (forms, interactivity)
- **Server Actions for mutations** - Not API routes
- **Zod validation** - Both client and server side
- **Upsert pattern** - Service, Storage, Home are single-record entities

### Image Handling
- Uses **Filestack** for uploads and CDN delivery
- Use `unoptimized` prop on Next.js `<Image>` for full-quality display
- Helper: `getFilestackUrl(file, options?)` in `src/lib/utils.ts`

### Authentication
- Auth.js (NextAuth v5) with database sessions
- Only emails in `ADMIN_EMAILS` env var can access admin
- Protected routes check `auth()` in layout.tsx

### Styling
- Tailwind CSS + Shadcn/ui components
- Brand colors: Orange `#f58521`, Blue `#00b4dd`
- Use `cn()` helper for conditional classes

---

## Current Infrastructure

| Service | Purpose | Status |
|---------|---------|--------|
| Heroku | App hosting | Active |
| MongoDB Atlas | Database | Active |
| Filestack | Image uploads/CDN | Active |
| Cloudflare | DNS management | Migration in progress |
| Media Temple | Domain registration | Active (nameservers moving to Cloudflare) |

---

## Preferences

- Don't add emojis unless asked
- Keep code simple - avoid over-engineering
- Prefer editing existing files over creating new ones
- Run `npm run build` to check for TypeScript errors after significant changes

---

## Files to Know About

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | Full app documentation with mermaid diagrams (keep updated!) |
| `PROJECT_OVERVIEW.md` | Visual non-technical overview with mermaid diagrams |
| `HOW_TO_RUN.md` | Local development setup guide |
| `../DNS_MIGRATION_GUIDE.md` | DNS migration instructions (completed Feb 2025) |
| `.env.example` | Environment variable template |
