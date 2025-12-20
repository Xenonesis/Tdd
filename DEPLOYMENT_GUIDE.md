# Deployment Guide - Internship Learning Management System

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd tdd

# Install root dependencies (Frontend)
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Database Setup

The application uses PostgreSQL with Supabase for production-ready deployment.

#### Option A: Supabase (Recommended for Production)

1. Create a Supabase project at https://supabase.com
2. Get your connection strings (Transaction & Direct URLs)
3. Update `backend/.env` with your Supabase credentials
4. Run migrations:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

See `backend/SUPABASE_SETUP.md` for detailed instructions.

#### Option B: Local SQLite (Development Only)

For quick local testing, you can use SQLite:
1. Change `backend/prisma/schema.prisma` provider to `"sqlite"`
2. Set `DATABASE_URL="file:./dev.db"` in `backend/.env`
3. Run migrations as above

### Step 3: Environment Configuration

**Frontend** - Create `.env.local` in root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Backend** - Update `backend/.env` with your Supabase credentials:
```env
# Supabase PostgreSQL (see backend/SUPABASE_SETUP.md)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Step 4: Run the Application

**Option 1: Run both servers simultaneously (Recommended)**
```bash
# From root directory
npm run dev:all
```

**Option 2: Run servers separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run start:dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

## 👤 Test Credentials

After running the seed script, you can login with:

### Admin Account
- Email: `admin@lms.com`
- Password: `admin123`
- Capabilities: Manage all users, approve mentors, view analytics

### Mentor Account
- Email: `mentor@lms.com`
- Password: `mentor123`
- Capabilities: Create courses, add chapters, assign students, track progress

### Student Accounts
- Email: `student1@lms.com` or `student2@lms.com`
- Password: `student123`
- Capabilities: Access courses, complete chapters sequentially, earn certificates

## 📋 Feature Checklist

### ✅ Authentication & Authorization
- [x] JWT-based authentication
- [x] Role-based access control (RBAC)
- [x] Three roles: STUDENT, MENTOR, ADMIN
- [x] Protected routes and API endpoints
- [x] Mentor approval workflow

### ✅ Course Management
- [x] Mentors can create courses
- [x] Add chapters with sequential ordering
- [x] Upload images and video links
- [x] Assign courses to students
- [x] Course visibility restricted to assigned students

### ✅ Progress Tracking
- [x] Sequential chapter completion (no skipping)
- [x] Chapter locking mechanism
- [x] Progress percentage calculation
- [x] Visual progress indicators
- [x] Mentor can view student progress

### ✅ Certificate Generation
- [x] PDF certificate generation
- [x] Unlocked only at 100% completion
- [x] Downloadable anytime after completion
- [x] Includes course details and completion date

### ✅ Admin Features
- [x] User management
- [x] Mentor approval workflow
- [x] Platform analytics
- [x] View all courses
- [x] Activate/deactivate users

### ✅ UI/UX
- [x] Responsive design (mobile, tablet, desktop)
- [x] Role-based dashboards
- [x] Intuitive navigation
- [x] Professional design
- [x] Clear visual hierarchy

## 🧪 Testing

### Run Frontend Tests
```bash
npm run test
```

### Run Backend Tests
```bash
cd backend
npm run test

# E2E tests
npm run test:e2e
```

## 📁 Project Structure

```
.
├── app/                      # Next.js frontend
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── admin/               # Admin dashboard
│   │   ├── users/
│   │   ├── courses/
│   │   └── analytics/
│   ├── mentor/              # Mentor dashboard
│   │   ├── courses/
│   │   └── students/
│   ├── courses/             # Student course pages
│   ├── progress/            # Progress tracking
│   ├── certificates/        # Certificate management
│   └── dashboard/           # Main dashboard
├── components/              # Shared React components
│   ├── Navbar.tsx
│   └── CourseCard.tsx
├── lib/                     # Utilities and context
│   ├── auth/
│   └── axios.ts
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── courses/        # Course management
│   │   ├── progress/       # Progress tracking
│   │   ├── certificates/   # PDF generation
│   │   └── prisma/         # Database service
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.ts         # Seed data
└── package.json
```

## 🔑 Key Technologies

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Context** - State management

### Backend
- **NestJS** - Node.js framework
- **Prisma** - ORM and database toolkit
- **PostgreSQL (Supabase)** - Production database with connection pooling
- **JWT** - Authentication
- **PDFKit** - PDF generation
- **bcrypt** - Password hashing

## 🎯 User Workflows

### Student Workflow
1. Register as a student (instant activation)
2. Login and view assigned courses
3. Access course and view chapters
4. Complete chapters sequentially (can't skip)
5. Track progress percentage
6. Generate certificate upon 100% completion
7. Download certificate PDF

### Mentor Workflow
1. Register as a mentor (requires admin approval)
2. Wait for admin to activate account
3. Login after approval
4. Create courses with title and description
5. Add chapters with content, images, and video links
6. Assign courses to students
7. Track student progress

### Admin Workflow
1. Login with admin credentials
2. Review pending mentor applications
3. Approve or reject mentor accounts
4. Manage all users
5. View platform-wide analytics
6. Monitor all courses

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control at API level
- Protected routes on frontend
- Request validation and sanitization
- Sequential chapter access enforcement
- Certificate generation restricted to 100% completion

## 📊 Database Schema

Key entities:
- **Users**: Authentication and role management
- **Courses**: Course information and mentor ownership
- **Chapters**: Sequential course content
- **CourseAssignments**: Student enrollment
- **Progress**: Chapter completion tracking
- **Certificates**: PDF certificate records

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change frontend port
npm run dev -- -p 3002

# Change backend port in backend/.env
PORT=3002
```

**Database issues:**
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

**Can't login as mentor:**
- Mentor accounts require admin approval
- Login as admin and approve the mentor account first

**Certificate generation fails:**
- Ensure all chapters are completed (100%)
- Check that `backend/uploads/certificates` directory exists

## 🚢 Production Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-api.com/api`
3. Deploy

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET`
   - `FRONTEND_URL`
3. Run build command: `npm run build`
4. Start command: `npm run start:prod`

## 📝 API Documentation

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Protected Endpoints (requires JWT)
- `GET /api/courses/my` - Get user's courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/chapters` - Add chapter (Mentor)
- `POST /api/progress/:chapterId/complete` - Complete chapter (Student)
- `GET /api/certificates/my-certificates` - Get certificates (Student)
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id/approve-mentor` - Approve mentor (Admin)

## ✨ Future Enhancements

- [ ] Email notifications
- [ ] Real-time progress updates
- [ ] Discussion forums
- [ ] Quiz/assessment feature
- [ ] Batch certificate generation
- [ ] Advanced analytics
- [ ] Mobile app

## 📄 License

MIT License - Feel free to use this project for learning and development.
