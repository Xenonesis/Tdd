# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
# Root (Frontend)
npm install

# Backend
cd backend && npm install && cd ..
```

### Step 2: Configure Database (Supabase)

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Get your connection string from Project Settings > Database
3. Update `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```

### Step 3: Set Up Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 4: Create Environment Files

**Frontend**: Create `.env.local` in root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Backend**: Update `backend/.env` with your values (already exists)

### Step 5: Run the Application
```bash
npm run dev:all
```

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## 📝 First Test

1. Go to http://localhost:3000/register
2. Create an account (default role: STUDENT)
3. Login at http://localhost:3000/login
4. View your dashboard at http://localhost:3000/dashboard

## 🧪 Run Tests

```bash
# Frontend tests
npm run test

# Backend tests
npm run test:backend

# E2E tests
npm run test:e2e
```

## 🔑 Testing Different Roles

Create users with different roles to test RBAC:
- **STUDENT**: Limited access
- **MENTOR**: Can generate certificates
- **ADMIN**: Full access

## 📚 API Endpoints

### Public
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Protected
- `GET /api/auth/profile` - Get profile (requires JWT)
- `POST /api/certificates` - Generate certificate (ADMIN/MENTOR only)
- `GET /api/certificates/my-certificates` - Get my certificates

## 🐛 Troubleshooting

**Can't connect to database?**
- Check your DATABASE_URL in `backend/.env`
- Verify Supabase project is active
- Run `npm run prisma:migrate` again

**CORS errors?**
- Ensure `FRONTEND_URL` in backend/.env matches your frontend URL
- Restart backend server

**Port conflicts?**
- Change PORT in `backend/.env` (default: 3001)
- Change frontend port: `npm run dev -- -p 3002`

## 📦 Project Structure

```
.
├── app/                # Next.js frontend
│   ├── (auth)/        # Auth pages (login/register)
│   ├── dashboard/     # Protected dashboard
│   └── layout.tsx     # Root layout with AuthProvider
├── lib/               # Shared utilities
│   ├── auth/          # Auth context & protected routes
│   └── axios.ts       # Axios configuration
├── backend/           # NestJS backend
│   ├── src/
│   │   ├── auth/     # JWT authentication
│   │   ├── certificates/  # PDF generation
│   │   └── prisma/   # Prisma service
│   └── prisma/
│       └── schema.prisma  # Database schema
└── package.json
```

## 🎯 Next Steps

1. Customize the Prisma schema for your use case
2. Add more protected routes and RBAC examples
3. Implement certificate generation UI
4. Add more comprehensive tests
5. Deploy to production (Vercel + Railway/Render)

## 📖 Full Documentation

See [README.md](./README.md) for complete documentation.
