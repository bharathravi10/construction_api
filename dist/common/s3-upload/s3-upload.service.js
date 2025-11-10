"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var S3UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
let S3UploadService = S3UploadService_1 = class S3UploadService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(S3UploadService_1.name);
        this.maxFileSize = 10 * 1024 * 1024;
        this.region = this.configService.get('AWS_REGION')?.trim() || 'us-east-1';
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID')?.trim() || '';
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY')?.trim() || '';
        if (!accessKeyId || !secretAccessKey) {
            this.logger.error('AWS credentials are missing from environment variables');
        }
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.bucketName = this.configService.get('S3_BUCKET_NAME')?.trim() || '';
        this.cloudFrontDomain = this.configService.get('CLOUDFRONT_DOMAIN')?.trim() || '';
        if (!this.bucketName) {
            this.logger.warn('S3 bucket name is not configured');
        }
    }
    async uploadFile(file, folder = 'uploads') {
        this.validateFile(file);
        this.validateBucket();
        const key = this.generateFileKey(file.originalname, folder);
        const uploadCommand = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.s3Client.send(uploadCommand);
        const url = this.getCloudFrontUrl(key);
        return { url, key };
    }
    async uploadMultipleFiles(files, folder = 'uploads') {
        if (!files?.length) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadPromises = files.map(async (file) => {
            const result = await this.uploadFile(file, folder);
            return { ...result, originalName: file.originalname };
        });
        return Promise.all(uploadPromises);
    }
    async deleteFile(key) {
        if (!key) {
            throw new common_1.BadRequestException('File key is required');
        }
        const deleteCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(deleteCommand);
    }
    async deleteMultipleFiles(keys) {
        if (!keys?.length) {
            throw new common_1.BadRequestException('File keys are required');
        }
        const deletePromises = keys.map(async (key) => {
            try {
                const decodedKey = decodeURIComponent(key);
                await this.deleteFile(decodedKey);
                return { success: true, key: decodedKey };
            }
            catch (error) {
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
    validateFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException('File size exceeds 10MB limit');
        }
    }
    validateBucket() {
        if (!this.bucketName) {
            throw new common_1.BadRequestException('S3 bucket name is not configured. Please set S3_BUCKET_NAME in your .env file');
        }
    }
    generateFileKey(originalName, folder) {
        const fileExtension = path.extname(originalName);
        const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        return folder ? `${folder}/${fileName}` : fileName;
    }
    getCloudFrontUrl(key) {
        if (this.cloudFrontDomain) {
            const domain = this.cloudFrontDomain.replace(/\/$/, '');
            const cleanKey = key.startsWith('/') ? key.substring(1) : key;
            return `https://${domain}/${cleanKey}`;
        }
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }
};
exports.S3UploadService = S3UploadService;
exports.S3UploadService = S3UploadService = S3UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3UploadService);
