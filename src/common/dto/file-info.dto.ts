import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class FileInfoDto {
  @ApiProperty({ description: 'CloudFront URL of the file' })
  @IsString()
  url!: string;

  @ApiProperty({ description: 'S3 key of the file' })
  @IsString()
  key!: string;

  @ApiProperty({ description: 'Original filename', required: false })
  @IsOptional()
  @IsString()
  originalName?: string;
}

