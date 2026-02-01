# Authentic Motorcars - Application Architecture

**Last Updated:** January 31, 2025

---

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB (via Prisma ORM) |
| **Auth** | Auth.js (NextAuth v5) |
| **Styling** | Tailwind CSS + Shadcn/ui |
| **Images** | Filestack CDN |
| **Email** | Nodemailer (SMTP) |
| **Hosting** | Heroku (app) + Cloudflare (DNS) |

---

## 1. Folder Structure

```
/src
├── /app                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout (header, footer, providers)
│   ├── page.tsx           # Home page (photo collage + inventory)
│   ├── /car/[id]/         # Car detail page
│   ├── /gallery           # Available inventory
│   ├── /sold              # Sold vehicles
│   ├── /contact           # Contact form
│   ├── /finance           # Loan calculator
│   ├── /service           # Service info (public)
│   ├── /storage           # Storage info (public)
│   ├── /login             # Admin login
│   ├── /admin/            # Protected admin area
│   │   ├── layout.tsx     # Auth check wrapper
│   │   ├── page.tsx       # Dashboard + inventory table
│   │   ├── /cars/new      # Add vehicle
│   │   ├── /cars/[id]     # Edit vehicle
│   │   ├── /home          # Edit home page
│   │   ├── /service       # Edit service page
│   │   └── /storage       # Edit storage page
│   └── /api/auth/[...nextauth]  # Auth.js API route
├── /components            # React components
│   ├── /ui/               # Shadcn/ui primitives
│   ├── /layout/           # Header, footer, nav
│   ├── /cars/             # Car form, cards, gallery
│   ├── /home/             # Home form
│   ├── /service/          # Service form
│   ├── /storage/          # Storage form
│   ├── filestack-upload.tsx
│   ├── image-lightbox.tsx
│   └── providers.tsx
├── /lib                   # Utilities
│   ├── auth.ts           # Auth.js config
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Helpers (formatting, image URLs)
│   └── /validations/     # Zod schemas
├── /actions              # Server actions
│   ├── cars.ts
│   ├── contact.ts
│   ├── home.ts
│   ├── service.ts
│   └── storage.ts
└── /prisma
    └── schema.prisma     # Database models
```

---

## 2. Data Models

### Car (Inventory)
| Field | Type | Description |
|-------|------|-------------|
| make, model, year | String | Vehicle identification |
| price | String | Display price or "Inquire" |
| miles, color, interiorColor | String | Vehicle details |
| engine, transmission | String | Mechanical specs |
| vin, stockNumber | String | Identifiers |
| highlights, description | String | Marketing text |
| picture | Json | Main image (Filestack) |
| morePictures | Json | Gallery images (Filestack array) |
| video, video2 | String | YouTube URLs |
| carfax, carfaxFile | String/Json | Carfax link or PDF |
| banner | String | Promotional text overlay |
| sold | Boolean | Availability status |

### Service / Storage / Home
Single-record entities for page content:
- **Service:** description, serviceList, special, servicePictures
- **Storage:** description, serviceList, special, specialTitle, storagePictures
- **Home:** picture (main), morePictures (8+ for collage)

### Auth Models
- **User:** email, name, image
- **Account:** OAuth provider connections
- **Session:** Active sessions (database strategy)
- **VerificationToken:** Email magic links

---

## 3. Page Routes

### Public Pages
| Route | Purpose |
|-------|---------|
| `/` | Home - photo collage + featured cars |
| `/gallery` | All available vehicles |
| `/car/[id]` | Vehicle detail + inquiry form |
| `/sold` | Sold vehicle archive |
| `/contact` | Contact form |
| `/service` | Service information |
| `/storage` | Storage information |
| `/finance` | Loan calculator |
| `/login` | Admin authentication |

### Admin Pages (Protected)
| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard + inventory table |
| `/admin/cars/new` | Add new vehicle |
| `/admin/cars/[id]` | Edit vehicle |
| `/admin/home` | Edit home page collage |
| `/admin/service` | Edit service content |
| `/admin/storage` | Edit storage content |

---

