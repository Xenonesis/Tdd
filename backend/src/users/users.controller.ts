import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Get all users (Admin only)
  @Get()
  @Roles('ADMIN')
  async getAllUsers(@Query('role') role?: string) {
    return this.usersService.getAllUsers(role);
  }

  // Get pending mentors (Admin only)
  @Get('pending-mentors')
  @Roles('ADMIN')
  async getPendingMentors() {
    return this.usersService.getPendingMentors();
  }

  // Get platform statistics (Admin only)
  @Get('stats')
  @Roles('ADMIN')
  async getPlatformStats() {
    return this.usersService.getPlatformStats();
  }

  // Get all students (Mentor and Admin)
  @Get('students')
  @Roles('MENTOR', 'ADMIN')
  async getStudents() {
    return this.usersService.getStudents();
  }

  // Get user by ID (Admin only)
  @Get(':id')
  @Roles('ADMIN')
  async getUserById(@Param('id') userId: string) {
    return this.usersService.getUserById(userId);
  }

  // Approve mentor account (Admin only)
  @Put(':id/approve-mentor')
  @Roles('ADMIN')
  async approveMentor(@Param('id') userId: string) {
    return this.usersService.approveMentor(userId);
  }

  // Deactivate user (Admin only)
  @Put(':id/deactivate')
  @Roles('ADMIN')
  async deactivateUser(@Param('id') userId: string) {
    return this.usersService.deactivateUser(userId);
  }

  // Activate user (Admin only)
  @Put(':id/activate')
  @Roles('ADMIN')
  async activateUser(@Param('id') userId: string) {
    return this.usersService.activateUser(userId);
  }

  // Delete user (Admin only)
  @Delete(':id')
  @Roles('ADMIN')
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
