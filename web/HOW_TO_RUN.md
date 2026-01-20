# How to Run Locally

## Prerequisites

- Node.js 18+ (recommend using `nvm`)
- MongoDB (local or Atlas)
- npm or yarn

## Quick Start (Local Database)

1. **Install dependencies:**
   ```bash
   cd web
   npm install
   ```

2. **Start local MongoDB:**
   ```bash
   # If using Homebrew (Mac)
   brew services start mongodb-community

   # Or run directly
   mongod
   ```

3. **Set up environment variables:**

   Copy the example or ensure `web/.env` has:
   ```
   DATABASE_URL="mongodb://localhost/db"
   AUTH_SECRET="your-random-secret-here"
   AUTH_URL="http://localhost:3000"
   ADMIN_EMAILS="your-email@gmail.com"
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

5. **Start the dev server:**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

---

## Running with Production Database

To test locally against the production MongoDB (useful for debugging production data):

1. **Get your production MongoDB connection string** from Heroku:
   ```bash
   heroku config:get MONGOLAB_URI -a your-heroku-app-name
   ```

   Or find it in your Heroku dashboard under Settings > Config Vars.

2. **Update `web/.env`:**
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"
   AUTH_SECRET="your-random-secret-here"
   AUTH_URL="http://localhost:3000"
   ADMIN_EMAILS="your-email@gmail.com"
   ```

3. **Regenerate Prisma client** (if connection string format changed):
   ```bash
   npx prisma generate
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

**Warning:** Be careful when running against production data. Any mutations (create, update, delete) will affect real data.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MongoDB connection string |
| `AUTH_SECRET` | Yes | Random secret for Auth.js sessions (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | Yes | Base URL of your app (`http://localhost:3000` for local) |
| `ADMIN_EMAILS` | Yes | Comma-separated list of allowed admin emails |
| `AUTH_GOOGLE_ID` | No* | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | No* | Google OAuth client secret |
| `EMAIL_SERVER_HOST` | No* | SMTP host for magic links |
| `EMAIL_SERVER_PORT` | No* | SMTP port |
| `EMAIL_SERVER_USER` | No* | SMTP username |
| `EMAIL_SERVER_PASSWORD` | No* | SMTP password (use Gmail app password) |
| `EMAIL_FROM` | No* | From address for emails |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | No** | Filestack API key for image uploads |

*Required for authentication to work. Without these, login will not function.
**Required for image uploads in admin. Get your key from [Filestack](https://www.filestack.com/).

---

## Setting Up Authentication

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### Magic Link (Email)

1. Use Gmail with an [App Password](https://support.google.com/accounts/answer/185833)
2. Or use another SMTP provider (SendGrid, Mailgun, etc.)
3. Add credentials to `.env`

---

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Generate Prisma client after schema changes
npx prisma generate

# View database in Prisma Studio
npx prisma studio

# Lint code
npm run lint
```

---

## Troubleshooting

### "MissingSecret" error
Make sure `AUTH_SECRET` is set in `.env`

### Database connection errors
- Check MongoDB is running: `brew services list` or `ps aux | grep mongod`
- Verify `DATABASE_URL` is correct
- For Atlas: ensure your IP is whitelisted

### "Cannot find module" errors
Run `npm install` and `npx prisma generate`

### Port already in use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Turbopack cache corruption
```bash
rm -rf .next
npm run dev
```
