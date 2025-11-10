export declare class UploadFileResponseDto {
    url: string;
    key: string;
    originalName?: string;
}
export declare class UploadMultipleFilesResponseDto {
    files: UploadFileResponseDto[];
    count: number;
}
export declare class DeleteMultipleFilesDto {
    keys: string[];
}
export declare class FailedDeletionDto {
    key: string;
    error: string;
}
export declare class DeleteMultipleFilesResponseDto {
    success: string[];
    failed: FailedDeletionDto[];
    total: number;
    successCount: number;
    failedCount: number;
}
//# sourceMappingURL=s3-upload.dto.d.ts.map