## 4. Authentication Flow

```
User visits /admin
    ↓
layout.tsx calls auth()
    ↓
No session? → redirect to /login
    ↓
User signs in (Google OAuth or Email magic link)
    ↓
Auth.js checks if email is in ADMIN_EMAILS env var
    ↓
Not in list? → redirect to /login?error=AccessDenied
    ↓
In list? → Create session in MongoDB → Allow access
```

**Key Files:**
- `src/lib/auth.ts` - Configuration
- `src/app/api/auth/[...nextauth]/route.ts` - API handlers
- `src/app/admin/layout.tsx` - Route protection

---

## 5. Server Actions

Server actions are async functions that run on the server but can be called from client components.

### Pattern
```typescript
// src/actions/cars.ts
"use server";

export async function createCar(data: CarFormInput) {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  // 2. Validate input
  const validated = carFormSchema.safeParse(data);
  if (!validated.success) return { error: "Validation failed", details: ... };

  // 3. Database operation
  const car = await prisma.car.create({ data: validated.data });

  // 4. Clear cache
  revalidatePath("/gallery");

  // 5. Return result
  return { success: true, car };
}
```

### Available Actions
| File | Public | Protected |
|------|--------|-----------|
| `cars.ts` | getAvailableCars, getSoldCars, getCarById | getAllCars, createCar, updateCar, deleteCar, toggleCarSold |
| `contact.ts` | sendContactForm, sendInquiry | - |
| `home.ts` | getHome | upsertHome |
| `service.ts` | getService | upsertService |
| `storage.ts` | getStorage | upsertStorage |

---

## 6. Form Handling

### Stack
- **react-hook-form** - Form state management
- **@hookform/resolvers/zod** - Validation integration
- **Zod** - Schema validation (client + server)
- **sonner** - Toast notifications

### Pattern
```typescript
"use client";

const form = useForm<CarFormInput>({
  resolver: zodResolver(carFormSchema),
  defaultValues: car ? { ...car } : { make: "", model: "", ... }
});

async function onSubmit(data: CarFormInput) {
  setIsSubmitting(true);
  const result = await createCar(data);  // Server action

  if (result.error) {
    toast.error(result.error);
  } else {
    toast.success("Saved!");
    router.push("/admin");
  }
  setIsSubmitting(false);
}
```

---

## 7. Image Handling (Filestack)

### Upload Flow
```
User clicks "Upload" button
    ↓
FilestackUpload component opens Filestack picker
    ↓
User selects/uploads images
    ↓
Filestack returns file metadata (url, handle, filename, etc.)
    ↓
Component calls onChange with file data
    ↓
Form stores as JSON in database
```

### URL Building
```typescript
// src/lib/utils.ts
function getFilestackUrl(file, options?) {
  const handle = file.handle || file.url?.split('/').pop();

  // No transformations - return original
  if (!options) return `https://cdn.filestackcontent.com/${handle}`;

  // With transformations
  const transforms = [];
  if (options.width || options.height) {
    transforms.push(`resize=width:${w},height:${h},fit:${fit}`);
  }
  return `https://cdn.filestackcontent.com/${transforms.join('/')}/${handle}`;
}
```

### Filestack File Shape
```typescript
interface FilestackFile {
  url: string;        // CDN URL
  handle?: string;    // Filestack ID (preferred)
  filename?: string;
  mimetype?: string;
  size?: number;
}
```

---

## 8. Email System

### Configuration (Environment Variables)
```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=app-specific-password
EMAIL_FROM=noreply@authenticmotorcars.com
CONTACT_EMAIL=sales@authenticmotorcars.com
```

### Usage
```typescript
// src/actions/contact.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: process.env.CONTACT_EMAIL,
  subject: "New Contact Form Submission",
  html: emailHtml,
  text: emailText,
});
```

---

## 9. Key Utilities

### `cn()` - Class Name Merger
```typescript
import { cn } from "@/lib/utils";

