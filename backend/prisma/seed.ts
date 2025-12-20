import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Prisma for PostgreSQL with adapter
// Parse the connection string to properly handle URL-encoded passwords
const connectionString = process.env.DATABASE_URL!;
const url = new URL(connectionString);

const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port),
  user: url.username,
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Define Role enum matching Prisma schema
type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Hash function
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  // Create Admin User
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@internlms.com' },
    update: {},
    create: {
      email: 'admin@internlms.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'ADMIN' as Role,
      isActive: true,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create a Mentor (approved)
  const mentorPassword = await hashPassword('mentor123');
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@internlms.com' },
    update: {},
    create: {
      email: 'mentor@internlms.com',
      password: mentorPassword,
      firstName: 'John',
      lastName: 'Mentor',
      role: 'MENTOR' as Role,
      isActive: true,
    },
  });
  console.log('✅ Mentor created:', mentor.email);

  // Create a pending Mentor (for testing approval workflow)
  const pendingMentorPassword = await hashPassword('pending123');
  const pendingMentor = await prisma.user.upsert({
    where: { email: 'pending.mentor@internlms.com' },
    update: {},
    create: {
      email: 'pending.mentor@internlms.com',
      password: pendingMentorPassword,
      firstName: 'Pending',
      lastName: 'Mentor',
      role: 'MENTOR' as Role,
      isActive: false, // Requires admin approval
    },
  });
  console.log('✅ Pending Mentor created:', pendingMentor.email);

  // Create Students
  const studentPassword = await hashPassword('student123');
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@internlms.com' },
    update: {},
    create: {
      email: 'student1@internlms.com',
      password: studentPassword,
      firstName: 'Alice',
      lastName: 'Student',
      role: 'STUDENT' as Role,
      isActive: true,
    },
  });
  console.log('✅ Student 1 created:', student1.email);

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@internlms.com' },
    update: {},
    create: {
      email: 'student2@internlms.com',
      password: studentPassword,
      firstName: 'Bob',
      lastName: 'Student',
      role: 'STUDENT' as Role,
      isActive: true,
    },
  });
  console.log('✅ Student 2 created:', student2.email);

  // Create Sample Course
  const course = await prisma.course.upsert({
    where: { id: 'sample-course-1' },
    update: {},
    create: {
      id: 'sample-course-1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. This comprehensive course covers everything you need to get started building websites.',
      mentorId: mentor.id,
    },
  });
  console.log('✅ Course created:', course.title);

  // Create Chapters for the course
  const chapters = [
    {
      title: 'Getting Started with HTML',
      description: 'In this chapter, you will learn the basics of HTML (HyperText Markup Language), the standard language for creating web pages.\n\nTopics covered:\n- What is HTML?\n- HTML document structure\n- Common HTML tags (headings, paragraphs, lists)\n- Creating your first HTML page\n\nBy the end of this chapter, you will be able to create a basic HTML document with proper structure.',
      sequenceOrder: 1,
    },
    {
      title: 'Styling with CSS',
      description: 'CSS (Cascading Style Sheets) is used to style and layout web pages. In this chapter, you will learn how to make your HTML pages look beautiful.\n\nTopics covered:\n- CSS syntax and selectors\n- Colors, fonts, and text styling\n- Box model (margin, padding, border)\n- Layout techniques (Flexbox, Grid)\n\nPractice exercises included to reinforce your learning.',
      sequenceOrder: 2,
    },
    {
      title: 'JavaScript Fundamentals',
      description: 'JavaScript brings interactivity to your web pages. This chapter covers the core concepts of JavaScript programming.\n\nTopics covered:\n- Variables and data types\n- Functions and scope\n- DOM manipulation\n- Event handling\n- Async programming basics\n\nYou will build interactive features for your web pages.',
      sequenceOrder: 3,
    },
    {
      title: 'Building Your First Project',
      description: 'Put everything together! In this final chapter, you will build a complete web project using HTML, CSS, and JavaScript.\n\nProject: Personal Portfolio Website\n- Responsive design\n- Navigation menu\n- Contact form\n- Image gallery\n- Smooth animations\n\nCongratulations on completing the course!',
      sequenceOrder: 4,
    },
  ];

  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: {
        courseId_sequenceOrder: {
          courseId: course.id,
          sequenceOrder: chapter.sequenceOrder,
        },
      },
      update: {},
      create: {
        courseId: course.id,
        title: chapter.title,
        description: chapter.description,
        sequenceOrder: chapter.sequenceOrder,
      },
    });
    console.log(`  📖 Chapter ${chapter.sequenceOrder}: ${chapter.title}`);
  }

  // Assign students to the course
  await prisma.courseAssignment.upsert({
    where: {
      courseId_studentId: {
        courseId: course.id,
        studentId: student1.id,
      },
    },
    update: {},
    create: {
      courseId: course.id,
      studentId: student1.id,
    },
  });
  console.log(`✅ ${student1.firstName} assigned to course`);

  await prisma.courseAssignment.upsert({
    where: {
      courseId_studentId: {
        courseId: course.id,
        studentId: student2.id,
      },
    },
    update: {},
    create: {
      courseId: course.id,
      studentId: student2.id,
    },
  });
  console.log(`✅ ${student2.firstName} assigned to course`);

  console.log('\n✨ Database seeding completed!\n');
  console.log('📋 Demo Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:   admin@internlms.com / admin123');
  console.log('Mentor:  mentor@internlms.com / mentor123');
  console.log('Pending: pending.mentor@internlms.com / pending123');
  console.log('Student: student1@internlms.com / student123');
  console.log('Student: student2@internlms.com / student123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
