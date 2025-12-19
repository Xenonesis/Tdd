import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✓ Admin user created');

  // Create Mentor user (active)
  const mentorPassword = await bcrypt.hash('mentor123', 10);
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@lms.com' },
    update: {},
    create: {
      email: 'mentor@lms.com',
      password: mentorPassword,
      firstName: 'John',
      lastName: 'Mentor',
      role: 'MENTOR',
      isActive: true,
    },
  });
  console.log('✓ Mentor user created');

  // Create Student users
  const studentPassword = await bcrypt.hash('student123', 10);
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@lms.com' },
    update: {},
    create: {
      email: 'student1@lms.com',
      password: studentPassword,
      firstName: 'Alice',
      lastName: 'Student',
      role: 'STUDENT',
      isActive: true,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@lms.com' },
    update: {},
    create: {
      email: 'student2@lms.com',
      password: studentPassword,
      firstName: 'Bob',
      lastName: 'Learner',
      role: 'STUDENT',
      isActive: true,
    },
  });
  console.log('✓ Student users created');

  // Create a sample course
  const course = await prisma.course.create({
    data: {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript',
      mentorId: mentor.id,
    },
  });
  console.log('✓ Sample course created');

  // Create chapters
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'HTML Basics',
      description: 'Learn the structure and semantics of HTML. Understand tags, attributes, and document structure.',
      imageUrl: 'https://via.placeholder.com/800x400?text=HTML+Basics',
      videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
      sequenceOrder: 1,
    },
  });

  const chapter2 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'CSS Fundamentals',
      description: 'Style your web pages with CSS. Learn selectors, properties, and layout techniques.',
      imageUrl: 'https://via.placeholder.com/800x400?text=CSS+Fundamentals',
      videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
      sequenceOrder: 2,
    },
  });

  const chapter3 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'JavaScript Essentials',
      description: 'Add interactivity to your websites with JavaScript. Learn variables, functions, and DOM manipulation.',
      imageUrl: 'https://via.placeholder.com/800x400?text=JavaScript+Essentials',
      videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
      sequenceOrder: 3,
    },
  });
  console.log('✓ Chapters created');

  // Assign course to students
  await prisma.courseAssignment.create({
    data: {
      courseId: course.id,
      studentId: student1.id,
    },
  });

  await prisma.courseAssignment.create({
    data: {
      courseId: course.id,
      studentId: student2.id,
    },
  });
  console.log('✓ Course assigned to students');

  // Add some progress for student1
  await prisma.progress.create({
    data: {
      studentId: student1.id,
      chapterId: chapter1.id,
    },
  });
  console.log('✓ Sample progress added');

  console.log('\n🎉 Seeding completed successfully!\n');
  console.log('Test Credentials:');
  console.log('================');
  console.log('Admin:');
  console.log('  Email: admin@lms.com');
  console.log('  Password: admin123');
  console.log('\nMentor:');
  console.log('  Email: mentor@lms.com');
  console.log('  Password: mentor123');
  console.log('\nStudent:');
  console.log('  Email: student1@lms.com or student2@lms.com');
  console.log('  Password: student123\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
