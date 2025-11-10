import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { S3UploadService } from './s3-upload.service';
import {
  UploadFileResponseDto,
  UploadMultipleFilesResponseDto,
  DeleteMultipleFilesDto,
  DeleteMultipleFilesResponseDto,
} from './s3-upload.dto';

@ApiTags('S3 Upload')
@Controller('s3-upload')
export class S3UploadController {
  private readonly logger = new Logger(S3UploadController.name);

  constructor(private readonly s3UploadService: S3UploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        folder: {
          type: 'string',
          description: 'Optional folder path in S3 bucket (e.g., images, documents)',
          example: 'images',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: UploadFileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid file or file too large' })
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.s3UploadService.uploadFile(file, folder);
    return result;
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @ApiOperation({ summary: 'Upload multiple files to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Select multiple files to upload (hold Ctrl/Cmd to select multiple)',
        },
        folder: {
          type: 'string',
          description: 'Optional folder path in S3 bucket (e.g., images, documents)',
          example: 'images',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    type: UploadMultipleFilesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid files or files too large' })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ): Promise<UploadMultipleFilesResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results = await this.s3UploadService.uploadMultipleFiles(files, folder);
    return {
      files: results,
      count: results.length,
    };
  }

  @Post('fields')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 5 },
      { name: 'documents', maxCount: 5 },
    ]),
  )
  @ApiOperation({ summary: 'Upload files with specific field names' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Image files',
        },
        documents: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Document files',
        },
        folder: {
          type: 'string',
          description: 'Optional folder path in S3 bucket',
          example: 'mixed',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
  })
  async uploadFileFields(
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
    @Body('folder') folder?: string,
  ) {
    const allFiles: Express.Multer.File[] = [];
    const results: any = {};

    if (files.images) {
      const imageResults = await this.s3UploadService.uploadMultipleFiles(
        files.images,
        folder ? `${folder}/images` : 'images',
      );
      results.images = imageResults;
      allFiles.push(...files.images);
    }

    if (files.documents) {
      const documentResults = await this.s3UploadService.uploadMultipleFiles(
        files.documents,
        folder ? `${folder}/documents` : 'documents',
      );
      results.documents = documentResults;
      allFiles.push(...files.documents);
    }

    return {
      ...results,
      totalFiles: allFiles.length,
    };
  }

  @Delete('multiple')
  @ApiOperation({ summary: 'Delete multiple files from S3' })
  @ApiResponse({
    status: 200,
    description: 'Files deletion completed (check success and failed arrays)',
    type: DeleteMultipleFilesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid keys' })
  async deleteMultipleFiles(
    @Body() deleteDto: DeleteMultipleFilesDto,
  ): Promise<DeleteMultipleFilesResponseDto> {
    if (!deleteDto.keys || deleteDto.keys.length === 0) {
      throw new BadRequestException('Keys array is required and cannot be empty');
    }

    const result = await this.s3UploadService.deleteMultipleFiles(deleteDto.keys);
    return result;
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete a single file from S3' })
  @ApiParam({
    name: 'key',
    description: 'S3 key of the file to delete',
    example: 'uploads/123e4567-e89b-12d3-a456-426614174000.jpg',
  })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid key' })
  async deleteFile(@Param('key') key: string): Promise<{ message: string }> {
    // Decode the key in case it's URL encoded
    const decodedKey = decodeURIComponent(key);
    await this.s3UploadService.deleteFile(decodedKey);
    return { message: 'File deleted successfully' };
  }
}

