# Full-Stack TDD Application

A modern full-stack application built with Next.js, NestJS, Prisma, and Supabase PostgreSQL with JWT authentication, RBAC, and PDF certificate generation.

## 🚀 Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling
- **Axios** for API calls
- **React Testing Library** + **Jest** for testing
- **ESLint** + **Prettier** for code quality

### Backend
- **NestJS** (Node.js framework)
- **TypeScript**
- **Prisma ORM** (Database management)
- **Supabase PostgreSQL** (Relational database)
- **JWT Authentication** (Access tokens)
- **Role-Based Access Control** (RBAC: Student | Mentor | Admin)
- **PDFKit** (Certificate generation)
- **Jest** + **Supertest** (Testing)

## 📁 Project Structure

```
.
├── app/                    # Next.js app directory (frontend)
├── lib/                    # Shared utilities and contexts
│   ├── auth/              # Authentication context & protected routes
│   └── axios.ts           # Axios configuration
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── auth/         # JWT authentication module
│   │   ├── certificates/ # PDF certificate generation
│   │   ├── prisma/       # Prisma service
│   │   └── main.ts       # Backend entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── test/             # E2E tests
├── public/               # Static assets
└── package.json          # Root dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (or PostgreSQL database)

### 1. Clone and Install Dependencies

```bash
# Install root dependencies (frontend)
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set Up Environment Variables

#### Frontend (.env.local)
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Backend (backend/.env)
Create a `.env` file in the `backend` directory:

```env
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://username:password@db.xxxxxxxxxxxx.supabase.co:5432/postgres?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"

# Application Configuration
PORT=3001
NODE_ENV="development"

# CORS Configuration
FRONTEND_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view your database
npm run prisma:studio
```

### 4. Run the Application

#### Development Mode

```bash
# Run both frontend and backend concurrently
npm run dev:all

# Or run them separately:
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## 🔐 Authentication & RBAC

### User Roles
- **STUDENT**: Default role, limited access
- **MENTOR**: Can generate certificates for students
- **ADMIN**: Full access to all resources

### API Endpoints

#### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Protected Endpoints
- `GET /api/auth/profile` - Get current user profile
- `POST /api/certificates` - Generate certificate (Admin/Mentor only)
- `GET /api/certificates/my-certificates` - Get user's certificates
- `GET /api/certificates/:id` - Get certificate by ID

### JWT Token Storage
Tokens are stored in localStorage and automatically attached to requests via Axios interceptor.

## 🧪 Testing

### Frontend Tests
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Backend Tests
```bash
# Unit tests
npm run test:backend

# E2E tests
npm run test:e2e
```

## 📄 PDF Certificate Generation

Certificates are automatically generated using PDFKit when requested by Admin or Mentor users. Generated PDFs are stored in `backend/uploads/certificates/`.

### Generate a Certificate
```typescript
POST /api/certificates
{
  "userId": "user-uuid",
  "title": "Course Name",
  "description": "Optional description"
}
```

## 🎨 Code Quality

### Linting
```bash
# Run ESLint
npm run lint

# Fix issues automatically
npm run lint:fix
```

### Formatting
```bash
# Format all files with Prettier
npm run format
```

## 📦 Building for Production

```bash
# Build frontend
npm run build

# Build backend
npm run build:backend

# Start production servers
npm run start          # Frontend
npm run start:backend  # Backend
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as a template
2. **Use strong JWT secrets** - Generate random strings for production
3. **Enable Supabase Row Level Security (RLS)** for additional protection
4. **Validate all inputs** - Using class-validator in NestJS
5. **Hash passwords** - Using bcrypt (10 rounds)
6. **CORS configuration** - Restrict to trusted origins in production

## 📚 API Documentation

### Authentication Flow
1. User registers/logs in → Receives JWT token
2. Token stored in localStorage
3. Axios interceptor adds token to all requests
4. Backend validates token with JWT strategy
5. RBAC guards check user roles

### Database Models
- **User**: Authentication and profile
- **Certificate**: Generated certificates
- **Session**: Mentor-student sessions (extensible)

## 🤝 Development Workflow

1. **Make changes** to code
2. **Lint and format**: `npm run lint:fix && npm run format`
3. **Write tests** for new features
4. **Run tests**: `npm run test`
5. **Commit changes** with descriptive messages

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for signing JWT tokens | Random 32+ character string |
| `JWT_EXPIRATION` | Token expiration time | `7d`, `24h`, `30m` |
| `PORT` | Backend server port | `3001` |
| `NODE_ENV` | Environment mode | `development`, `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend API URL (frontend) | `http://localhost:3001/api` |

## 🐛 Troubleshooting

### Common Issues

**Database connection fails**
- Verify your `DATABASE_URL` in `backend/.env`
- Check Supabase dashboard for connection string
- Ensure your IP is whitelisted in Supabase

**Port already in use**
- Change `PORT` in `backend/.env`
- Kill existing processes: `lsof -ti:3001 | xargs kill -9` (Mac/Linux)

**CORS errors**
- Verify `FRONTEND_URL` matches your frontend URL
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

## 📄 License

MIT

## 🙏 Acknowledgments

Built with Test-Driven Development (TDD) principles.
