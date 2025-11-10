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
  UseGuards,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { S3UploadService } from './s3-upload.service';
import {
  UploadFileResponseDto,
  UploadMultipleFilesResponseDto,
  DeleteMultipleFilesDto,
  DeleteMultipleFilesResponseDto,
} from './s3-upload.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('S3 Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('s3-upload')
export class S3UploadController {
  private static readonly MAX_FILES = 10;

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
    return this.s3UploadService.uploadFile(file, folder);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', S3UploadController.MAX_FILES))
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
    if (!files?.length) {
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
    const results: Record<string, any> = {};
    let totalFiles = 0;

    if (files.images?.length) {
      results.images = await this.s3UploadService.uploadMultipleFiles(
        files.images,
        folder ? `${folder}/images` : 'images',
      );
      totalFiles += files.images.length;
    }

    if (files.documents?.length) {
      results.documents = await this.s3UploadService.uploadMultipleFiles(
        files.documents,
        folder ? `${folder}/documents` : 'documents',
      );
      totalFiles += files.documents.length;
    }

    return {
      ...results,
      totalFiles,
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
    if (!deleteDto.keys?.length) {
      throw new BadRequestException('Keys array is required and cannot be empty');
    }
    return this.s3UploadService.deleteMultipleFiles(deleteDto.keys);
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
    const decodedKey = decodeURIComponent(key);
    await this.s3UploadService.deleteFile(decodedKey);
    return { message: 'File deleted successfully' };
  }
}
