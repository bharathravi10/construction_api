import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import {
  DashboardQueryDto,
  PeriodType,
  DashboardAnalyticsResponseDto,
  ProjectsAnalyticsResponseDto,
  AttendanceAnalyticsResponseDto,
  SalaryAnalyticsResponseDto,
  MaterialsAnalyticsResponseDto,
  TasksAnalyticsResponseDto,
  UsersAnalyticsResponseDto,
} from './dashboard.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comprehensive dashboard analytics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard analytics retrieved successfully.',
    type: DashboardAnalyticsResponseDto,
  })
  @ApiQuery({ name: 'periodType', enum: PeriodType, required: false, description: 'Period type: day, week, or month' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for the period' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for the period' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  getDashboard(@Query() query: DashboardQueryDto): Promise<DashboardAnalyticsResponseDto> {
    return this.dashboardService.getDashboardAnalytics(query);
  }

  @Get('projects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get projects analytics' })
  @ApiResponse({
    status: 200,
    description: 'Projects analytics retrieved successfully.',
    type: ProjectsAnalyticsResponseDto,
  })
  @ApiQuery({ name: 'periodType', enum: PeriodType, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  getProjectsAnalytics(@Query() query: DashboardQueryDto): Promise<ProjectsAnalyticsResponseDto> {
    return this.dashboardService.getProjectsAnalytics(query);
  }

  @Get('attendance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get attendance analytics' })
  @ApiResponse({
    status: 200,
    description: 'Attendance analytics retrieved successfully.',
    type: AttendanceAnalyticsResponseDto,
  })
  @ApiQuery({ name: 'periodType', enum: PeriodType, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'userId', required: false })
  getAttendanceAnalytics(@Query() query: DashboardQueryDto): Promise<AttendanceAnalyticsResponseDto> {
    return this.dashboardService.getAttendanceAnalytics(query);
  }

  @Get('salary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get salary analytics' })
  @ApiResponse({
    status: 200,
    description: 'Salary analytics retrieved successfully.',
    type: SalaryAnalyticsResponseDto,
  })
  @ApiQuery({ name: 'periodType', enum: PeriodType, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  getSalaryAnalytics(@Query() query: DashboardQueryDto): Promise<SalaryAnalyticsResponseDto> {
    return this.dashboardService.getSalaryAnalytics(query);
  }

  @Get('materials')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get materials analytics' })
  @ApiResponse({
    status: 200,
    description: 'Materials analytics retrieved successfully.',
    type: MaterialsAnalyticsResponseDto,
  })
  @ApiQuery({ name: 'periodType', enum: PeriodType, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  getMaterialsAnalytics(@Query() query: DashboardQueryDto): Promise<MaterialsAnalyticsResponseDto> {
    return this.dashboardService.getMaterialsAnalytics(query);
  }

  @Get('tasks')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks analytics' })
  @ApiResponse({
    status: 200,
    description: 'Tasks analytics retrieved successfully.',
    type: TasksAnalyticsResponseDto,
  })
  @ApiQuery({ name: 'periodType', enum: PeriodType, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  getTasksAnalytics(@Query() query: DashboardQueryDto): Promise<TasksAnalyticsResponseDto> {
    return this.dashboardService.getTasksAnalytics(query);
  }

  @Get('users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get users analytics' })
  @ApiResponse({
    status: 200,
    description: 'Users analytics retrieved successfully.',
    type: UsersAnalyticsResponseDto,
  })
  @ApiQuery({ name: 'periodType', enum: PeriodType, required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'userId', required: false })
  getUsersAnalytics(@Query() query: DashboardQueryDto): Promise<UsersAnalyticsResponseDto> {
    return this.dashboardService.getUsersAnalytics(query);
  }

  @Get('day')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get day-wise dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Day-wise analytics retrieved successfully.' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Specific date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  getDayWiseAnalytics(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getDashboardAnalytics({
      ...query,
      periodType: PeriodType.DAY,
    });
  }

  @Get('week')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get week-wise dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Week-wise analytics retrieved successfully.' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date of the week' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date of the week' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  getWeekWiseAnalytics(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getDashboardAnalytics({
      ...query,
      periodType: PeriodType.WEEK,
    });
  }

  @Get('month')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get month-wise dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Month-wise analytics retrieved successfully.' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date of the month' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date of the month' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  getMonthWiseAnalytics(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getDashboardAnalytics({
      ...query,
      periodType: PeriodType.MONTH,
    });
  }
}

