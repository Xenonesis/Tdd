import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  course: {
    count: jest.fn(),
  },
  certificate: {
    count: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('approveMentor', () => {
    it('should approve a pending mentor', async () => {
      const userId = 'mentor-1';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        role: 'MENTOR',
        isActive: false,
      });

      mockPrismaService.user.update.mockResolvedValue({
        id: userId,
        role: 'MENTOR',
        isActive: true,
      });

      const result = await service.approveMentor(userId);

      expect(result.isActive).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: userId },
          data: { isActive: true },
        }),
      );
    });

    it('should throw BadRequestException if user is not a mentor', async () => {
      const userId = 'student-1';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        role: 'STUDENT',
        isActive: true,
      });

      await expect(service.approveMentor(userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if mentor is already active', async () => {
      const userId = 'mentor-active';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        role: 'MENTOR',
        isActive: true,
      });

      await expect(service.approveMentor(userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getPlatformStats', () => {
    it('should return aggregated stats', async () => {
      mockPrismaService.user.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5) // students
        .mockResolvedValueOnce(3) // mentors
        .mockResolvedValueOnce(2) // admins
        .mockResolvedValueOnce(2) // active mentors
        .mockResolvedValueOnce(1); // pending mentors

      mockPrismaService.course.count.mockResolvedValue(4);
      mockPrismaService.certificate.count.mockResolvedValue(2);

      const stats = await service.getPlatformStats();

      expect(stats.users.total).toBe(10);
      expect(stats.courses).toBe(4);
      expect(stats.certificates).toBe(2);
    });
  });
});
