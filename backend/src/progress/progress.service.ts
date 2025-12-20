import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // Mark chapter as complete (Student only)
  async completeChapter(studentId: string, chapterId: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: {
          include: {
            chapters: {
              orderBy: { sequenceOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    // Verify student is assigned to this course
    const assignment = await this.prisma.courseAssignment.findUnique({
      where: {
        courseId_studentId: {
          courseId: chapter.courseId,
          studentId,
        },
      },
    });

    if (!assignment) {
      throw new ForbiddenException('You are not assigned to this course');
    }

    // Check if previous chapters are completed (sequential progression)
    const chapterIndex = chapter.course.chapters.findIndex(
      (c) => c.id === chapterId,
    );

    if (chapterIndex > 0) {
      const previousChapter = chapter.course.chapters[chapterIndex - 1];
      const previousProgress = await this.prisma.progress.findUnique({
        where: {
          studentId_chapterId: {
            studentId,
            chapterId: previousChapter.id,
          },
        },
      });

      if (!previousProgress) {
        throw new BadRequestException(
          'You must complete the previous chapter first',
        );
      }
    }

    // Create or update progress
    const progress = await this.prisma.progress.upsert({
      where: {
        studentId_chapterId: {
          studentId,
          chapterId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        studentId,
        chapterId,
      },
    });

    // Check if course is now 100% complete
    const allProgress = await this.prisma.progress.findMany({
      where: {
        studentId,
        chapter: {
          courseId: chapter.courseId,
        },
      },
    });

    const isComplete = allProgress.length === chapter.course.chapters.length;

    return {
      progress,
      isComplete,
      completedChapters: allProgress.length,
      totalChapters: chapter.course.chapters.length,
    };
  }

  // Get student's progress for all courses
  async getStudentProgress(studentId: string) {
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
          },
        },
      },
    });

    const progressData = await Promise.all(
      assignments.map(async (assignment) => {
        const progress = await this.prisma.progress.findMany({
          where: {
            studentId,
            chapter: {
              courseId: assignment.courseId,
            },
          },
          include: {
            chapter: true,
          },
        });

        const totalChapters = assignment.course.chapters.length;
        const completedChapters = progress.length;
        const completionPercentage =
          totalChapters > 0
            ? Math.round((completedChapters / totalChapters) * 100)
            : 0;

        const completedChapterIds = new Set(progress.map((p) => p.chapterId));
        const nextChapter = assignment.course.chapters.find(
          (chapter) => !completedChapterIds.has(chapter.id),
        );

        return {
          courseId: assignment.course.id,
          courseTitle: assignment.course.title,
          mentor: assignment.course.mentor,
          totalChapters,
          completedChapters,
          completionPercentage,
          isComplete: completionPercentage === 100,
          nextChapter: nextChapter
            ? {
                id: nextChapter.id,
                title: nextChapter.title,
                sequenceOrder: nextChapter.sequenceOrder,
              }
            : null,
          completedChaptersList: progress.map((p) => ({
            chapterId: p.chapter.id,
            chapterTitle: p.chapter.title,
            completedAt: p.completedAt,
          })),
        };
      }),
    );

    return progressData;
  }

  // Get progress for a specific course
  async getCourseProgress(studentId: string, courseId: string) {
    // Verify student is assigned to this course
    const assignment = await this.prisma.courseAssignment.findUnique({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
    });

    if (!assignment) {
      throw new ForbiddenException('You are not assigned to this course');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { sequenceOrder: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const progress = await this.prisma.progress.findMany({
      where: {
        studentId,
        chapter: {
          courseId,
        },
      },
    });

    const completedChapterIds = new Set(progress.map((p) => p.chapterId));

    const chaptersWithProgress = course.chapters.map((chapter, index) => ({
      ...chapter,
      isCompleted: completedChapterIds.has(chapter.id),
      isLocked:
        index > 0 && !completedChapterIds.has(course.chapters[index - 1].id),
      completedAt: progress.find((p) => p.chapterId === chapter.id)
        ?.completedAt,
    }));

    const totalChapters = course.chapters.length;
    const completedChapters = progress.length;
    const completionPercentage =
      totalChapters > 0
        ? Math.round((completedChapters / totalChapters) * 100)
        : 0;

    return {
      courseId: course.id,
      courseTitle: course.title,
      totalChapters,
      completedChapters,
      completionPercentage,
      isComplete: completionPercentage === 100,
      chapters: chaptersWithProgress,
    };
  }

  // Get student progress for mentor (Mentor can view their students' progress)
  async getStudentProgressForMentor(mentorId: string, courseId?: string) {
    const whereClause: any = {
      course: {
        mentorId,
      },
    };

    if (courseId) {
      whereClause.courseId = courseId;
    }

    const assignments = await this.prisma.courseAssignment.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          include: {
            chapters: true,
          },
        },
      },
    });

    const studentsProgress = await Promise.all(
      assignments.map(async (assignment) => {
        const progress = await this.prisma.progress.findMany({
          where: {
            studentId: assignment.studentId,
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
          student: assignment.student,
          courseId: assignment.course.id,
          courseTitle: assignment.course.title,
          assignedAt: assignment.assignedAt,
          totalChapters,
          completedChapters,
          completionPercentage,
          isComplete: completionPercentage === 100,
        };
      }),
    );

    return studentsProgress;
  }
}
