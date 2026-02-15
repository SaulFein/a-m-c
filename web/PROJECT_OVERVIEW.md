# Authentic Motorcars - Project Overview

**Last Updated:** February 14, 2026

---

## What Is This?

Authentic Motorcars is a website for a car dealership. It lets visitors browse available vehicles, view detailed photos, and send inquiries. The dealership owner manages inventory, page content, and photos through a protected admin panel.

### Key Features

- **Public gallery** of available vehicles with photos, specs, and inquiry forms
- **Sold vehicle archive** so past inventory remains visible
- **Contact and inquiry forms** that send emails to the dealership
- **Loan calculator** for financing estimates
- **Service and storage pages** with editable content
- **Admin dashboard** for managing everything (protected by login)

---

## Site Map

```mermaid
graph TD
    Home["Home Page<br/>(Photo collage + featured cars)"]
    Home --> Gallery["Gallery<br/>(Available vehicles)"]
    Home --> Sold["Sold<br/>(Past inventory)"]
    Home --> Contact["Contact<br/>(Send a message)"]
    Home --> Service["Service<br/>(Service info)"]
    Home --> Storage["Storage<br/>(Storage info)"]
    Home --> Finance["Finance<br/>(Loan calculator)"]
    Gallery --> CarDetail["Car Detail<br/>(Photos, specs, inquiry form)"]
    Sold --> CarDetail

    Home --> Login["Login<br/>(Admin sign-in)"]
    Login --> Admin["Admin Dashboard<br/>(Inventory table)"]
    Admin --> AddCar["Add Vehicle"]
    Admin --> EditCar["Edit Vehicle"]
    Admin --> EditHome["Edit Home Page"]
    Admin --> EditService["Edit Service Page"]
    Admin --> EditStorage["Edit Storage Page"]

    style Admin fill:#f59e0b,color:#000
    style AddCar fill:#f59e0b,color:#000
    style EditCar fill:#f59e0b,color:#000
    style EditHome fill:#f59e0b,color:#000
    style EditService fill:#f59e0b,color:#000
    style EditStorage fill:#f59e0b,color:#000
```

_Orange = admin-only pages (requires login)_

---

## How Data Flows

This is the lifecycle of a car listing, from the admin adding it to a customer sending an inquiry:

```mermaid
graph LR
    Admin["Admin logs in"] --> AddCar["Adds a car<br/>(form + photos)"]
    AddCar --> DB["Saved to<br/>MongoDB"]
    DB --> Gallery["Appears on<br/>Gallery page"]
    Gallery --> Detail["Customer views<br/>car detail page"]
    Detail --> Inquiry["Customer sends<br/>inquiry"]
    Inquiry --> Email["Email sent to<br/>dealership"]
    Admin --> MarkSold["Marks car<br/>as sold"]
    MarkSold --> DB
    DB --> SoldPage["Moves to<br/>Sold page"]
```

---

## Tech Stack

```mermaid
graph TD
    subgraph Frontend
        Next["Next.js 16<br/>(App Router)"]
        React["React<br/>(Server + Client Components)"]
        Tailwind["Tailwind CSS + Shadcn/ui"]
    end

    subgraph Backend
        Actions["Server Actions<br/>(form handling + mutations)"]
        AuthJS["Auth.js<br/>(authentication)"]
        Prisma["Prisma ORM"]
    end

    subgraph Services
        MongoDB["MongoDB Atlas<br/>(database)"]
        Filestack["Filestack<br/>(image uploads + CDN)"]
        Nodemailer["Nodemailer<br/>(email via SMTP)"]
    end

    subgraph Infrastructure
        Heroku["Heroku<br/>(app hosting)"]
        Cloudflare["Cloudflare<br/>(DNS + CDN)"]
    end

    Next --> React
    React --> Tailwind
    Next --> Actions
    Actions --> AuthJS
    Actions --> Prisma
    Prisma --> MongoDB
    Actions --> Filestack
    Actions --> Nodemailer
    Heroku --> Next
    Cloudflare --> Heroku
```

---

## Quick Links

| What | Where |
|------|-------|
| Full architecture details | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Local development setup | [`HOW_TO_RUN.md`](HOW_TO_RUN.md) |
| Database schema | [`prisma/schema.prisma`](prisma/schema.prisma) |
| Server actions | [`src/actions/`](src/actions/) |
| Page routes | [`src/app/`](src/app/) |
| Components | [`src/components/`](src/components/) |
| Auth configuration | [`src/lib/auth.ts`](src/lib/auth.ts) |
| Environment variables | [`ARCHITECTURE.md` Section 10](ARCHITECTURE.md#10-environment-variables) |
