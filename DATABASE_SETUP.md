# Database Setup Guide

## Prerequisites
1. Create a Vercel Postgres database in your Vercel dashboard
2. Copy the `DATABASE_URL` connection string

## Setup Steps

### 1. Set Environment Variables

**Vercel (Production):**
```
Settings → Environment Variables → Add:
DATABASE_URL=postgres://...
```

**Local Development:**
Create `.env.local`:
```bash
DATABASE_URL="postgres://..."
```

### 2. Initialize Database Schema

Run this command once to create all tables:

```bash
npx tsx scripts/init-db.ts
```

This will create all the necessary tables (users, listings, transactions, etc.)

### 3. Seed Default User

Run this to create the default user that listings will be associated with:

```bash
npx tsx scripts/seed-default-user.ts
```

### 4. Enable Real Database in API

Once the above steps are complete, uncomment the database code in:
- `app/api/listings/create/route.ts` (currently using mock data)

Replace the mock response with the actual SQL insert.

### 5. Fetch Real Listings

Update `app/marketplace/page.tsx` to fetch from `/api/listings` instead of using `MOCK_LISTINGS`.

## Verification

Test by:
1. Creating a listing through the UI
2. Checking if it appears in the marketplace
3. Verifying in Vercel Postgres dashboard that data is there

## Troubleshooting

**Connection Error:**
- Verify `DATABASE_URL` is set correctly
- Check Vercel Postgres is active

**Foreign Key Error:**
- Make sure you ran `seed-default-user.ts`
- Verify the UUID matches in both seed script and API route

**No Listings Showing:**
- Check `/api/listings` endpoint returns data
- Verify marketplace page is fetching from API
