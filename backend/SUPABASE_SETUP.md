# Supabase Database Setup Guide

This guide will help you connect your Internship LMS backend to Supabase PostgreSQL.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose your organization
4. Enter a project name (e.g., `internship-lms`)
5. Set a strong database password (save this!)
6. Select your region
7. Click **"Create new project"** and wait for setup

## Step 2: Get Your Connection Strings

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click on **Database** in the left sidebar
3. Scroll down to **Connection string** section
4. You'll see two types of connection strings:

### Transaction Mode (for `DATABASE_URL`)

- Click on **URI** tab under **Transaction pooler**
- Copy the connection string
- It looks like:
  ```
  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

### Session Mode (for `DIRECT_URL`)

- Click on **URI** tab under **Session pooler** or **Direct connection**
- Copy the connection string
- It looks like:
  ```
  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
  ```

## Step 3: Update Your `.env` File

Open `backend/.env` and update with your Supabase credentials:

```env
# Supabase PostgreSQL Database
# Transaction mode - used for general database operations
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection - used for migrations
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# JWT Configuration (keep your existing values)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_EXPIRATION="7d"

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important:** Replace the placeholders:

- `[YOUR-PROJECT-REF]` - Your Supabase project reference (e.g., `abcdefghijk`)
- `[YOUR-PASSWORD]` - Your database password
- `[REGION]` - Your region (e.g., `us-east-1`, `ap-south-1`)

## Step 4: Run Prisma Migrations

After updating your `.env` file, run these commands:

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

## Step 5: Verify Connection

Run the backend server and test:

```bash
npm run start:dev
```

If everything is working, you should see your tables in Supabase Dashboard → Table Editor.

## Troubleshooting

### "Connection refused" error

- Check if your IP is allowed in Supabase Dashboard → Project Settings → Database → Network restrictions

### "Password authentication failed"

- Verify your database password in the connection string
- Reset password in Supabase Dashboard → Project Settings → Database → Database password

### "Prepared statement already exists"

- Make sure `?pgbouncer=true` is added to your `DATABASE_URL`
- Use `DIRECT_URL` for migrations (already configured in schema)

## Why Two Connection Strings?

- **DATABASE_URL** (Transaction mode with PgBouncer): Used for general application queries. PgBouncer pools connections efficiently.
- **DIRECT_URL** (Session/Direct mode): Used for Prisma migrations which require a persistent connection.

This setup is already configured in `prisma/schema.prisma`.
