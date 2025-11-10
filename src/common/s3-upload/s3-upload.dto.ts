import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({ description: 'CloudFront URL of the uploaded file' })
  url!: string;

  @ApiProperty({ description: 'S3 key of the uploaded file' })
  key!: string;

  @ApiProperty({ description: 'Original filename', required: false })
  originalName?: string;
}

export class UploadMultipleFilesResponseDto {
  @ApiProperty({ type: [UploadFileResponseDto], description: 'Array of uploaded files' })
  files!: UploadFileResponseDto[];

  @ApiProperty({ description: 'Total number of files uploaded' })
  count!: number;
}

export class DeleteMultipleFilesDto {
  @ApiProperty({ 
    type: [String], 
    description: 'Array of S3 keys to delete',
    example: ['uploads/file1.jpg', 'uploads/file2.jpg']
  })
  keys!: string[];
}

export class FailedDeletionDto {
  @ApiProperty({ description: 'S3 key that failed to delete' })
  key!: string;

  @ApiProperty({ description: 'Error message' })
  error!: string;
}

export class DeleteMultipleFilesResponseDto {
  @ApiProperty({ type: [String], description: 'Array of successfully deleted keys' })
  success!: string[];

  @ApiProperty({ 
    type: () => [FailedDeletionDto], 
    description: 'Array of failed deletions with error messages' 
  })
  failed!: FailedDeletionDto[];

  @ApiProperty({ description: 'Total number of keys provided' })
  total!: number;

  @ApiProperty({ description: 'Number of successfully deleted files' })
  successCount!: number;

  @ApiProperty({ description: 'Number of failed deletions' })
  failedCount!: number;
}

