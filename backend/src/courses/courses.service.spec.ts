import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockPrismaService = {
  course: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  chapter: {
    create: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
  },
  courseAssignment: {
    create: jest.fn(),
    createMany: jest.fn(),
    upsert: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
  },
};

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCourse', () => {
    it('should create a new course', async () => {
      const dto = {
        title: 'Test Course',
        description: 'Test Description',
        mentorId: 'mentor-123',
      };

      const result = {
        id: 'course-123',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.course.create.mockResolvedValue(result);

      const course = await service.createCourse(
        dto.mentorId,
        dto.title,
        dto.description,
      );

      expect(course).toEqual(result);
      expect(prisma.course.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            title: dto.title,
            description: dto.description,
            mentorId: dto.mentorId,
          },
        }),
      );
    });
  });

  describe('assignCourse', () => {
    it('should assign students to a course', async () => {
      const courseId = 'course-123';
      const mentorId = 'mentor-123';
      const studentIds = ['student-1', 'student-2'];

      mockPrismaService.course.findUnique.mockResolvedValue({
        id: courseId,
        mentorId: mentorId,
      });

      mockPrismaService.user.findMany.mockResolvedValue([
        { id: 'student-1', role: 'STUDENT' },
        { id: 'student-2', role: 'STUDENT' },
      ]);

      const mockAssignment = {
        id: 'assignment-1',
        courseId,
        studentId: 'student-1',
      };
      mockPrismaService.courseAssignment.upsert.mockResolvedValue(
        mockAssignment,
      );

      const result = await service.assignCourse(courseId, mentorId, studentIds);

      expect(result).toHaveLength(2);
      expect(prisma.courseAssignment.upsert).toHaveBeenCalledTimes(2);
    });

    it('should fail if user is not the mentor of the course', async () => {
      const courseId = 'course-123';

      mockPrismaService.course.findUnique.mockResolvedValue({
        id: courseId,
        mentorId: 'different-mentor',
      });

      await expect(
        service.assignCourse(courseId, 'mentor-123', ['student-1']),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addChapter', () => {
    it('should add a chapter to a course', async () => {
      const courseId = 'course-123';
      const mentorId = 'mentor-123';
      const chapterData = {
        title: 'Chapter 1',
        description: 'Desc',
        imageUrl: 'http://img.com',
        videoUrl: 'http://vid.com',
      };

      mockPrismaService.course.findUnique.mockResolvedValue({
        id: courseId,
        mentorId: mentorId,
        chapters: [],
      });

      mockPrismaService.chapter.count.mockResolvedValue(0);

      mockPrismaService.chapter.create.mockResolvedValue({
        id: 'chapter-1',
        courseId,
        sequenceOrder: 1,
        ...chapterData,
      });

      const result = await service.addChapter(
        courseId,
        mentorId,
        chapterData.title,
        chapterData.description,
        chapterData.imageUrl,
        chapterData.videoUrl,
      );

      expect(result.sequenceOrder).toBe(1);
      expect(prisma.chapter.create).toHaveBeenCalled();
    });
  });
});
