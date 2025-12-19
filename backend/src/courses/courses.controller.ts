import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  // Create a new course (Mentor only)
  @Post()
  @Roles('MENTOR')
  async createCourse(@Request() req: any, @Body() body: { title: string; description: string }) {
    return this.coursesService.createCourse(req.user.userId, body.title, body.description);
  }

  // Get courses based on user role
  @Get('my')
  async getMyCourses(@Request() req: any) {
    const { userId, role } = req.user;

    if (role === 'MENTOR') {
      return this.coursesService.getMentorCourses(userId);
    } else if (role === 'STUDENT') {
      return this.coursesService.getStudentCourses(userId);
    } else if (role === 'ADMIN') {
      return this.coursesService.getAllCourses();
    }
  }

  // Get all courses (Admin only)
  @Get('all')
  @Roles('ADMIN')
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  // Get a specific course
  @Get(':id')
  async getCourseById(@Request() req: any, @Param('id') courseId: string) {
    return this.coursesService.getCourseById(courseId, req.user.userId, req.user.role);
  }

  // Update a course (Mentor only)
  @Put(':id')
  @Roles('MENTOR')
  async updateCourse(
    @Request() req: any,
    @Param('id') courseId: string,
    @Body() body: { title?: string; description?: string },
  ) {
    return this.coursesService.updateCourse(courseId, req.user.userId, body.title, body.description);
  }

  // Delete a course (Mentor only)
  @Delete(':id')
  @Roles('MENTOR')
  async deleteCourse(@Request() req: any, @Param('id') courseId: string) {
    return this.coursesService.deleteCourse(courseId, req.user.userId);
  }

  // Add chapter to course (Mentor only)
  @Post(':id/chapters')
  @Roles('MENTOR')
  async addChapter(
    @Request() req: any,
    @Param('id') courseId: string,
    @Body() body: { title: string; description: string; imageUrl?: string; videoUrl?: string },
  ) {
    return this.coursesService.addChapter(
      courseId,
      req.user.userId,
      body.title,
      body.description,
      body.imageUrl,
      body.videoUrl,
    );
  }

  // Get chapters for a course
  @Get(':id/chapters')
  async getCourseChapters(@Request() req: any, @Param('id') courseId: string) {
    return this.coursesService.getCourseChapters(courseId, req.user.userId, req.user.role);
  }

  // Assign course to students (Mentor only)
  @Post(':id/assign')
  @Roles('MENTOR')
  async assignCourse(
    @Request() req: any,
    @Param('id') courseId: string,
    @Body() body: { studentIds: string[] },
  ) {
    return this.coursesService.assignCourse(courseId, req.user.userId, body.studentIds);
  }
}
