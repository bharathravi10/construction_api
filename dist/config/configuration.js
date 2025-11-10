"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/nest-boilerplate',
    PORT: process.env.PORT || 3000,
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,
});
