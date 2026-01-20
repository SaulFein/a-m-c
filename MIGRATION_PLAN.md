# Authentic Motorcars: Next.js Migration Plan

## Learning Goals

This migration is also a learning opportunity. Key concepts to understand:

### React & Next.js Concepts
- **Components**: Reusable UI building blocks (like AngularJS directives but simpler)
- **Server Components vs Client Components**: Server components run on the server (better performance, SEO). Client components run in the browser (needed for interactivity like forms, buttons)
- **App Router**: Next.js file-based routing - `app/gallery/page.tsx` = `/gallery` URL
- **Server Actions**: Functions that run on the server, called from the client (replaces API routes for mutations)

### Key Files to Understand
- `src/lib/prisma.ts` - Database connection (like your old `models/index.js`)
- `src/lib/auth.ts` - Authentication configuration
- `src/actions/*.ts` - Server-side functions for CRUD operations
- `src/components/` - Reusable UI pieces

### Questions to Ask During Development
- "Why are we using a Server Component here vs a Client Component?"
- "How does this compare to how I did it in AngularJS?"
- "What security benefit does this approach provide?"

---

## Overview

Migrate from AngularJS + Express to Next.js 16 (App Router) while preserving all existing MongoDB data and maintaining the same domain.

### Technology Decisions

| Layer | Current | New |
|-------|---------|-----|
| **Frontend** | AngularJS 1.5 + Bootstrap 3 | Next.js 16 + React 19 |
| **Styling** | Bootstrap CSS | Tailwind CSS + shadcn/ui |
| **Backend** | Express.js | Next.js API Routes / Server Actions |
| **Database** | MongoDB + Mongoose | MongoDB + Prisma |
| **Auth** | JWT + bcrypt passwords | Auth.js (Google OAuth + Magic Link) |
| **File Uploads** | Filestack | Filestack (keep existing) |
| **Deployment** | Heroku | Vercel |
| **Domain** | www.authenticmotorcars.com | Same (DNS update) |

### Migration Strategy: Parallel Build

Build the new Next.js application in a separate repository/branch. Once complete and tested, update DNS to point to Vercel. The old Heroku app remains as a fallback during transition.

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Create Next.js Project

```bash
# Creates Next.js 16 with React 19 (latest stable versions)
npx create-next-app@latest authentic-motorcars-next --typescript --tailwind --eslint --app --src-dir
```

> **Note:** Next.js 16 ships with React 19 by default, giving you access to React Server Components, the `use()` hook, Actions, and other React 19 features out of the box.

### 1.2 Install Dependencies

```bash
# Core
npm install prisma @prisma/client
npm install next-auth @auth/prisma-adapter
npm install @auth/mongodb-adapter mongodb

# UI Components
npx shadcn@latest init
npx shadcn@latest add button card input label form dialog dropdown-menu
npx shadcn@latest add carousel navigation-menu sheet toast

# Utilities
npm install zod                    # Form validation
npm install filestack-js           # File uploads
npm install nodemailer             # Email sending
npm install lucide-react           # Icons
```

### 1.3 Environment Variables

Create `.env.local`:

```env
# Database (same MongoDB connection string from Heroku)
DATABASE_URL="mongodb+srv://..."   # Your existing MONGOLAB_URI

# Auth.js
AUTH_SECRET="generate-a-secure-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Email (for magic links)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@authenticmotorcars.com"

# Filestack (existing key)
NEXT_PUBLIC_FILESTACK_API_KEY="AS2OofL0jSaWHwlvlGpt4z"
FILESTACK_SECRET="your-filestack-secret"

# Admin emails (comma-separated list of allowed admins)
ADMIN_EMAILS="you@gmail.com,partner@gmail.com"

# Contact form recipient
CONTACT_EMAIL="sales@authenticmotorcars.com"
```

---

## Phase 2: Database Schema (Prisma + MongoDB)

### 2.1 Initialize Prisma

```bash
npx prisma init --datasource-provider mongodb
```

### 2.2 Prisma Schema

Create `prisma/schema.prisma` mapping to existing MongoDB collections:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// Auth.js models
model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user") // "user" or "admin"
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Existing data models (map to existing collections)
model Car {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  make          String
  model         String
  year          String
  miles         String   @default("N/A")
  color         String   @default("N/A")
  interiorColor String   @default("N/A")
  price         String   @default("Inquire")
  vin           String   @default("N/A")
  highlights    String   @default("N/A")
  description   String   @default("N/A")
  carfax        String   @default("N/A")
  engine        String   @default("N/A")
  transmission  String   @default("N/A")
  picture       Json     // Main picture (Filestack data)
  morePictures  Json?    // Additional pictures array
  video         String   @default("N/A")
  video2        String   @default("N/A")
  banner        String   @default("")
  sold          Boolean  @default(false)
  stockNumber   String   @default("N/A")
  carfaxFile    Json?
  createdAt     DateTime @default(now())

  @@map("cars") // Map to existing "cars" collection
}

