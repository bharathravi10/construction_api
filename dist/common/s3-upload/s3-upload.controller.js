"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const s3_upload_service_1 = require("./s3-upload.service");
const s3_upload_dto_1 = require("./s3-upload.dto");
let S3UploadController = class S3UploadController {
    constructor(s3UploadService) {
        this.s3UploadService = s3UploadService;
    }
    async uploadSingleFile(file, folder) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        return this.s3UploadService.uploadFile(file, folder);
    }
    async uploadMultipleFiles(files, folder) {
        if (!files?.length) {
            throw new common_1.BadRequestException('No files provided');
        }
        const results = await this.s3UploadService.uploadMultipleFiles(files, folder);
        return {
            files: results,
            count: results.length,
        };
    }
    async uploadFileFields(files, folder) {
        const results = {};
        let totalFiles = 0;
        if (files.images?.length) {
            results.images = await this.s3UploadService.uploadMultipleFiles(files.images, folder ? `${folder}/images` : 'images');
            totalFiles += files.images.length;
        }
        if (files.documents?.length) {
            results.documents = await this.s3UploadService.uploadMultipleFiles(files.documents, folder ? `${folder}/documents` : 'documents');
            totalFiles += files.documents.length;
        }
        return {
            ...results,
            totalFiles,
        };
    }
    async deleteMultipleFiles(deleteDto) {
        if (!deleteDto.keys?.length) {
            throw new common_1.BadRequestException('Keys array is required and cannot be empty');
        }
        return this.s3UploadService.deleteMultipleFiles(deleteDto.keys);
    }
    async deleteFile(key) {
        const decodedKey = decodeURIComponent(key);
        await this.s3UploadService.deleteFile(decodedKey);
        return { message: 'File deleted successfully' };
    }
};
exports.S3UploadController = S3UploadController;
S3UploadController.MAX_FILES = 10;
__decorate([
    (0, common_1.Post)('single'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single file to S3' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'File uploaded successfully',
        type: s3_upload_dto_1.UploadFileResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid file or file too large' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], S3UploadController.prototype, "uploadSingleFile", null);
__decorate([
    (0, common_1.Post)('multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', S3UploadController.MAX_FILES)),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files to S3' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Files uploaded successfully',
        type: s3_upload_dto_1.UploadMultipleFilesResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid files or files too large' }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], S3UploadController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, common_1.Post)('fields'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'images', maxCount: 5 },
        { name: 'documents', maxCount: 5 },
    ])),
    (0, swagger_1.ApiOperation)({ summary: 'Upload files with specific field names' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Files uploaded successfully',
    }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], S3UploadController.prototype, "uploadFileFields", null);
__decorate([
    (0, common_1.Delete)('multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete multiple files from S3' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Files deletion completed (check success and failed arrays)',
        type: s3_upload_dto_1.DeleteMultipleFilesResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid keys' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [s3_upload_dto_1.DeleteMultipleFilesDto]),
    __metadata("design:returntype", Promise)
], S3UploadController.prototype, "deleteMultipleFiles", null);
__decorate([
    (0, common_1.Delete)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a single file from S3' }),
    (0, swagger_1.ApiParam)({
        name: 'key',
        description: 'S3 key of the file to delete',
        example: 'uploads/123e4567-e89b-12d3-a456-426614174000.jpg',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid key' }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], S3UploadController.prototype, "deleteFile", null);
exports.S3UploadController = S3UploadController = __decorate([
    (0, swagger_1.ApiTags)('S3 Upload'),
    (0, common_1.Controller)('s3-upload'),
    __metadata("design:paramtypes", [s3_upload_service_1.S3UploadService])
], S3UploadController);
