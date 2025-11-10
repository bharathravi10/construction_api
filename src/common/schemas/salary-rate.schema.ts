import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalaryRateDocument = SalaryRate & Document;

@Schema({ timestamps: true, collection: 'salary_rates' })
export class SalaryRate {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId; // Reference to User

  @Prop({ type: Types.ObjectId, ref: 'Project', required: false })
  project?: Types.ObjectId; // Reference to Project (optional - null means base/default salary)

  @Prop({ 
    enum: ['day', 'hour', 'project'], 
    required: true,
    default: 'day'
  })
  calculationType!: string; // 'day' for day-based, 'hour' for hour-based, 'project' for project-based

  @Prop({ type: Number, required: false })
  dailyRate?: number; // Daily salary rate in currency (e.g., 1000.00) - required if calculationType is 'day'

  @Prop({ type: Number, required: false })
  hourlyRate?: number; // Hourly salary rate in currency (e.g., 125.00) - required if calculationType is 'hour'

  @Prop({ type: Number, required: false })
  projectRate?: number; // Project-based salary rate in currency (e.g., 50000.00) - required if calculationType is 'project'

  @Prop({ type: Number, default: 0 })
  overtimeRatePerHour: number = 0; // Overtime rate per hour (e.g., 100.00 per hour) - not needed for project-based

  @Prop({ type: Date, default: Date.now })
  effectiveFrom!: Date; // When this rate becomes effective

  @Prop({ type: Date })
  effectiveTo?: Date; // When this rate expires (null means currently active)

  @Prop({ default: true })
  isActive: boolean = true; // Active rate

  @Prop({ default: false })
  is_deleted: boolean = false;

  @Prop()
  remarks?: string; // Additional notes
}

export const SalaryRateSchema = SchemaFactory.createForClass(SalaryRate);

// Compound index to ensure one active rate per user-project combination at a time
SalaryRateSchema.index({ user: 1, project: 1, effectiveFrom: 1 });
// Index for quick lookup of active rates
SalaryRateSchema.index({ user: 1, project: 1, isActive: 1, is_deleted: 1 });