model Service {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  description     String   @default("More info coming soon.")
  servicePictures Json?
  pictureDesc     String[]
  special         String?
  serviceList     String   @default("Service list coming soon.")
  createdAt       DateTime @default(now())

  @@map("services")
}

model Storage {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  description     String   @default("Storage details coming soon.")
  storagePictures Json?
  pictureDesc     String[]
  special         String?
  specialTitle    String   @default("SPECIAL GOING ON NOW")
  mmcbsTitle      String   @default("OUTDOOR STORAGE AVAILABLE")
  mmcbsBlurb      String?
  serviceList     String   @default("Service list coming soon.")
  createdAt       DateTime @default(now())

  @@map("storages")
}

model Home {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  description  String   @default("N/A")
  picture      Json?
  morePictures Json?
  video        String   @default("N/A")
  createdAt    DateTime @default(now())

  @@map("homes")
}
```

### 2.3 Generate Prisma Client

```bash
npx prisma generate
npx prisma db pull  # Introspect existing data to verify schema matches
```

---

## Phase 3: Authentication Setup

### 3.1 Auth.js Configuration

Create `src/lib/auth.ts`:

```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Email from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase())

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow admin emails to sign in
      const email = user.email?.toLowerCase()
      if (!email || !ADMIN_EMAILS.includes(email)) {
        return false // Block sign-in
      }
      return true
    },
    async session({ session, user }) {
      // Add role to session
      if (session.user) {
        session.user.id = user.id
        session.user.role = ADMIN_EMAILS.includes(user.email?.toLowerCase() || "") ? "admin" : "user"
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})
```

### 3.2 Auth API Route

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth"
export const { GET, POST } = handlers
```

### 3.3 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://www.authenticmotorcars.com/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

---

## Phase 4: Project Structure

```
src/
├── app/
│   ├── (public)/                    # Public routes (no auth required)
│   │   ├── page.tsx                 # Home page
│   │   ├── gallery/page.tsx         # Car gallery
│   │   ├── sold/page.tsx            # Sold vehicles
│   │   ├── car/[id]/page.tsx        # Car detail view
│   │   ├── service/page.tsx         # Service info
│   │   ├── storage/page.tsx         # Storage info
│   │   ├── finance/page.tsx         # Financing info
│   │   └── contact/page.tsx         # Contact form
│   │
│   ├── (admin)/                     # Protected admin routes
│   │   ├── layout.tsx               # Auth check wrapper
│   │   ├── admin/page.tsx           # Admin dashboard
│   │   ├── admin/cars/page.tsx      # Car inventory management
│   │   ├── admin/cars/new/page.tsx  # Add new car
│   │   ├── admin/cars/[id]/page.tsx # Edit car
│   │   ├── admin/service/page.tsx   # Edit service page
│   │   ├── admin/storage/page.tsx   # Edit storage page
│   │   └── admin/home/page.tsx      # Edit home page
│   │
│   ├── login/page.tsx               # Login page (Google + Magic Link)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── contact/route.ts         # Contact form handler
│   │   └── filestack/signature/route.ts  # Filestack signature
│   │
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Tailwind imports
│
├── components/
│   ├── ui/                          # shadcn components
│   ├── layout/
│   │   ├── header.tsx               # Site header/nav
│   │   ├── footer.tsx               # Site footer
│   │   └── mobile-nav.tsx           # Mobile navigation
│   ├── cars/
│   │   ├── car-card.tsx             # Car gallery card
│   │   ├── car-gallery.tsx          # Car grid display
│   │   ├── car-detail.tsx           # Car detail view
│   │   ├── car-form.tsx             # Add/edit car form
│   │   └── image-carousel.tsx       # Image slider
│   ├── forms/
│   │   ├── contact-form.tsx         # Contact form
│   │   └── inquiry-form.tsx         # Car inquiry form
│   └── shared/
│       ├── file-upload.tsx          # Filestack uploader
│       ├── video-embed.tsx          # Video player
│       └── loading.tsx              # Loading states
│
├── lib/
│   ├── prisma.ts                    # Prisma client instance
│   ├── auth.ts                      # Auth.js config
│   ├── filestack.ts                 # Filestack utilities
│   └── utils.ts                     # Helper functions
│
├── actions/                         # Server Actions
│   ├── cars.ts                      # Car CRUD operations
│   ├── service.ts                   # Service CRUD
│   ├── storage.ts                   # Storage CRUD
│   ├── home.ts                      # Home page CRUD
│   └── contact.ts                   # Send contact email
│
└── types/
    └── index.ts                     # TypeScript types
```

---

## Phase 5: Page-by-Page Migration

### Public Pages

