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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMultipleFilesResponseDto = exports.FailedDeletionDto = exports.DeleteMultipleFilesDto = exports.UploadMultipleFilesResponseDto = exports.UploadFileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UploadFileResponseDto {
}
exports.UploadFileResponseDto = UploadFileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'CloudFront URL of the uploaded file' }),
    __metadata("design:type", String)
], UploadFileResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'S3 key of the uploaded file' }),
    __metadata("design:type", String)
], UploadFileResponseDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original filename', required: false }),
    __metadata("design:type", String)
], UploadFileResponseDto.prototype, "originalName", void 0);
class UploadMultipleFilesResponseDto {
}
exports.UploadMultipleFilesResponseDto = UploadMultipleFilesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UploadFileResponseDto], description: 'Array of uploaded files' }),
    __metadata("design:type", Array)
], UploadMultipleFilesResponseDto.prototype, "files", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of files uploaded' }),
    __metadata("design:type", Number)
], UploadMultipleFilesResponseDto.prototype, "count", void 0);
class DeleteMultipleFilesDto {
}
exports.DeleteMultipleFilesDto = DeleteMultipleFilesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Array of S3 keys to delete',
        example: ['uploads/file1.jpg', 'uploads/file2.jpg']
    }),
    __metadata("design:type", Array)
], DeleteMultipleFilesDto.prototype, "keys", void 0);
class FailedDeletionDto {
}
exports.FailedDeletionDto = FailedDeletionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'S3 key that failed to delete' }),
    __metadata("design:type", String)
], FailedDeletionDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Error message' }),
    __metadata("design:type", String)
], FailedDeletionDto.prototype, "error", void 0);
class DeleteMultipleFilesResponseDto {
}
exports.DeleteMultipleFilesResponseDto = DeleteMultipleFilesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Array of successfully deleted keys' }),
    __metadata("design:type", Array)
], DeleteMultipleFilesResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => [FailedDeletionDto],
        description: 'Array of failed deletions with error messages'
    }),
    __metadata("design:type", Array)
], DeleteMultipleFilesResponseDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of keys provided' }),
    __metadata("design:type", Number)
], DeleteMultipleFilesResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of successfully deleted files' }),
    __metadata("design:type", Number)
], DeleteMultipleFilesResponseDto.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of failed deletions' }),
    __metadata("design:type", Number)
], DeleteMultipleFilesResponseDto.prototype, "failedCount", void 0);
