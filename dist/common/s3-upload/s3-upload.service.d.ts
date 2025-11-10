import { ConfigService } from '@nestjs/config';
export declare class S3UploadService {
    private readonly configService;
    private readonly logger;
    private readonly s3Client;
    private readonly bucketName;
    private readonly cloudFrontDomain;
    private readonly region;
    private readonly maxFileSize;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        key: string;
    }>;
    uploadMultipleFiles(files: Express.Multer.File[], folder?: string): Promise<{
        url: string;
        key: string;
        originalName: string;
    }[]>;
    deleteFile(key: string): Promise<void>;
    deleteMultipleFiles(keys: string[]): Promise<{
        success: string[];
        failed: {
            key: string;
            error: string;
        }[];
        total: number;
        successCount: number;
        failedCount: number;
    }>;
    private validateFile;
    private validateBucket;
    private generateFileKey;
    private getCloudFrontUrl;
}
//# sourceMappingURL=s3-upload.service.d.ts.map