| Current Route | New Route | Priority | Notes |
|--------------|-----------|----------|-------|
| `/home` | `/` | High | Landing page with featured cars |
| `/gallery` | `/gallery` | High | Available car inventory |
| `/sold` | `/sold` | Medium | Sold vehicle archive |
| `/car/:id` | `/car/[id]` | High | Individual car details |
| `/service` | `/service` | Medium | Service information |
| `/storage` | `/storage` | Medium | Storage information |
| `/finance` | `/finance` | Low | Financing info (static) |
| `/contact` | `/contact` | High | Contact form |

### Admin Pages

| Current Route | New Route | Priority | Notes |
|--------------|-----------|----------|-------|
| `/login` | `/login` | High | Google + Magic Link |
| `/admin-inventory` | `/admin` | High | Dashboard with car list |
| `/addCar` | `/admin/cars/new` | High | Add new vehicle |
| `/detail/:id` | `/admin/cars/[id]` | High | Edit vehicle |
| `/editService` | `/admin/service` | Medium | Edit service page |
| `/editStorage` | `/admin/storage` | Medium | Edit storage page |
| `/editHome` | `/admin/home` | Medium | Edit home content |

---

## Phase 6: Key Component Examples

### 6.1 Car Gallery (Server Component)

```typescript
// src/app/(public)/gallery/page.tsx
import { prisma } from "@/lib/prisma"
import { CarGallery } from "@/components/cars/car-gallery"

export default async function GalleryPage() {
  const cars = await prisma.car.findMany({
    where: { sold: false },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Inventory</h1>
      <CarGallery cars={cars} />
    </main>
  )
}
```

### 6.2 Car Form with Filestack

```typescript
// src/components/cars/car-form.tsx (simplified)
"use client"

import { useState } from "react"
import * as filestack from "filestack-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const client = filestack.init(process.env.NEXT_PUBLIC_FILESTACK_API_KEY!)

export function CarForm({ car, onSubmit }) {
  const [images, setImages] = useState(car?.morePictures || [])

  const handleUpload = async () => {
    const result = await client.picker({
      accept: "image/*",
      maxFiles: 20,
      onUploadDone: (res) => {
        setImages([...images, ...res.filesUploaded])
      },
    }).open()
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Form fields */}
      <Button type="button" onClick={handleUpload}>
        Upload Images
      </Button>
      {/* Image preview grid */}
    </form>
  )
}
```

### 6.3 Protected Admin Layout

```typescript
// src/app/(admin)/layout.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      {/* Admin header/sidebar */}
      <main className="p-6">{children}</main>
    </div>
  )
}
```

---

## Phase 7: Server Actions (CRUD Operations)

```typescript
// src/actions/cars.ts
"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCar(data: CarFormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const car = await prisma.car.create({ data })
  revalidatePath("/gallery")
  revalidatePath("/admin")
  return car
}

export async function updateCar(id: string, data: CarFormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const car = await prisma.car.update({
    where: { id },
    data,
  })
  revalidatePath(`/car/${id}`)
  revalidatePath("/gallery")
  revalidatePath("/admin")
  return car
}

export async function deleteCar(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.car.delete({ where: { id } })
  revalidatePath("/gallery")
  revalidatePath("/admin")
}

export async function toggleSold(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const car = await prisma.car.findUnique({ where: { id } })
  if (!car) throw new Error("Car not found")

  await prisma.car.update({
    where: { id },
    data: { sold: !car.sold },
  })
  revalidatePath("/gallery")
  revalidatePath("/sold")
  revalidatePath("/admin")
}
```

---

## Phase 8: Testing & Quality Assurance

### 8.1 Testing Checklist

**Public Pages:**
- [ ] Home page loads with featured content
- [ ] Gallery shows only available (non-sold) cars
- [ ] Sold page shows only sold cars
- [ ] Car detail page displays all information correctly
- [ ] Images load and carousel works
- [ ] Videos embed and play correctly
- [ ] Contact form sends emails
- [ ] Mobile responsiveness on all pages

**Admin Pages:**
- [ ] Login with Google OAuth works
- [ ] Login with Magic Link works
- [ ] Unauthorized users cannot access admin routes
- [ ] Car CRUD operations work (create, read, update, delete)
- [ ] Image upload via Filestack works
- [ ] Mark car as sold/available works
- [ ] Service page editing works
- [ ] Storage page editing works
- [ ] Home page editing works

**Data Integrity:**
- [ ] All existing cars display correctly
- [ ] Existing images load from Filestack
- [ ] No data loss during migration

### 8.2 Performance Targets

- Lighthouse Performance Score: >90
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3s

---

## Phase 9: Deployment & DNS Cutover

### 9.1 Vercel Deployment

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy to preview URL (e.g., `authentic-motorcars.vercel.app`)
5. Test thoroughly on preview URL

### 9.2 DNS Migration