// Merges Tailwind classes, handles conflicts
<div className={cn("p-4 bg-red-500", isActive && "bg-blue-500")} />
```

### `formatPrice()` / `formatMiles()`
```typescript
formatPrice("75000")  // "$75,000"
formatPrice("Inquire") // "Inquire"
formatMiles("25000")   // "25,000 miles"
```

### `getCarTitle()`
```typescript
getCarTitle(car) // "2024 Porsche 911 GT3"
```

---

## 10. Environment Variables

### Required
```
DATABASE_URL=mongodb+srv://...
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://www.authenticmotorcars.com
NEXT_PUBLIC_FILESTACK_API_KEY=...
ADMIN_EMAILS=admin@example.com,owner@example.com
```

### Optional (Email)
```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=...
EMAIL_SERVER_PASSWORD=...
EMAIL_FROM=...
CONTACT_EMAIL=...
```

### Optional (Google OAuth)
```
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

---

## 11. Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint check
npx prisma studio    # Database GUI
npx prisma db push   # Sync schema to database
```

---

## 12. Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Browser  │────▶│   Cloudflare    │────▶│     Heroku      │
│                 │     │   (DNS + CDN)   │     │   (Next.js)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌─────────────────┐            │
                        │  MongoDB Atlas  │◀───────────┘
                        │   (Database)    │
                        └─────────────────┘

                        ┌─────────────────┐
                        │    Filestack    │◀─── Images
                        │     (CDN)       │
                        └─────────────────┘
```

### DNS Configuration (Cloudflare)
- `authenticmotorcars.com` → CNAME → `graceful-hawthorn-....herokudns.com` (DNS only)
- `www.authenticmotorcars.com` → CNAME → `www.authenticmotorcars.com.herokudns.com` (DNS only)

---

## 13. Common Workflows

### Adding a New Vehicle
1. Navigate to `/admin`
2. Click "Add Vehicle"
3. Fill out form (Basic Info, Details, Media, Status)
4. Upload images via Filestack picker
5. Click "Create Vehicle"
6. Car appears on `/gallery`

### Editing Page Content (Service/Storage/Home)
1. Navigate to `/admin`
2. Click "Edit [Page] Page"
3. Update text fields
4. Add/remove images
5. Click "Save Changes"
6. Public page updates automatically

### Marking a Car as Sold
1. Navigate to `/admin`
2. Find car in table
3. Click "Mark as Sold" button
4. Car moves from `/gallery` to `/sold`

---

## 14. Troubleshooting

### "Unauthorized" Error on Admin
- Check `ADMIN_EMAILS` env var includes your email
- Sign out and sign back in

### Images Not Loading
- Check `NEXT_PUBLIC_FILESTACK_API_KEY` is set
- Verify Filestack CDN domain is in `next.config.ts`

### Email Not Sending
- Verify all `EMAIL_SERVER_*` env vars are set
- For Gmail: use App Password, not regular password
- Check spam folder

### Database Connection Failed
- Verify `DATABASE_URL` is correct
- Check MongoDB Atlas IP whitelist includes your IP (or 0.0.0.0/0 for all)

---

## 15. Security Considerations

1. **Auth Whitelist** - Only emails in `ADMIN_EMAILS` can access admin
2. **Server Actions** - All mutations check authentication first
3. **Input Validation** - Zod validates on client AND server
4. **HTTPS** - Enforced via Heroku + Cloudflare
5. **Security Headers** - HSTS, X-Frame-Options, etc. in `next.config.ts`
6. **No Secrets in Client** - Only `NEXT_PUBLIC_*` vars exposed to browser

---

## Appendix: File Quick Reference

| Need to... | Look at... |
|------------|------------|
| Add a new page | `src/app/[route]/page.tsx` |
| Add a form | `src/components/[feature]/[feature]-form.tsx` |
| Add a server action | `src/actions/[feature].ts` |
| Add validation | `src/lib/validations/[feature].ts` |
| Change auth settings | `src/lib/auth.ts` |
| Change database schema | `prisma/schema.prisma` |
| Add UI component | `src/components/ui/` (shadcn/ui) |
| Change navigation | `src/components/layout/header.tsx` |
| Change styling | `tailwind.config.ts`, `src/app/globals.css` |
