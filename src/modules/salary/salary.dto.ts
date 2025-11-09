import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsMongoId, IsNumber, Min, IsEnum, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSalaryRateDto {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'User ID (required)'
  })
  @IsMongoId()
  readonly user!: Types.ObjectId;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439012',
    required: false,
    description: 'Project ID (optional - null means base/default salary for user. Required when calculationType is "project")'
  })
  @IsOptional()
  @IsMongoId()
  readonly project?: Types.ObjectId;

  @ApiProperty({ 
    enum: ['day', 'hour', 'project'],
    example: 'day',
    description: 'Calculation type: "day" for day-based, "hour" for hour-based, "project" for project-based salary'
  })
  @IsEnum(['day', 'hour', 'project'])
  readonly calculationType!: string;

  @ApiProperty({ 
    example: 1000.00,
    required: false,
    description: 'Daily salary rate in currency (required if calculationType is "day")'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly dailyRate?: number;

  @ApiProperty({ 
    example: 125.00,
    required: false,
    description: 'Hourly salary rate in currency (required if calculationType is "hour")'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly hourlyRate?: number;

  @ApiProperty({ 
    example: 50000.00,
    required: false,
    description: 'Project-based salary rate in currency (required if calculationType is "project")'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly projectRate?: number;

  @ApiProperty({ 
    example: 100.00,
    default: 0,
    required: false,
    description: 'Overtime rate per hour in currency (not needed for project-based)'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly overtimeRatePerHour?: number;

  @ApiProperty({ 
    example: '2024-12-01',
    required: false,
    description: 'Effective from date (defaults to today)'
  })
  @IsOptional()
  @IsDateString()
  readonly effectiveFrom?: Date;

  @ApiProperty({ 
    example: '2025-12-31',
    required: false,
    description: 'Effective to date (null means currently active)'
  })
  @IsOptional()
  @IsDateString()
  readonly effectiveTo?: Date;

  @ApiProperty({ example: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;
}

export class UpdateSalaryRateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly project?: Types.ObjectId;

  @ApiProperty({ 
    enum: ['day', 'hour', 'project'],
    required: false,
    description: 'Calculation type: "day" for day-based, "hour" for hour-based, "project" for project-based salary'
  })
  @IsOptional()
  @IsEnum(['day', 'hour', 'project'])
  readonly calculationType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly dailyRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly hourlyRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly projectRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly overtimeRatePerHour?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly effectiveFrom?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly effectiveTo?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;
}

export class CalculateSalaryDto {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'User ID (required)'
  })
  @IsMongoId()
  readonly user!: Types.ObjectId;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439012',
    required: false,
    description: 'Project ID (optional - null means calculate for all projects or base salary)'
  })
  @IsOptional()
  @IsMongoId()
  readonly project?: Types.ObjectId;

  @ApiProperty({ 
    enum: ['month', 'week', 'year', 'custom'],
    example: 'month',
    description: 'Period type for calculation'
  })
  @IsEnum(['month', 'week', 'year', 'custom'])
  readonly periodType!: string;

  @ApiProperty({ 
    example: '2024-12-01',
    description: 'Start date of the period'
  })
  @IsDateString()
  readonly periodStart!: Date;

  @ApiProperty({ 
    example: '2024-12-31',
    description: 'End date of the period'
  })
  @IsDateString()
  readonly periodEnd!: Date;

  @ApiProperty({ 
    example: false,
    default: false,
    required: false,
    description: 'If true, recalculate even if calculation already exists'
  })
  @IsOptional()
  @IsBoolean()
  readonly forceRecalculate?: boolean;
}

export class GetSalaryCalculationDto {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    required: false,
    description: 'Filter by user ID'
  })
  @IsOptional()
  @IsMongoId()
  readonly userId?: Types.ObjectId;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439012',
    required: false,
    description: 'Filter by project ID'
  })
  @IsOptional()
  @IsMongoId()
  readonly projectId?: Types.ObjectId;

  @ApiProperty({ 
    enum: ['month', 'week', 'year', 'custom'],
    required: false,
    description: 'Filter by period type'
  })
  @IsOptional()
  @IsEnum(['month', 'week', 'year', 'custom'])
  readonly periodType?: string;

  @ApiProperty({ 
    example: '2024-12-01',
    required: false,
    description: 'Filter by start date'
  })
  @IsOptional()
  @IsDateString()
  readonly startDate?: string;

  @ApiProperty({ 
    example: '2024-12-31',
    required: false,
    description: 'Filter by end date'
  })
  @IsOptional()
  @IsDateString()
  readonly endDate?: string;

  @ApiProperty({ 
    enum: ['pending', 'calculated', 'approved', 'paid'],
    required: false,
    description: 'Filter by status'
  })
  @IsOptional()
  @IsEnum(['pending', 'calculated', 'approved', 'paid'])
  readonly status?: string;
}

