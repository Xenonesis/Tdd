import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

const mockPrismaService = {
  chapter: {
    findUnique: jest.fn(),
  },
  courseAssignment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  progress: {
    findUnique: jest.fn(),
    create: jest.fn(),
    upsert: jest.fn(),
    findMany: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
};

describe('ProgressService', () => {
  let service: ProgressService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('completeChapter', () => {
    it('should throw ForbiddenException if student is not assigned', async () => {
      const studentId = 'student-1';
      const chapterId = 'chapter-1';

      mockPrismaService.chapter.findUnique.mockResolvedValue({
        id: chapterId,
        courseId: 'course-1',
        course: { chapters: [] },
      });

      mockPrismaService.courseAssignment.findUnique.mockResolvedValue(null);

      await expect(
        service.completeChapter(studentId, chapterId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if previous chapter is not completed', async () => {
      const studentId = 'student-1';
      const chapterId = 'chapter-2';
      const courseId = 'course-1';

      const chapters = [
        { id: 'chapter-1', sequenceOrder: 1 },
        { id: 'chapter-2', sequenceOrder: 2 },
      ];

      mockPrismaService.chapter.findUnique.mockResolvedValue({
        id: chapterId,
        courseId,
        course: {
          chapters: chapters,
        },
      });

      mockPrismaService.courseAssignment.findUnique.mockResolvedValue({
        id: 'assign-1',
      });

      // Mock that chapter 1 progress is missing
      mockPrismaService.progress.findUnique.mockResolvedValue(null);

      await expect(
        service.completeChapter(studentId, chapterId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should complete chapter if sequence is valid', async () => {
      const studentId = 'student-1';
      const chapterId = 'chapter-2';
      const courseId = 'course-1';

      const chapters = [
        { id: 'chapter-1', sequenceOrder: 1 },
        { id: 'chapter-2', sequenceOrder: 2 },
      ];

      mockPrismaService.chapter.findUnique.mockResolvedValue({
        id: chapterId,
        courseId,
        course: { chapters },
      });

      mockPrismaService.courseAssignment.findUnique.mockResolvedValue({
        id: 'assign-1',
      });

      // Mock previous chapter progress exists
      mockPrismaService.progress.findUnique.mockResolvedValue({
        id: 'progress-1',
        completedAt: new Date(),
      });

      mockPrismaService.progress.upsert.mockResolvedValue({
        id: 'progress-2',
        studentId,
        chapterId,
        completedAt: new Date(),
      });

      mockPrismaService.progress.findMany.mockResolvedValue([
        { id: 'progress-1' },
        { id: 'progress-2' },
      ]);

      const result = await service.completeChapter(studentId, chapterId);

      expect(result.progress.id).toBe('progress-2');
      expect(result.isComplete).toBe(true);
    });
  });
});
