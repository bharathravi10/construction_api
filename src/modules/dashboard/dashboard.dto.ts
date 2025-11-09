import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export enum PeriodType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class DashboardQueryDto {
  @ApiProperty({
    enum: PeriodType,
    example: 'month',
    required: false,
    description: 'Period type: day, week, or month',
    default: 'month',
  })
  @IsOptional()
  @IsEnum(PeriodType)
  readonly periodType?: PeriodType;

  @ApiProperty({
    example: '2024-12-01',
    required: false,
    description: 'Start date for the period (defaults to start of current period)',
  })
  @IsOptional()
  @IsDateString()
  readonly startDate?: string;

  @ApiProperty({
    example: '2024-12-31',
    required: false,
    description: 'End date for the period (defaults to end of current period)',
  })
  @IsOptional()
  @IsDateString()
  readonly endDate?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    required: false,
    description: 'Filter by project ID',
  })
  @IsOptional()
  @IsMongoId()
  readonly projectId?: Types.ObjectId;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    required: false,
    description: 'Filter by user ID',
  })
  @IsOptional()
  @IsMongoId()
  readonly userId?: Types.ObjectId;
}

// Response DTOs for better type safety and API documentation
export class ProjectsAnalyticsResponseDto {
  @ApiProperty()
  totalProjects!: number;

  @ApiProperty()
  activeProjects!: number;

  @ApiProperty()
  projectsCreated!: number;

  @ApiProperty({ type: 'array' })
  projectsByStatus!: Array<{
    status: string;
    count: number;
    totalBudget: number;
    totalEarned: number;
  }>;

  @ApiProperty()
  budgetStats!: {
    totalEstimatedBudget: number;
    totalActualSpending: number;
    totalEarnedValue: number;
    avgProgress: number;
  };
}

export class AttendanceAnalyticsResponseDto {
  @ApiProperty()
  totalRecords!: number;

  @ApiProperty()
  uniqueUsers!: number;

  @ApiProperty()
  presentCount!: number;

  @ApiProperty()
  absentCount!: number;

  @ApiProperty()
  halfdayCount!: number;

  @ApiProperty()
  attendanceRate!: number;

  @ApiProperty()
  totalOvertimeMinutes!: number;

  @ApiProperty()
  totalOvertimeHours!: number;

  @ApiProperty({ type: 'array' })
  attendanceByStatus!: Array<{
    status: string;
    count: number;
    totalOvertimeMinutes: number;
  }>;

  @ApiProperty({ type: 'array' })
  dailyBreakdown!: Array<{
    _id: string;
    present: number;
    absent: number;
    halfday: number;
    totalOvertime: number;
  }>;
}

export class SalaryAnalyticsResponseDto {
  @ApiProperty()
  totalSalary!: number;

  @ApiProperty()
  totalBaseSalary!: number;

  @ApiProperty()
  totalOvertimeSalary!: number;

  @ApiProperty()
  totalHalfDaySalary!: number;

  @ApiProperty()
  totalRecords!: number;

  @ApiProperty()
  avgSalary!: number;

  @ApiProperty()
  uniqueUsers!: number;

  @ApiProperty({ type: 'array' })
  salaryByStatus!: Array<{
    status: string;
    count: number;
    totalSalary: number;
  }>;

  @ApiProperty({ type: 'array' })
  salaryByCalculationType!: Array<{
    calculationType: string;
    count: number;
    totalSalary: number;
  }>;

  @ApiProperty({ type: 'array' })
  periodBreakdown!: Array<{
    _id: string;
    totalSalary: number;
    count: number;
  }>;
}

export class MaterialsAnalyticsResponseDto {
  @ApiProperty()
  totalMaterials!: number;

  @ApiProperty()
  materialsCreated!: number;

  @ApiProperty()
  materialCosts!: {
    totalCost: number;
    totalStockValue: number;
    totalUsedValue: number;
    avgCostPerUnit: number;
  };

  @ApiProperty({ type: 'array' })
  materialsByCategory!: Array<{
    category: string;
    count: number;
    totalCost: number;
    totalStock: number;
  }>;

  @ApiProperty({ type: 'array' })
  materialsByDeliveryStatus!: Array<{
    deliveryStatus: string;
    count: number;
    totalCost: number;
  }>;
}

export class TasksAnalyticsResponseDto {
  @ApiProperty()
  totalTasks!: number;

  @ApiProperty()
  tasksCreated!: number;

  @ApiProperty()
  tasksCompleted!: number;

  @ApiProperty()
  tasksWithIssues!: number;

  @ApiProperty()
  avgProgress!: number;

  @ApiProperty({ type: 'array' })
  tasksByStatus!: Array<{
    status: string;
    count: number;
    avgProgress: number;
  }>;
}

export class UsersAnalyticsResponseDto {
  @ApiProperty()
  totalUsers!: number;

  @ApiProperty()
  activeUsers!: number;

  @ApiProperty()
  usersCreated!: number;

  @ApiProperty({ type: 'array' })
  usersByRole!: Array<{
    role: string;
    count: number;
  }>;
}

export class DashboardAnalyticsResponseDto {
  @ApiProperty()
  period!: {
    type: PeriodType;
    startDate?: string;
    endDate?: string;
  };

  @ApiProperty({ type: ProjectsAnalyticsResponseDto })
  projects!: ProjectsAnalyticsResponseDto;

  @ApiProperty({ type: AttendanceAnalyticsResponseDto })
  attendance!: AttendanceAnalyticsResponseDto;

  @ApiProperty({ type: SalaryAnalyticsResponseDto })
  salary!: SalaryAnalyticsResponseDto;

  @ApiProperty({ type: MaterialsAnalyticsResponseDto })
  materials!: MaterialsAnalyticsResponseDto;

  @ApiProperty({ type: TasksAnalyticsResponseDto })
  tasks!: TasksAnalyticsResponseDto;

  @ApiProperty({ type: UsersAnalyticsResponseDto })
  users!: UsersAnalyticsResponseDto;

  @ApiProperty()
  summary!: {
    totalProjects: number;
    totalUsers: number;
    totalSalary: number;
    totalMaterialCost: number;
    attendanceRate: number;
    taskCompletionRate: number;
  };
}
