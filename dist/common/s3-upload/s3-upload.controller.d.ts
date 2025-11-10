import { S3UploadService } from './s3-upload.service';
import { UploadFileResponseDto, UploadMultipleFilesResponseDto, DeleteMultipleFilesDto, DeleteMultipleFilesResponseDto } from './s3-upload.dto';
export declare class S3UploadController {
    private readonly s3UploadService;
    private static readonly MAX_FILES;
    constructor(s3UploadService: S3UploadService);
    uploadSingleFile(file: Express.Multer.File, folder?: string): Promise<UploadFileResponseDto>;
    uploadMultipleFiles(files: Express.Multer.File[], folder?: string): Promise<UploadMultipleFilesResponseDto>;
    uploadFileFields(files: {
        images?: Express.Multer.File[];
        documents?: Express.Multer.File[];
    }, folder?: string): Promise<{
        totalFiles: number;
    }>;
    deleteMultipleFiles(deleteDto: DeleteMultipleFilesDto): Promise<DeleteMultipleFilesResponseDto>;
    deleteFile(key: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=s3-upload.controller.d.ts.map