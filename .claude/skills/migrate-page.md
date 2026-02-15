# Migrate Page

Generate a Next.js implementation from a legacy AngularJS page.

## Instructions

The user will specify which page to migrate (e.g., "gallery", "detail", "service", "storage", "home", "finance", "contact", "admin", "addCar", "sold", "login").

### Step 1: Read the legacy implementation

Read ALL relevant legacy files for the specified page:

| Page | Controller | Template(s) | Service | Express Route |
|------|-----------|-------------|---------|---------------|
| home | `app/controllers/homeController.js` | `app/partials/home.html`, `app/partials/editHome.html` | `app/services/home_service.js` | `routes/home-routes.js` |
| gallery | `app/controllers/galleryController.js` | `app/partials/gallery.html` | `app/services/car_service.js` | `routes/car-routes.js` |
| detail | `app/controllers/detailController.js` | `app/partials/detail.html`, `app/partials/car-view.html`, `app/partials/templates/car-view-detail-caro.html`, `app/partials/templates/modal-caro.html` | `app/services/car_service.js` | `routes/car-routes.js` |
| service | `app/controllers/serviceController.js` | `app/partials/service.html`, `app/partials/editService.html` | `app/services/service_service.js` | `routes/service-routes.js` |
| storage | `app/controllers/storageController.js` | `app/partials/storage.html`, `app/partials/editStorage.html` | `app/services/storage_service.js` | `routes/storage-routes.js` |
| finance | `app/controllers/financeController.js` | `app/partials/finance.html` | — | — |
| contact | — | `app/partials/contact.html` | `app/services/email_service.js` | `routes/email-routes.js` |
| addCar | `app/controllers/addCarController.js` | `app/partials/addCar.html` | `app/services/car_service.js` | `routes/car-routes.js` |
| login | `app/controllers/userController.js` | `app/partials/login.html` | `app/services/auth_service.js` | `routes/user-routes.js` |
| sold | `app/controllers/galleryController.js` | `app/partials/sold.html` | `app/services/car_service.js` | `routes/car-routes.js` |
| admin-inventory | `app/controllers/userController.js` | `app/partials/admin-inventory.html` | `app/services/car_service.js` | `routes/car-routes.js` |

### Step 2: Read existing Next.js code for patterns

Read these files to understand the established patterns:
- `web/src/app/gallery/page.tsx` — server component page pattern
- `web/src/app/sold/page.tsx` — simple page variant
- `web/src/app/service/page.tsx` — upsert entity page pattern
- `web/src/components/cars/car-card.tsx` — component pattern
- `web/src/actions/cars.ts` — server actions pattern
- `web/src/lib/validations/car.ts` — Zod validation pattern
- `web/src/lib/utils.ts` — utility helpers

Also read the Prisma schema at `web/prisma/schema.prisma` to understand available models.

### Step 3: Check what already exists

Check if any Next.js files already exist for this page:
- `web/src/app/<page>/page.tsx`
- `web/src/components/<entity>/` directory
- `web/src/actions/<entity>.ts`
- `web/src/lib/validations/<entity>.ts`

If files exist, this is an UPDATE — read them and enhance rather than overwrite.

### Step 4: Generate the Next.js implementation

Create files following these patterns:

**Page component** (`web/src/app/<route>/page.tsx`):
- Server component by default (no `"use client"` unless needed)
- Export `metadata` for SEO
- Fetch data directly in the component via server actions
- Use `<Suspense>` with skeleton fallback for async content

**Components** (`web/src/components/<entity>/`):
- Create an `index.ts` barrel export
- Separate display components from form components
- Use `"use client"` only for interactive components (forms, modals, toggles)
- Mock Next.js `Image` and `Link` in any corresponding tests

**Server actions** (`web/src/actions/<entity>.ts`):
- `"use server"` directive at top
- Public actions: no auth check
- Protected actions: check `auth()` and return `{ error: "Unauthorized" }` if not authenticated
- Validate input with Zod schemas
- Use `revalidatePath()` after mutations
- Return `{ success: true, data }` or `{ error: "message" }` — never throw

**Validation schemas** (`web/src/lib/validations/<entity>.ts`):
- Use Zod for all schemas
- Export both the schema and the inferred TypeScript type
- Match field names to the Prisma model
- Add `.default()` values matching Prisma defaults

**Admin pages** (`web/src/app/admin/<entity>/page.tsx`):
- Protected by the admin layout (auth check is in `web/src/app/admin/layout.tsx`)
- Include edit forms for managing the entity

### Step 5: Ensure feature completeness

Cross-reference the legacy implementation to ensure NOTHING is missed:
1. Every data field displayed in the template
2. Every user interaction (buttons, links, forms, toggles)
3. Every conditional render (ng-if, ng-show, ng-hide → conditional JSX)
4. Every form with validation
5. Every API call → corresponding server action
6. Every navigation link
7. Image handling (Filestack URLs via `getFilestackUrl` helper)
8. Sorting/filtering logic
9. Empty states and error states

### Step 6: Run build check

After generating files, run `cd web && npm run build` to verify there are no TypeScript or compilation errors. Fix any errors.

### Step 7: Report

Output a summary:

```
## Migration Complete: [Page Name]

### Files Created
- `web/src/app/<route>/page.tsx` — main page component
- `web/src/components/<entity>/<component>.tsx` — display/form components
- `web/src/actions/<entity>.ts` — server actions
- `web/src/lib/validations/<entity>.ts` — Zod schemas

### Files Updated
- (any existing files that were modified)

### Legacy → Next.js Mapping
| Legacy Feature | Legacy Location | Next.js Location |
|---|---|---|
| [feature] | [file:line] | [file:line] |

### Notes
- Any design decisions or deviations from the legacy behavior
- Any features that need manual follow-up (e.g., third-party integrations)
```

### Important Rules

- ALWAYS read the Prisma schema before creating server actions — use existing models, do NOT invent fields
- ALWAYS use the `getFilestackUrl` helper from `@/lib/utils` for image URLs
- ALWAYS use Shadcn/ui components from `@/components/ui/` — do NOT install new UI libraries
- ALWAYS colocate tests if possible, following the patterns in `utils.test.ts` and `car-card.test.tsx`
- Use Tailwind CSS for styling, brand colors: Orange `#f58521`, Blue `#00b4dd`
- Use `cn()` helper for conditional classes
- Do NOT add `"use client"` to components that don't need interactivity
