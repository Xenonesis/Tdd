import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  // Mark chapter as complete (Student only)
  @Post(':chapterId/complete')
  @Roles('STUDENT')
  async completeChapter(@Request() req: any, @Param('chapterId') chapterId: string) {
    return this.progressService.completeChapter(req.user.userId, chapterId);
  }

  // Get student's progress for all courses (Student only)
  @Get('my')
  @Roles('STUDENT')
  async getMyProgress(@Request() req: any) {
    return this.progressService.getStudentProgress(req.user.userId);
  }

  // Get progress for a specific course (Student only)
  @Get('course/:courseId')
  @Roles('STUDENT')
  async getCourseProgress(@Request() req: any, @Param('courseId') courseId: string) {
    return this.progressService.getCourseProgress(req.user.userId, courseId);
  }

  // Get student progress for mentor (Mentor only)
  @Get('students')
  @Roles('MENTOR')
  async getStudentProgressForMentor(@Request() req: any, @Query('courseId') courseId?: string) {
    return this.progressService.getStudentProgressForMentor(req.user.userId, courseId);
  }
}
