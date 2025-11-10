import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3UploadService } from './s3-upload.service';
import { S3UploadController } from './s3-upload.controller';

@Module({
  imports: [ConfigModule],
  controllers: [S3UploadController],
  providers: [S3UploadService],
  exports: [S3UploadService], // Export service so it can be used in other modules
})
export class S3UploadModule {}

