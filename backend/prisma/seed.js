const bcrypt = require('bcrypt');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

async function main() {
  const { PrismaClient } = require('@prisma/client');
  
  // Create the libsql adapter with config
  const url = process.env.DATABASE_URL || 'file:./dev.db';
  const adapter = new PrismaLibSql({ url });
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log('🌱 Starting database seed...\n');
    console.log('📌 Connecting to database...');
    
    await prisma.$connect();
    console.log('✅ Database connected!\n');

    // Hash function
    const hashPassword = async (password) => {
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
        role: 'ADMIN',
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
        role: 'MENTOR',
        isActive: true,
      },
    });
    console.log('✅ Mentor created:', mentor.email);

    // Create a pending Mentor
    const pendingMentorPassword = await hashPassword('pending123');
    await prisma.user.upsert({
      where: { email: 'pending.mentor@internlms.com' },
      update: {},
      create: {
        email: 'pending.mentor@internlms.com',
        password: pendingMentorPassword,
        firstName: 'Pending',
        lastName: 'Mentor',
        role: 'MENTOR',
        isActive: false,
      },
    });
    console.log('✅ Pending Mentor created: pending.mentor@internlms.com');

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
        role: 'STUDENT',
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
        role: 'STUDENT',
        isActive: true,
      },
    });
    console.log('✅ Student 2 created:', student2.email);

    // Check if course exists
    let course = await prisma.course.findFirst({
      where: { title: 'Introduction to Web Development' },
    });
    
    if (!course) {
      course = await prisma.course.create({
        data: {
          title: 'Introduction to Web Development',
          description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
          mentorId: mentor.id,
        },
      });
    }
    console.log('✅ Course:', course.title);

    // Create Chapters
    const chaptersData = [
      { title: 'Getting Started with HTML', description: 'Learn the basics of HTML.' },
      { title: 'Styling with CSS', description: 'Make your HTML pages look beautiful with CSS.' },
      { title: 'JavaScript Fundamentals', description: 'Add interactivity with JavaScript.' },
      { title: 'Building Your First Project', description: 'Put it all together in a real project.' },
    ];

    for (let i = 0; i < chaptersData.length; i++) {
      const chapter = chaptersData[i];
      const existing = await prisma.chapter.findFirst({
        where: { courseId: course.id, sequenceOrder: i + 1 },
      });
      
      if (!existing) {
        await prisma.chapter.create({
          data: {
            courseId: course.id,
            title: chapter.title,
            description: chapter.description,
            sequenceOrder: i + 1,
          },
        });
      }
      console.log(`  📖 Chapter ${i + 1}: ${chapter.title}`);
    }

    // Assign students
    for (const student of [student1, student2]) {
      const existing = await prisma.courseAssignment.findFirst({
        where: { courseId: course.id, studentId: student.id },
      });
      
      if (!existing) {
        await prisma.courseAssignment.create({
          data: { courseId: course.id, studentId: student.id },
        });
      }
      console.log(`✅ ${student.firstName} assigned to course`);
    }

    console.log('\n✨ Database seeding completed!\n');
    console.log('📋 Demo Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:   admin@internlms.com / admin123');
    console.log('Mentor:  mentor@internlms.com / mentor123');
    console.log('Pending: pending.mentor@internlms.com / pending123');
    console.log('Student: student1@internlms.com / student123');
    console.log('Student: student2@internlms.com / student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during seeding:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