1. In Vercel: Add custom domain `www.authenticmotorcars.com`
2. In your DNS provider (likely where you registered the domain):
   - Update CNAME record for `www` to point to `cname.vercel-dns.com`
   - Or update A record to Vercel's IP (76.76.21.21)
3. Vercel automatically provisions SSL certificate
4. Keep Heroku running for 24-48 hours as fallback
5. Once verified working, shut down Heroku app

### 9.3 Post-Migration

- [ ] Verify all pages load correctly
- [ ] Test admin login and CRUD operations
- [ ] Check that old URLs redirect properly (if needed)
- [ ] Monitor error logs in Vercel dashboard
- [ ] Set up Vercel Analytics (optional)
- [ ] Shut down Heroku app after 1 week of stable operation

---

## Phase 10: Implementation Order

### Sprint 1: Foundation (Week 1)
1. Create Next.js project with all dependencies
2. Set up Prisma schema and connect to existing MongoDB
3. Configure Auth.js with Google OAuth
4. Create basic layout (header, footer, mobile nav)
5. Implement login page

### Sprint 2: Public Pages (Week 2)
1. Home page
2. Gallery page (car grid)
3. Car detail page
4. Contact page with email functionality
5. Service and Storage pages

### Sprint 3: Admin Panel (Week 3)
1. Admin dashboard/inventory list
2. Add new car form with Filestack
3. Edit car page
4. Edit service/storage/home pages
5. Mark as sold functionality

### Sprint 4: Polish & Deploy (Week 4)
1. Mobile responsiveness testing
2. Performance optimization
3. Bug fixes
4. Deploy to Vercel preview
5. DNS cutover

---

## Security Best Practices

This migration implements modern security standards throughout:

### Authentication & Authorization
- **No stored passwords**: OAuth and magic links eliminate password storage vulnerabilities
- **Invite-only access**: Only pre-approved email addresses can authenticate
- **Session management**: Auth.js handles secure session tokens with httpOnly cookies
- **CSRF protection**: Built into Auth.js and Next.js Server Actions

### Environment & Secrets
- **No hardcoded secrets**: All sensitive values in environment variables
- **Server-only secrets**: Use `AUTH_SECRET`, database URLs only on server side
- **Public prefix convention**: Only `NEXT_PUBLIC_*` vars exposed to browser

### Input Validation & Sanitization
- **Zod schemas**: Validate all form inputs on both client and server
- **Prisma parameterized queries**: Prevents SQL/NoSQL injection
- **TypeScript**: Type safety catches many issues at compile time

### API Security
- **Server Actions**: Authenticated by default, no exposed API endpoints
- **Rate limiting**: Add rate limiting to contact form and auth endpoints
- **CORS**: Next.js handles CORS properly by default

### Headers & Transport
- **HTTPS only**: Vercel enforces HTTPS automatically
- **Security headers**: Configure in `next.config.js`:
  ```javascript
  // next.config.js
  const securityHeaders = [
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ]
  ```

### File Uploads
- **Signed uploads**: Filestack signatures generated server-side
- **File type validation**: Restrict to images only for car photos
- **Size limits**: Enforce maximum file sizes

### Data Protection
- **Minimal data exposure**: Only return necessary fields from database
- **No sensitive data in URLs**: Use POST for sensitive operations
- **Audit logging**: Consider adding for admin actions

### Dependency Security
- **Regular updates**: Keep dependencies current
- **npm audit**: Run regularly to check for vulnerabilities
- **Lockfile**: Commit package-lock.json for reproducible builds

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Data incompatibility | Use `prisma db pull` to verify schema matches existing data |
| Filestack images break | URLs remain the same; test image loading early |
| Auth issues | Test Google OAuth thoroughly in preview environment |
| DNS propagation delay | Keep Heroku running during transition |
| Mobile layout issues | Use shadcn/ui responsive components; test on real devices |

---

## Questions to Resolve

1. **Email service**: Will you use Gmail SMTP for magic links, or a service like Resend/SendGrid?
2. **Google OAuth**: Do you already have Google Cloud credentials, or need to create them?
3. **Monitoring**: Do you want error tracking (e.g., Sentry) or analytics?

---

## Summary

This migration preserves your existing MongoDB data while modernizing the entire stack. The parallel build approach minimizes risk - your current site stays live until the new one is fully tested and ready.

Key benefits of the new stack:
- **Better performance**: React 19 Server Components, automatic code splitting, streaming
- **React 19 features**: `use()` hook, Actions, improved form handling, async transitions
- **Modern auth**: No passwords to manage, secure OAuth/magic links
- **Type safety**: TypeScript throughout
- **Better DX**: Hot reload, great tooling, Vercel integration
- **Mobile-first**: Tailwind + shadcn/ui responsive components
- **Easier maintenance**: Modern React patterns, cleaner code structure
