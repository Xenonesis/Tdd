import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
  courseAssignment: {
    findUnique: jest.fn(),
  },
  progress: {
    findMany: jest.fn(),
  },
  certificate: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};

describe('CertificatesService', () => {
  let service: CertificatesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
    prisma = module.get<PrismaService>(PrismaService);

    // Mock PDF creation to avoid writes
    jest.spyOn<any, any>(service, 'createPDF').mockResolvedValue('/uploads/cert.pdf');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCertificate', () => {
    it('should throw BadRequestException if course is not 100% complete', async () => {
      const studentId = 'student-1';
      const courseId = 'course-1';

      mockPrismaService.user.findUnique.mockResolvedValue({ id: studentId });
      
      mockPrismaService.course.findUnique.mockResolvedValue({
        id: courseId,
        chapters: [{ id: 'ch-1' }, { id: 'ch-2' }],
      });

      mockPrismaService.courseAssignment.findUnique.mockResolvedValue({ id: 'assign-1' });

      // Only 1 chapter completed
      mockPrismaService.progress.findMany.mockResolvedValue([{ id: 'prog-1' }]);

      await expect(service.generateCertificate(studentId, courseId))
        .rejects.toThrow(BadRequestException);
    });

    it('should generate certificate if eligible', async () => {
      const studentId = 'student-1';
      const courseId = 'course-1';
      const chapters = [{ id: 'ch-1' }];

      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: studentId, 
        firstName: 'John', 
        lastName: 'Doe' 
      });

      mockPrismaService.course.findUnique.mockResolvedValue({
        id: courseId,
        title: 'TS101',
        chapters,
      });

      mockPrismaService.courseAssignment.findUnique.mockResolvedValue({ id: 'assign-1' });

      mockPrismaService.progress.findMany.mockResolvedValue([{ id: 'prog-1' }]); // 1 of 1 completed
      
      mockPrismaService.certificate.findUnique.mockResolvedValue(null); // No existing cert

      mockPrismaService.certificate.create.mockResolvedValue({
        id: 'cert-1',
        studentId,
        courseId
      });

      mockPrismaService.certificate.update.mockResolvedValue({
        id: 'cert-1',
        pdfUrl: '/uploads/cert.pdf',
      });

      const result = await service.generateCertificate(studentId, courseId);

      expect(result.pdfUrl).toBeDefined();
      expect(prisma.certificate.create).toHaveBeenCalled();
    });
  });
});
