import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  // Create a new course (Mentor only)
  async createCourse(mentorId: string, title: string, description: string) {
    return this.prisma.course.create({
      data: {
        title,
        description,
        mentorId,
      },
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  // Get courses created by a specific mentor
  async getMentorCourses(mentorId: string) {
    return this.prisma.course.findMany({
      where: { mentorId },
      include: {
        chapters: {
          orderBy: { sequenceOrder: 'asc' },
        },
        assignments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            chapters: true,
            assignments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get courses assigned to a student
  async getStudentCourses(studentId: string) {
    const assignments = await this.prisma.courseAssignment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            mentor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            chapters: {
              orderBy: { sequenceOrder: 'asc' },
            },
            _count: {
              select: {
                chapters: true,
              },
            },
          },
        },
      },
    });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      assignments.map(async (assignment) => {
        const progress = await this.prisma.progress.findMany({
          where: {
            studentId,
            chapter: {
              courseId: assignment.courseId,
            },
          },
        });

        const totalChapters = assignment.course.chapters.length;
        const completedChapters = progress.length;
        const completionPercentage =
          totalChapters > 0
            ? Math.round((completedChapters / totalChapters) * 100)
            : 0;

        return {
          ...assignment.course,
          assignedAt: assignment.assignedAt,
          completedChapters,
          totalChapters,
          completionPercentage,
        };
      }),
    );

    return coursesWithProgress;
  }

  // Get a specific course with details
  async getCourseById(courseId: string, userId: string, userRole: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        chapters: {
          orderBy: { sequenceOrder: 'asc' },
        },
        assignments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check access permissions
    if (userRole === 'STUDENT') {
      const assignment = await this.prisma.courseAssignment.findUnique({
        where: {
          courseId_studentId: {
            courseId,
            studentId: userId,
          },
        },
      });

      if (!assignment) {
        throw new ForbiddenException('You do not have access to this course');
      }

      // Get student's progress
      const progress = await this.prisma.progress.findMany({
        where: {
          studentId: userId,
          chapter: {
            courseId,
          },
        },
      });

      return {
        ...course,
        progress: progress.map((p) => p.chapterId),
      };
    }

    if (userRole === 'MENTOR' && course.mentorId !== userId) {
      throw new ForbiddenException('You can only access courses you created');
    }

    return course;
  }

  // Update course (Mentor only)
  async updateCourse(
    courseId: string,
    mentorId: string,
    title?: string,
    description?: string,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.mentorId !== mentorId) {
      throw new ForbiddenException('You can only update courses you created');
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
      },
    });
  }

  // Delete course (Mentor only)
  async deleteCourse(courseId: string, mentorId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.mentorId !== mentorId) {
      throw new ForbiddenException('You can only delete courses you created');
    }

    return this.prisma.course.delete({
      where: { id: courseId },
    });
  }

  // Add chapter to course (Mentor only)
  async addChapter(
    courseId: string,
    mentorId: string,
    title: string,
    description: string,
    imageUrl?: string,
    videoUrl?: string,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { sequenceOrder: 'desc' },
          take: 1,
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.mentorId !== mentorId) {
      throw new ForbiddenException(
        'You can only add chapters to courses you created',
      );
    }

    const nextSequenceOrder =
      course.chapters.length > 0 ? course.chapters[0].sequenceOrder + 1 : 1;

    return this.prisma.chapter.create({
      data: {
        courseId,
        title,
        description,
        imageUrl,
        videoUrl,
        sequenceOrder: nextSequenceOrder,
      },
    });
  }

  // Get chapters for a course
  async getCourseChapters(courseId: string, userId: string, userRole: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check access for students
    if (userRole === 'STUDENT') {
      const assignment = await this.prisma.courseAssignment.findUnique({
        where: {
          courseId_studentId: {
            courseId,
            studentId: userId,
          },
        },
      });

      if (!assignment) {
        throw new ForbiddenException('You do not have access to this course');
      }
    }

    // Check access for mentors
    if (userRole === 'MENTOR' && course.mentorId !== userId) {
      throw new ForbiddenException(
        'You can only access chapters from courses you created',
      );
    }

    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      orderBy: { sequenceOrder: 'asc' },
    });

    // For students, include their progress
    if (userRole === 'STUDENT') {
      const progress = await this.prisma.progress.findMany({
        where: {
          studentId: userId,
          chapterId: {
            in: chapters.map((c) => c.id),
          },
        },
      });

      const completedChapterIds = new Set(progress.map((p) => p.chapterId));

      return chapters.map((chapter, index) => ({
        ...chapter,
        isCompleted: completedChapterIds.has(chapter.id),
        isLocked: index > 0 && !completedChapterIds.has(chapters[index - 1].id),
      }));
    }

    return chapters;
  }

  // Assign course to students (Mentor only)
  async assignCourse(courseId: string, mentorId: string, studentIds: string[]) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.mentorId !== mentorId) {
      throw new ForbiddenException('You can only assign courses you created');
    }

    // Verify all students exist and have STUDENT role
    const students = await this.prisma.user.findMany({
      where: {
        id: { in: studentIds },
        role: 'STUDENT',
      },
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('One or more student IDs are invalid');
    }

    // Create assignments (skip if already exists)
    const assignments = await Promise.all(
      studentIds.map(async (studentId) => {
        return this.prisma.courseAssignment.upsert({
          where: {
            courseId_studentId: {
              courseId,
              studentId,
            },
          },
          update: {},
          create: {
            courseId,
            studentId,
          },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
      }),
    );

    return assignments;
  }

  // Get all courses (Admin only)
  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            assignments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
