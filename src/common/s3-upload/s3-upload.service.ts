import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class S3UploadService {
  private readonly logger = new Logger(S3UploadService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly cloudFrontDomain: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION')?.trim() || 'us-east-1';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID')?.trim() || '';
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY')?.trim() || '';

    if (!accessKeyId || !secretAccessKey) {
      this.logger.error('AWS credentials are missing from environment variables');
      this.logger.error(`Access Key ID: ${accessKeyId ? 'Present' : 'Missing'}`);
      this.logger.error(`Secret Access Key: ${secretAccessKey ? 'Present' : 'Missing'}`);
    } else {
      this.logger.log(`AWS credentials loaded. Region: ${region}, Access Key ID: ${accessKeyId.substring(0, 8)}...`);
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME')?.trim() || '';
    this.cloudFrontDomain = this.configService.get<string>('CLOUDFRONT_DOMAIN')?.trim() || '';
    
    this.logger.log(`S3 Bucket: ${this.bucketName || 'Not configured'}`);
    this.logger.log(`CloudFront Domain: ${this.cloudFrontDomain || 'Not configured'}`);
  }

  /**
   * Upload a file to S3 and return the CloudFront URL
   * @param file - The file buffer and metadata
   * @param folder - Optional folder path in S3 bucket (e.g., 'images', 'documents')
   * @returns CloudFront URL of the uploaded file
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (!this.bucketName) {
        throw new BadRequestException('S3 bucket name is not configured. Please set S3_BUCKET_NAME in your .env file');
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new BadRequestException('File size exceeds 10MB limit');
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const key = folder ? `${folder}/${fileName}` : fileName;

      this.logger.log(`Attempting to upload to bucket: ${this.bucketName}, region: ${this.configService.get<string>('AWS_REGION')}`);

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Note: ACL is removed as newer S3 buckets have ACLs disabled by default
        // Use bucket policy for public access instead
      });

      await this.s3Client.send(uploadCommand);
      this.logger.log(`File uploaded successfully: ${key}`);

      // Generate CloudFront URL
      const url = this.getCloudFrontUrl(key);

      return { url, key };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
        this.logger.error(`Bucket: ${this.bucketName}, Region: ${this.configService.get<string>('AWS_REGION')}`);
        
        if (error instanceof BadRequestException) {
          throw error;
        }
        
        // Provide more helpful error messages
        if (error.message.includes('does not exist')) {
          throw new BadRequestException(
            `S3 bucket "${this.bucketName}" does not exist in region "${this.configService.get<string>('AWS_REGION')}". ` +
            `Please verify: 1) The bucket name is correct, 2) The bucket exists in the specified region, 3) Your AWS credentials have access to this bucket.`
          );
        }
        
        throw new BadRequestException(`Failed to upload file: ${error.message}`);
      }
      this.logger.error('Failed to upload file: Unknown error', JSON.stringify(error));
      throw new BadRequestException('Failed to upload file: Unknown error occurred');
    }
  }

  /**
   * Upload multiple files to S3
   * @param files - Array of files
   * @param folder - Optional folder path in S3 bucket
   * @returns Array of CloudFront URLs and keys
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string; originalName: string }[]> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
      }

      const uploadPromises = files.map((file) =>
        this.uploadFile(file, folder).then((result) => ({
          ...result,
          originalName: file.originalname,
        })),
      );

      const results = await Promise.all(uploadPromises);
      this.logger.log(`Uploaded ${results.length} files successfully`);

      return results;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to upload multiple files: ${error.message}`, error.stack);
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException(`Failed to upload files: ${error.message}`);
      }
      this.logger.error('Failed to upload multiple files: Unknown error', JSON.stringify(error));
      throw new BadRequestException('Failed to upload files: Unknown error occurred');
    }
  }

  /**
   * Delete a file from S3
   * @param key - The S3 key of the file to delete
   */
  async deleteFile(key: string): Promise<void> {
    try {
      if (!key) {
        throw new BadRequestException('File key is required');
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
        throw new BadRequestException(`Failed to delete file: ${error.message}`);
      }
      this.logger.error('Failed to delete file: Unknown error', JSON.stringify(error));
      throw new BadRequestException('Failed to delete file: Unknown error occurred');
    }
  }

  /**
   * Delete multiple files from S3
   * @param keys - Array of S3 keys to delete
   * @returns Object with success and failed deletions
   */
  async deleteMultipleFiles(keys: string[]): Promise<{ 
    success: string[]; 
    failed: { key: string; error: string }[]; 
    total: number;
    successCount: number;
    failedCount: number;
  }> {
    try {
      if (!keys || keys.length === 0) {
        throw new BadRequestException('File keys are required');
      }

      const deletePromises = keys.map(async (key) => {
        try {
          const decodedKey = decodeURIComponent(key);
          await this.deleteFile(decodedKey);
          return { success: true, key: decodedKey };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Failed to delete file ${key}: ${errorMessage}`);
          return { success: false, key, error: errorMessage };
        }
      });

      const results = await Promise.all(deletePromises);
      
      const success = results.filter(r => r.success).map(r => r.key);
      const failed = results
        .filter(r => !r.success)
        .map(r => ({ key: r.key, error: r.error || 'Unknown error' }));

      this.logger.log(`Deleted ${success.length} out of ${keys.length} files successfully`);

      return {
        success,
        failed,
        total: keys.length,
        successCount: success.length,
        failedCount: failed.length,
      };
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Failed to delete multiple files: Unknown error', JSON.stringify(error));
      throw new BadRequestException('Failed to delete multiple files: Unknown error occurred');
    }
  }

  private getCloudFrontUrl(key: string): string {
    if (this.cloudFrontDomain) {
      const domain = this.cloudFrontDomain.replace(/\/$/, '');
      const cleanKey = key.startsWith('/') ? key.substring(1) : key;
      return `https://${domain}/${cleanKey}`;
    }
    const region = this.configService.get<string>('AWS_REGION');
    return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
  }
}

