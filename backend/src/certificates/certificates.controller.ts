import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Post()
  @Roles('ADMIN', 'MENTOR')
  async generateCertificate(
    @Body() body: { userId: string; title: string; description?: string },
  ) {
    return this.certificatesService.generateCertificate(
      body.userId,
      body.title,
      body.description,
    );
  }

  @Get('my-certificates')
  async getMyCertificates(@Request() req: any) {
    return this.certificatesService.getCertificatesByUser(req.user.userId);
  }

  @Get(':id')
  async getCertificateById(@Param('id') id: string) {
    return this.certificatesService.getCertificateById(id);
  }
}
