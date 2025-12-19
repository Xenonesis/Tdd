import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generateCertificate(studentId: string, courseId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

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
      throw new NotFoundException('Student is not assigned to this course');
    }

    // Check if course is 100% complete
    const progress = await this.prisma.progress.findMany({
      where: {
        studentId,
        chapter: {
          courseId,
        },
      },
    });

    if (progress.length !== course.chapters.length) {
      throw new BadRequestException('Course must be 100% complete to generate certificate');
    }

    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    // Create certificate record
    const certificate = await this.prisma.certificate.create({
      data: {
        studentId,
        courseId,
      },
    });

    // Generate PDF
    const pdfPath = await this.createPDF(certificate.id, user, course);

    // Update certificate with PDF URL
    const updatedCertificate = await this.prisma.certificate.update({
      where: { id: certificate.id },
      data: { pdfUrl: pdfPath },
      include: {
        course: true,
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

    return updatedCertificate;
  }

  private async createPDF(
    certificateId: string,
    user: any,
    course: any,
  ): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'certificates');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `certificate_${certificateId}.pdf`;
    const filepath = path.join(uploadsDir, filename);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
      });

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Certificate Design
      doc
        .fontSize(40)
        .font('Helvetica-Bold')
        .fillColor('#1e3a8a')
        .text('CERTIFICATE OF COMPLETION', 100, 100, {
          align: 'center',
        });

      doc
        .fontSize(20)
        .fillColor('#000')
        .font('Helvetica')
        .text('This is to certify that', 100, 200, {
          align: 'center',
        });

      doc
        .fontSize(30)
        .font('Helvetica-Bold')
        .fillColor('#1e3a8a')
        .text(`${user.firstName} ${user.lastName}`, 100, 250, {
          align: 'center',
        });

      doc
        .fontSize(20)
        .font('Helvetica')
        .fillColor('#000')
        .text('has successfully completed', 100, 310, {
          align: 'center',
        });

      doc
        .fontSize(25)
        .font('Helvetica-Bold')
        .fillColor('#1e3a8a')
        .text(course.title, 100, 360, {
          align: 'center',
        });

      if (course.description) {
        doc
          .fontSize(14)
          .font('Helvetica')
          .fillColor('#666')
          .text(course.description, 100, 420, {
            align: 'center',
            width: 600,
          });
      }

      const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc
        .fontSize(12)
        .fillColor('#000')
        .text(`Issued on: ${issueDate}`, 100, 500, {
          align: 'center',
        });

      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/certificates/${filename}`);
      });

      stream.on('error', reject);
    });
  }

  async getCertificatesByUser(studentId: string) {
    return this.prisma.certificate.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async getCertificateById(certificateId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
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
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }
}
