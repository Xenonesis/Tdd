import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generateCertificate(userId: string, title: string, description?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create certificate record
    const certificate = await this.prisma.certificate.create({
      data: {
        userId,
        title,
        description,
      },
    });

    // Generate PDF
    const pdfPath = await this.createPDF(certificate.id, user, title, description);

    // Update certificate with PDF URL
    const updatedCertificate = await this.prisma.certificate.update({
      where: { id: certificate.id },
      data: { pdfUrl: pdfPath },
    });

    return updatedCertificate;
  }

  private async createPDF(
    certificateId: string,
    user: any,
    title: string,
    description?: string,
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
        .text(title, 100, 360, {
          align: 'center',
        });

      if (description) {
        doc
          .fontSize(14)
          .font('Helvetica')
          .fillColor('#666')
          .text(description, 100, 420, {
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

  async getCertificatesByUser(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async getCertificateById(certificateId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { user: true },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }
}
