---
name: add-page
description: Scaffold a new Next.js page with server actions, validation, and components following project patterns
---

# Scaffold New Page

Generate a new page following the project's established patterns.

## Instructions

The user will provide a page name and description. Use the existing patterns from this project to scaffold all necessary files.

### Arguments

$ARGUMENTS

### What to generate

Based on the page type (public, admin, or both), create the following files using the patterns established in this codebase:

#### For a public page (`web/src/app/[page-name]/`):

1. **`page.tsx`** - Server component that fetches data and renders
   - Follow the pattern in `web/src/app/service/page.tsx` or `web/src/app/gallery/page.tsx`
   - Use server actions for data fetching
   - Include proper metadata export

2. **Client component** (if interactive) - e.g., `[page-name]-form.tsx`
   - `"use client"` directive
   - Use react-hook-form + Zod validation
   - Use Shadcn/ui form components
   - Use sonner for toast notifications
   - Follow the pattern in `web/src/app/contact/contact-form.tsx`

#### For an admin page (`web/src/app/admin/[page-name]/`):

1. **`page.tsx`** - Server component (auth already handled by admin layout)
   - Follow the pattern in `web/src/app/admin/service/page.tsx`

2. **Form component** in `web/src/components/[page-name]/`
   - Follow pattern in `web/src/components/service/service-form.tsx`
   - Include Filestack upload if images are needed

#### Supporting files:

3. **Server action** in `web/src/actions/[page-name].ts`
   - `"use server"` directive
   - Public getter function
   - Protected upsert/mutation function with `auth()` check
   - Zod validation on all inputs
   - Follow the pattern in `web/src/actions/service.ts`

4. **Zod validation schema** in `web/src/lib/validations/[page-name].ts`
   - Form schema with proper types
   - Export inferred TypeScript type
   - Follow the pattern in `web/src/lib/validations/car.ts`

5. **Prisma model** (if new data) - update `web/prisma/schema.prisma`
   - Follow existing model patterns
   - Use `@map` for MongoDB collection name if needed
   - Run `npx prisma generate` after schema changes

### After scaffolding:

- Run `npm run build` in `web/` to verify no TypeScript errors
- Remind user to update `ARCHITECTURE.md` (or offer to run `/update-arch`)
- List all files created for review
