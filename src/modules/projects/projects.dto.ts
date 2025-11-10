import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsMongoId, IsEnum, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FileInfoDto } from '../../common/dto/file-info.dto';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  readonly name!: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly description!: string;

  @ApiProperty()
  @IsString()
  readonly address!: string;

  @ApiProperty()
  @IsString()
  readonly state!: string;

  @ApiProperty()
  @IsDateString()
  readonly plannedStartDate!: Date;

  @ApiProperty()
  @IsDateString()
  readonly plannedEndDate!: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly actualStartDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly actualEndDate?: Date;

  @ApiProperty({ enum: ['Planned', 'Ongoing', 'Completed', 'On Hold', 'Cancelled'], default: 'Planned' })
  @IsOptional()
  @IsEnum(['Planned', 'Ongoing', 'Completed', 'On Hold', 'Cancelled'])
  readonly status?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  readonly estimatedBudget?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  readonly totalPriceValue?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  readonly totalEarnedValue?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  readonly progressPercentage?: number;

  @ApiProperty({ required: false, type: [FileInfoDto], default: [], description: 'Array of document file info with url, key, and originalName' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileInfoDto)
  readonly documents?: FileInfoDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}

export class UpdateProjectDto {
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
  @IsString()
  readonly address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly plannedStartDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly plannedEndDate?: Date;

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
  @IsEnum(['Planned', 'Ongoing', 'Completed', 'On Hold', 'Cancelled'])
  readonly status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly estimatedBudget?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly totalPriceValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly totalEarnedValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly progressPercentage?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly documents?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
