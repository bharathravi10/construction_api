import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsMongoId, IsEnum, IsNumber, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAttendanceDto {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'User ID (required)'
  })
  @IsMongoId()
  readonly user!: Types.ObjectId;

  @ApiProperty({ example: '2024-12-01' })
  @IsDateString()
  readonly date!: Date;

  @ApiProperty({ 
    enum: ['present', 'absent', 'halfday'],
    default: 'present',
    example: 'present'
  })
  @IsEnum(['present', 'absent', 'halfday'])
  readonly status!: string;

  @ApiProperty({ 
    example: '2024-12-01T09:00:00Z', 
    required: false,
    description: 'Check-in time (required for present/halfday status)'
  })
  @IsOptional()
  @IsDateString()
  readonly checkIn?: Date;

  @ApiProperty({ 
    example: '2024-12-01T18:00:00Z', 
    required: false,
    description: 'Check-out time (required for present/halfday status)'
  })
  @IsOptional()
  @IsDateString()
  readonly checkOut?: Date;

  @ApiProperty({ 
    example: 150, 
    default: 0,
    required: false,
    description: 'Overtime in minutes (e.g., 150 = 2 hours 30 minutes)'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly overtime?: number;

  @ApiProperty({ example: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;
}

export class UpdateAttendanceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['present', 'absent', 'halfday'])
  readonly status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly checkIn?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly checkOut?: Date;

  @ApiProperty({ 
    required: false,
    description: 'Overtime in minutes (e.g., 150 = 2 hours 30 minutes)'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly overtime?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;
}

