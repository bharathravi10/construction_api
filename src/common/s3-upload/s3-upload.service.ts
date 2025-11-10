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
  private readonly region: string;
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION')?.trim() || 'us-east-1';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID')?.trim() || '';
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY')?.trim() || '';

    if (!accessKeyId || !secretAccessKey) {
      this.logger.error('AWS credentials are missing from environment variables');
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME')?.trim() || '';
    this.cloudFrontDomain = this.configService.get<string>('CLOUDFRONT_DOMAIN')?.trim() || '';

    if (!this.bucketName) {
      this.logger.warn('S3 bucket name is not configured');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string; originalName: string }> {
    this.validateFile(file);
    this.validateBucket();

    const key = this.generateFileKey(file.originalname, folder);

    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(uploadCommand);
    const url = this.getCloudFrontUrl(key);

    return { url, key, originalName: file.originalname };
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string; originalName: string }[]> {
    if (!files?.length) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map(async (file) => {
      const result = await this.uploadFile(file, folder);
      return { ...result, originalName: file.originalname };
    });

    return Promise.all(uploadPromises);
  }

  async deleteFile(key: string): Promise<void> {
    if (!key) {
      throw new BadRequestException('File key is required');
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(deleteCommand);
  }

  async deleteMultipleFiles(keys: string[]): Promise<{
    success: string[];
    failed: { key: string; error: string }[];
    total: number;
    successCount: number;
    failedCount: number;
  }> {
    if (!keys?.length) {
      throw new BadRequestException('File keys are required');
    }

    const deletePromises = keys.map(async (key) => {
      try {
        const decodedKey = decodeURIComponent(key);
        await this.deleteFile(decodedKey);
        return { success: true, key: decodedKey };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, key, error: errorMessage };
      }
    });

    const results = await Promise.all(deletePromises);
    const success = results.filter((r) => r.success).map((r) => r.key);
    const failed = results
      .filter((r) => !r.success)
      .map((r) => ({ key: r.key, error: r.error || 'Unknown error' }));

    return {
      success,
      failed,
      total: keys.length,
      successCount: success.length,
      failedCount: failed.length,
    };
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }
  }

  private validateBucket(): void {
    if (!this.bucketName) {
      throw new BadRequestException('S3 bucket name is not configured. Please set S3_BUCKET_NAME in your .env file');
    }
  }

  private generateFileKey(originalName: string, folder: string): string {
    const fileExtension = path.extname(originalName);
    const fileName = `${uuidv4()}${fileExtension}`;
    return folder ? `${folder}/${fileName}` : fileName;
  }

  private getCloudFrontUrl(key: string): string {
    if (this.cloudFrontDomain) {
      const domain = this.cloudFrontDomain.replace(/\/$/, '');
      const cleanKey = key.startsWith('/') ? key.substring(1) : key;
      return `https://${domain}/${cleanKey}`;
    }
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
