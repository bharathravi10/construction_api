import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

// File info sub-schema for storing S3 file information
export const FileInfoSchemaDefinition = new MongooseSchema({
  url: { type: String, required: true },
  key: { type: String, required: true },
  originalName: { type: String, required: false },
}, { _id: false });

export interface FileInfo {
  url: string;
  key: string;
  originalName?: string;
}

