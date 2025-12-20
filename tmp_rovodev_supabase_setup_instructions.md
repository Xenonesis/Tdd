# 🚀 Supabase PostgreSQL Setup Instructions

## Overview
This guide will help you migrate from SQLite to PostgreSQL using Supabase.

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name:** `internship-lms` (or your preferred name)
   - **Database Password:** Create a strong password and **SAVE IT** securely
   - **Region:** Choose the closest region to your users
   - **Pricing Plan:** Free tier is sufficient for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

---

## Step 2: Get Connection Strings

1. In your Supabase dashboard, click on **Project Settings** (gear icon in bottom left)
2. Click on **Database** in the left sidebar
3. Scroll down to **Connection string** section

### Get Transaction Mode URL (for DATABASE_URL):
1. Under **Connection string**, select the **URI** tab
2. Under **Transaction pooler**, copy the connection string
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. Should look like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Get Direct URL (for DIRECT_URL):
1. Under **Session pooler** or switch to **Connection pooling** → **Session mode**
2. Copy the connection string
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. Should look like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

---

## Step 3: Update Backend Environment Variables

1. Open `backend/.env` file
2. Replace the current content with your Supabase credentials:

```env
# Supabase PostgreSQL Database
# Transaction mode - used for general database operations (with PgBouncer)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection - used for migrations (bypasses PgBouncer)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_EXPIRATION="7d"

# Application Configuration
PORT=3002
NODE_ENV="development"

# CORS Configuration
FRONTEND_URL="http://localhost:3000"
```

**Important:** 
- Replace `[YOUR-PROJECT-REF]` with your actual project reference from Supabase
- Replace `[YOUR-PASSWORD]` with your database password
- Replace `[REGION]` with your selected region
- Keep the `?pgbouncer=true` parameter in DATABASE_URL

---

## Step 4: Run Database Migrations

After updating your `.env` file, run these commands:

```bash
# Navigate to backend directory
cd backend

# Generate Prisma client for PostgreSQL
npx prisma generate

# Create migration (this will create the schema in Supabase)
npx prisma migrate dev --name init_supabase

# Seed the database with demo data
npx prisma db seed
```

---

## Step 5: Verify Setup

### Check in Supabase Dashboard:
1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - ✅ users
   - ✅ courses
   - ✅ chapters
   - ✅ course_assignments
   - ✅ progress
   - ✅ certificates

### Check Demo Data:
Click on the **users** table and verify you have 5 demo users:
- admin@internlms.com
- mentor@internlms.com
- pending.mentor@internlms.com
- student1@internlms.com
- student2@internlms.com

---

## Step 6: Restart Backend Server

```bash
# Stop the current backend server (Ctrl+C)

# Start it again with new PostgreSQL connection
npm run start:dev
```

You should see:
```
🚀 Backend server is running on http://localhost:3002
```

---

## Step 7: Test the Connection

Run the verification script:

```bash
# From the root directory
.\tmp_rovodev_verify_supabase.ps1
```

This will test:
- ✅ Database connection
- ✅ Authentication
- ✅ CRUD operations
- ✅ Role-based access control

---

## Troubleshooting

### Error: "Connection refused"
**Solution:** Check if your IP is allowed in Supabase Dashboard → Project Settings → Database → Network restrictions (it should allow all IPs by default)

### Error: "Password authentication failed"
**Solution:** 
1. Verify your database password in the connection string
2. Reset password in Supabase Dashboard → Project Settings → Database → Database password

### Error: "Prepared statement already exists"
**Solution:** Make sure `?pgbouncer=true` is added to your `DATABASE_URL`

### Error: "relation does not exist"
**Solution:** Run migrations again: `npx prisma migrate dev --name init_supabase`

---

## Why Two Connection Strings?

- **DATABASE_URL** (Transaction mode with PgBouncer): 
  - Used for general application queries
  - PgBouncer pools connections efficiently
  - Port 6543

- **DIRECT_URL** (Session/Direct mode): 
  - Used for Prisma migrations which require a persistent connection
  - Bypasses PgBouncer
  - Port 5432

This is a best practice for production PostgreSQL deployments.

---

## Next Steps

After successful setup:
1. ✅ Your app is now using PostgreSQL instead of SQLite
2. ✅ Data is stored in Supabase cloud
3. ✅ Ready for production deployment
4. ✅ Can access data via Supabase dashboard

**Ready to proceed?** Follow the steps above and let me know if you encounter any issues!
