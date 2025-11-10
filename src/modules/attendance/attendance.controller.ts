import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  HttpCode, 
  HttpStatus,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAttendanceDto, UpdateAttendanceDto } from './attendance.dto';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({ status: 201, description: 'Attendance successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data or attendance already exists.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: CreateAttendanceDto })
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records (optionally filtered by user, status, or date range)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (present, absent, halfday)' })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by specific date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD) - use with endDate' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD) - use with startDate' })
  @ApiResponse({ status: 200, description: 'List of attendance records.' })
  async findAll(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.attendanceService.findAll({ userId, status, date, startDate, endDate });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all attendance records for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (present, absent, halfday)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'List of attendance records for the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getAttendancesByUser(
    @Param('userId') userId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.attendanceService.getAttendancesByUser(userId, { status, startDate, endDate });
  }

  @Get('user/:userId/date/:date')
  @ApiOperation({ summary: 'Get attendance record for a specific user and date' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'date', description: 'Date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Attendance record details.' })
  @ApiResponse({ status: 404, description: 'Attendance record or user not found.' })
  async getAttendanceByUserAndDate(
    @Param('userId') userId: string,
    @Param('date') date: string
  ) {
    return this.attendanceService.getAttendanceByUserAndDate(userId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an attendance record by ID' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiResponse({ status: 200, description: 'Attendance record details.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  async findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance record details' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiBody({ type: UpdateAttendanceDto })
  @ApiResponse({ status: 200, description: 'Attendance successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  async update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an attendance record' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiResponse({ status: 200, description: 'Attendance successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  async remove(@Param('id') id: string) {
    return this.attendanceService.delete(id);
  }
}

