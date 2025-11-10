import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsMongoId, IsEnum, IsBoolean, IsArray, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { FileInfoDto } from '../../common/dto/file-info.dto';

export class CreateIssueDto {
  @ApiProperty({ example: 'Material shortage' })
  @IsString()
  readonly title!: string;

  @ApiProperty({ example: 'Cement bags are running low', required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low',
    required: false
  })
  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High', 'Critical'])
  readonly severity?: string;

  @ApiProperty({ 
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
    required: false
  })
  @IsOptional()
  @IsEnum(['Open', 'In Progress', 'Resolved', 'Closed'])
  readonly status?: string;

  @ApiProperty({ example: '2024-12-01', required: false })
  @IsOptional()
  @IsDateString()
  readonly reportedDate?: Date;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  readonly reportedBy?: string;

  @ApiProperty({ example: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;
}

export class UpdateIssueDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High', 'Critical'])
  readonly severity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['Open', 'In Progress', 'Resolved', 'Closed'])
  readonly status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly resolvedDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly resolvedBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Foundation Work' })
  @IsString()
  readonly name!: string;

  @ApiProperty({ example: 'Complete foundation excavation and concrete pouring', required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'Project ID (required)'
  })
  @IsMongoId()
  readonly project!: Types.ObjectId;

  @ApiProperty({ example: '2024-12-01' })
  @IsDateString()
  readonly startDate!: Date;

  @ApiProperty({ example: '2024-12-15' })
  @IsDateString()
  readonly endDate!: Date;

  @ApiProperty({ example: '2024-12-01', required: false })
  @IsOptional()
  @IsDateString()
  readonly actualStartDate?: Date;

  @ApiProperty({ example: '2024-12-15', required: false })
  @IsOptional()
  @IsDateString()
  readonly actualEndDate?: Date;

  @ApiProperty({ 
    enum: ['Assigned', 'In Progress', 'Completed'],
    default: 'Assigned',
    required: false
  })
  @IsOptional()
  @IsEnum(['Assigned', 'In Progress', 'Completed'])
  readonly status?: string;

  @ApiProperty({ example: 0, default: 0, required: false })
  @IsOptional()
  @IsNumber()
  readonly progressPercentage?: number;

  @ApiProperty({ 
    example: ['507f1f77bcf86cd799439011'],
    description: 'Array of user IDs assigned to task (can be single or multiple users)',
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  readonly assignedUsers?: Types.ObjectId[];

  @ApiProperty({ example: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;

  @ApiProperty({ example: [], required: false, type: [FileInfoDto], description: 'Array of document file info with url, key, and originalName' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileInfoDto)
  readonly documents?: FileInfoDto[];

  @ApiProperty({ example: [], required: false, type: [CreateIssueDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIssueDto)
  readonly issues?: CreateIssueDto[];

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly project?: Types.ObjectId;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly actualStartDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly actualEndDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['Assigned', 'In Progress', 'Completed'])
  readonly status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly progressPercentage?: number;

  @ApiProperty({ 
    required: false, 
    type: [String],
    description: 'Array of user IDs assigned to task (can be single or multiple users)'
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  readonly assignedUsers?: Types.ObjectId[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly documents?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}

export class UpdateTaskStatusDto {
  @ApiProperty({ 
    enum: ['Assigned', 'In Progress', 'Completed'],
    example: 'In Progress'
  })
  @IsEnum(['Assigned', 'In Progress', 'Completed'])
  readonly status!: string;

  @ApiProperty({ example: '2024-12-01', required: false })
  @IsOptional()
  @IsDateString()
  readonly actualStartDate?: Date;

  @ApiProperty({ example: '2024-12-15', required: false })
  @IsOptional()
  @IsDateString()
  readonly actualEndDate?: Date;
}

export class AddIssueDto {
  @ApiProperty({ type: CreateIssueDto })
  @ValidateNested()
  @Type(() => CreateIssueDto)
  readonly issue!: CreateIssueDto;
}

export class UpdateIssueInTaskDto {
  @ApiProperty({ example: 0, description: 'Index of the issue in the issues array' })
  @IsNumber()
  readonly issueIndex!: number;

  @ApiProperty({ type: UpdateIssueDto })
  @ValidateNested()
  @Type(() => UpdateIssueDto)
  readonly issue!: UpdateIssueDto;
}

