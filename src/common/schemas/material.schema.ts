import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { FileInfoSchemaDefinition, FileInfo } from './file-info.schema';

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true, collection: 'materials' })
export class Material {
  @Prop({ required: true })
  name!: string; // Material name (e.g., "Cement", "Steel Rods", "Paint")

  @Prop()
  description?: string; // Description of the material

  @Prop({ required: true, enum: ['Raw Material', 'Equipment', 'Consumables', 'Tools', 'Other'] })
  category!: string; // Material category

  @Prop({ required: true })
  supplierName!: string; // Supplier name

  @Prop()
  supplierContact?: string; // Supplier contact number/email

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project?: Types.ObjectId; // Link to project (optional for general materials)

  @Prop({ type: Number, default: 0 })
  stockQuantity: number = 0; // Available stock quantity

  @Prop({ type: Number, default: 0 })
  usedQuantity: number = 0; // Quantity used

  @Prop({ type: Number, default: 0 })
  requiredQuantity: number = 0; // Quantity required

  @Prop({ type: Number, default: 0 })
  costPerUnit: number = 0; // Cost per unit

  @Prop({ type: Number, default: 0 })
  totalCost: number = 0; // Total cost (calculated: costPerUnit * stockQuantity)

  @Prop()
  unit?: string; // Unit of measurement (e.g., "kg", "liters", "pieces")

  @Prop({ type: Date })
  expectedDeliveryDate?: Date; // Expected delivery date

  @Prop({ type: Date })
  actualDeliveryDate?: Date; // Actual delivery date

  @Prop({ type: FileInfoSchemaDefinition })
  invoiceUrl?: FileInfo; // File info with url, key, and originalName

  @Prop({ type: FileInfoSchemaDefinition })
  grnUrl?: FileInfo; // File info with url, key, and originalName

  @Prop({ default: 'Pending', enum: ['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'] })
  deliveryStatus: string = 'Pending'; // Delivery tracking status

  @Prop({ default: 0 })
  progressPercentage: number = 0; // Progress tracking for material usage

  @Prop({ type: [FileInfoSchemaDefinition], default: [] })
  documents: FileInfo[] = []; // File info array with url, key, and originalName

  @Prop()
  remarks?: string; // Additional notes

  @Prop({ default: false })
  isInsufficient: boolean = false; // Flag for insufficient stock

  @Prop({ default: true })
  isActive: boolean = true;

  @Prop({ default: false })
  is_deleted: boolean = false;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

