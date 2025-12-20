import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Response } from 'express';
import * as path from 'path';

@Controller('certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  // Generate certificate for a course (Student only, after 100% completion)
  @Post('course/:courseId')
  @Roles('STUDENT')
  async generateCertificate(
    @Request() req: any,
    @Param('courseId') courseId: string,
  ) {
    return this.certificatesService.generateCertificate(req.user.userId, courseId);
  }

  // Get student's certificates
  @Get('my-certificates')
  @Roles('STUDENT')
  async getMyCertificates(@Request() req: any) {
    return this.certificatesService.getCertificatesByUser(req.user.userId);
  }

  // Download certificate PDF
  @Get(':id/download')
  async downloadCertificate(
    @Request() req: any,
    @Param('id') certificateId: string,
    @Res() res: Response,
  ) {
    const certificate = await this.certificatesService.getCertificateById(certificateId);
    
    // Verify access (student can only download their own certificates)
    if (req.user.role === 'STUDENT' && certificate.studentId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!certificate.pdfUrl) {
      return res.status(404).json({ message: 'Certificate PDF not found' });
    }

    const filePath = path.join(process.cwd(), certificate.pdfUrl);
    res.download(filePath);
  }

  // Get certificate details
  @Get(':id')
  async getCertificateById(@Param('id') certificateId: string) {
    return this.certificatesService.getCertificateById(certificateId);
  }
}
