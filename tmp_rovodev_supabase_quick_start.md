# ⚡ Quick Start: Supabase Setup (5 Minutes)

## What I've Done For You

✅ Updated Prisma schema to use PostgreSQL  
✅ Configured connection pooling for Supabase  
✅ Updated PrismaService to remove SQLite adapter  
✅ Fixed seed script for PostgreSQL  
✅ Created setup documentation and verification script  

## What You Need To Do

### 1️⃣ Create Supabase Project (2 minutes)

Go to: https://supabase.com

1. Sign in / Create account
2. Click "New Project"
3. Enter:
   - **Name:** `internship-lms`
   - **Password:** (create & save it!)
   - **Region:** (choose closest to you)
4. Click "Create new project"
5. ⏳ Wait 2-3 minutes for setup

### 2️⃣ Get Connection Strings (1 minute)

In Supabase Dashboard:
1. Click ⚙️ **Project Settings** (bottom left)
2. Click **Database** (left sidebar)
3. Scroll to **Connection string**

**Copy Transaction Mode URL:**
- Under "URI" tab → "Transaction pooler"
- Should end with `:6543/postgres?pgbouncer=true`

**Copy Direct URL:**
- Under "URI" tab → "Session pooler" 
- Should end with `:5432/postgres`

### 3️⃣ Update Your Environment (1 minute)

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"
PORT=3002
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

**Replace:**
- `[PASSWORD]` with your actual database password
- Update the connection strings with your actual URLs from Supabase

### 4️⃣ Run Migrations (1 minute)

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create database schema in Supabase
npx prisma migrate dev --name init_supabase

# Seed demo data
npx prisma db seed
```

### 5️⃣ Verify Setup (30 seconds)

```bash
# Start backend (if not running)
npm run start:dev

# In another terminal, from root directory:
.\tmp_rovodev_verify_supabase.ps1
```

You should see: **🎉 SUCCESS! Supabase PostgreSQL is connected and working!**

## ✅ Verify in Supabase Dashboard

Go to **Table Editor** in Supabase dashboard. You should see:

- ✅ `users` (7 rows)
- ✅ `courses` (1 row)
- ✅ `chapters` (4 rows)
- ✅ `course_assignments` (2 rows)
- ✅ `progress` (0 rows initially)
- ✅ `certificates` (0 rows initially)

## 🎯 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@internlms.com | admin123 |
| Mentor | mentor@internlms.com | mentor123 |
| Student | student1@internlms.com | student123 |

## 🐛 Troubleshooting

**"Connection refused"**
- Your IP is likely blocked. In Supabase Dashboard → Settings → Database → Connection pooling → Allow all IPs

**"Password authentication failed"**
- Double-check your password in the connection string
- Make sure there are no extra spaces

**"Migration failed"**
- Check DIRECT_URL is set correctly
- Try running: `npx prisma migrate reset` then `npx prisma migrate dev`

## 📚 Full Documentation

See: `tmp_rovodev_supabase_setup_instructions.md` for detailed instructions.

---

**Ready?** Follow steps 1-5 above and you'll be on Supabase PostgreSQL in 5 minutes! 🚀
