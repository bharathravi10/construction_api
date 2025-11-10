import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsMongoId, IsEnum, IsBoolean, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { FileInfoDto } from '../../common/dto/file-info.dto';

export class CreateMaterialDto {
  @ApiProperty({ example: 'Cement' })
  @IsString()
  readonly name!: string;

  @ApiProperty({ example: 'Portland cement for foundation work', required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ 
    enum: ['Raw Material', 'Equipment', 'Consumables', 'Tools', 'Other'],
    example: 'Raw Material'
  })
  @IsEnum(['Raw Material', 'Equipment', 'Consumables', 'Tools', 'Other'])
  readonly category!: string;

  @ApiProperty({ example: 'ABC Suppliers Ltd.' })
  @IsString()
  readonly supplierName!: string;

  @ApiProperty({ example: 'contact@abcsuppliers.com', required: false })
  @IsOptional()
  @IsString()
  readonly supplierContact?: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'Project ID (optional)',
    required: false
  })
  @IsOptional()
  @IsMongoId()
  readonly project?: Types.ObjectId;

  @ApiProperty({ example: 100, default: 0, required: false })
  @IsOptional()
  @IsNumber()
  readonly stockQuantity?: number;

  @ApiProperty({ example: 25, default: 0, required: false })
  @IsOptional()
  @IsNumber()
  readonly usedQuantity?: number;

  @ApiProperty({ example: 200, default: 0, required: false })
  @IsOptional()
  @IsNumber()
  readonly requiredQuantity?: number;

  @ApiProperty({ example: 500, default: 0, required: false })
  @IsOptional()
  @IsNumber()
  readonly costPerUnit?: number;

  @ApiProperty({ example: 50000, default: 0, required: false })
  @IsOptional()
  @IsNumber()
  readonly totalCost?: number;

  @ApiProperty({ example: 'bags', required: false })
  @IsOptional()
  @IsString()
  readonly unit?: string;

  @ApiProperty({ example: '2024-12-01', required: false })
  @IsOptional()
  @IsDateString()
  readonly expectedDeliveryDate?: Date;

  @ApiProperty({ example: '2024-12-01', required: false })
  @IsOptional()
  @IsDateString()
  readonly actualDeliveryDate?: Date;

  @ApiProperty({ type: FileInfoDto, required: false, description: 'Invoice file info with url, key, and originalName' })
  @IsOptional()
  @ValidateNested()
  @Type(() => FileInfoDto)
  @IsObject()
  readonly invoiceUrl?: FileInfoDto;

  @ApiProperty({ type: FileInfoDto, required: false, description: 'GRN file info with url, key, and originalName' })
  @IsOptional()
  @ValidateNested()
  @Type(() => FileInfoDto)
  @IsObject()
  readonly grnUrl?: FileInfoDto;

  @ApiProperty({ 
    enum: ['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'],
    default: 'Pending',
    required: false
  })
  @IsOptional()
  @IsEnum(['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'])
  readonly deliveryStatus?: string;

  @ApiProperty({ example: 25, default: 0, required: false })
  @IsOptional()
  @IsNumber()
  readonly progressPercentage?: number;

  @ApiProperty({ example: [], required: false, type: [FileInfoDto], description: 'Array of document file info with url, key, and originalName' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileInfoDto)
  readonly documents?: FileInfoDto[];

  @ApiProperty({ example: 'Handle with care', required: false })
  @IsOptional()
  @IsString()
  readonly remarks?: string;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}

export class UpdateMaterialDto {
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
  @IsEnum(['Raw Material', 'Equipment', 'Consumables', 'Tools', 'Other'])
  readonly category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly supplierName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly supplierContact?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly project?: Types.ObjectId;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly stockQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly usedQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly requiredQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly costPerUnit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly totalCost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly expectedDeliveryDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly actualDeliveryDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly invoiceUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly grnUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'])
  readonly deliveryStatus?: string;

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

export class UpdateMaterialUsageDto {
  @ApiProperty({ example: 50, description: 'Additional quantity to add to existing used quantity (will be added to current usage)' })
  @IsNumber()
  readonly usedQuantity!: number;
}

export class UpdateDeliveryStatusDto {
  @ApiProperty({ 
    enum: ['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'],
    example: 'Delivered'
  })
  @IsEnum(['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'])
  readonly deliveryStatus!: string;

  @ApiProperty({ example: '2024-12-01', required: false })
  @IsOptional()
  @IsDateString()
  readonly actualDeliveryDate?: Date;
}

export class UpdateInsufficientStatusDto {
  @ApiProperty({ example: true, description: 'Insufficient stock status' })
  @IsBoolean()
  readonly isInsufficient!: boolean;
}

