-- Internship LMS Database Schema for Supabase
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- Create Role enum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN');

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Create courses table
CREATE TABLE IF NOT EXISTS "courses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS "chapters" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "sequenceOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for courseId + sequenceOrder
CREATE UNIQUE INDEX IF NOT EXISTS "chapters_courseId_sequenceOrder_key" ON "chapters"("courseId", "sequenceOrder");

-- Create course_assignments table
CREATE TABLE IF NOT EXISTS "course_assignments" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_assignments_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for courseId + studentId
CREATE UNIQUE INDEX IF NOT EXISTS "course_assignments_courseId_studentId_key" ON "course_assignments"("courseId", "studentId");

-- Create progress table
CREATE TABLE IF NOT EXISTS "progress" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "studentId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for studentId + chapterId
CREATE UNIQUE INDEX IF NOT EXISTS "progress_studentId_chapterId_key" ON "progress"("studentId", "chapterId");

-- Create certificates table
CREATE TABLE IF NOT EXISTS "certificates" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for studentId + courseId
CREATE UNIQUE INDEX IF NOT EXISTS "certificates_studentId_courseId_key" ON "certificates"("studentId", "courseId");

-- Add foreign key constraints
ALTER TABLE "courses" ADD CONSTRAINT "courses_mentorId_fkey" 
    FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chapters" ADD CONSTRAINT "chapters_courseId_fkey" 
    FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "course_assignments" ADD CONSTRAINT "course_assignments_courseId_fkey" 
    FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "course_assignments" ADD CONSTRAINT "course_assignments_studentId_fkey" 
    FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "progress" ADD CONSTRAINT "progress_studentId_fkey" 
    FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "progress" ADD CONSTRAINT "progress_chapterId_fkey" 
    FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "certificates" ADD CONSTRAINT "certificates_studentId_fkey" 
    FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "certificates" ADD CONSTRAINT "certificates_courseId_fkey" 
    FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create trigger for updatedAt on users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON "courses"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database schema created successfully!' as message;
