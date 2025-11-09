import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalaryCalculationDocument = SalaryCalculation & Document;

@Schema({ timestamps: true, collection: 'salary_calculations' })
export class SalaryCalculation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId; // Reference to User

  @Prop({ type: Types.ObjectId, ref: 'Project', required: false })
  project?: Types.ObjectId; // Reference to Project (optional - null means all projects or base salary)

  @Prop({ type: String, required: true })
  periodType!: string; // 'month', 'week', 'year', 'custom'

  @Prop({ type: Date, required: true })
  periodStart!: Date; // Start date of the period

  @Prop({ type: Date, required: true })
  periodEnd!: Date; // End date of the period

  // Attendance summary
  @Prop({ type: Number, default: 0 })
  totalDays: number = 0; // Total working days in period

  @Prop({ type: Number, default: 0 })
  presentDays: number = 0; // Full present days

  @Prop({ type: Number, default: 0 })
  halfDays: number = 0; // Half days

  @Prop({ type: Number, default: 0 })
  absentDays: number = 0; // Absent days

  @Prop({ type: Number, default: 0 })
  totalOvertimeHours: number = 0; // Total overtime in hours

  // Salary calculations
  @Prop({ 
    enum: ['day', 'hour', 'project'], 
    default: 'day'
  })
  calculationType: string = 'day'; // 'day', 'hour', or 'project' - how salary was calculated

  @Prop({ type: Number, default: 0 })
  baseSalary: number = 0; // Base salary (present days * daily rate) OR (total hours * hourly rate)

  @Prop({ type: Number, default: 0 })
  halfDaySalary: number = 0; // Half day salary (half days * daily rate / 2) OR (half day hours * hourly rate)

  @Prop({ type: Number, default: 0 })
  overtimeSalary: number = 0; // Overtime salary (overtime hours * overtime rate)

  @Prop({ type: Number, default: 0 })
  totalSalary: number = 0; // Total calculated salary

  @Prop({ type: Number, default: 0 })
  dailyRate: number = 0; // Daily rate used for calculation (if day-based)

  @Prop({ type: Number, default: 0 })
  hourlyRate: number = 0; // Hourly rate used for calculation (if hour-based)

  @Prop({ type: Number, default: 0 })
  projectRate: number = 0; // Project rate used for calculation (if project-based)

  @Prop({ type: Number, default: 0 })
  overtimeRatePerHour: number = 0; // Overtime rate used for calculation (not used for project-based)

  @Prop({ type: Number, default: 0 })
  totalWorkingHours: number = 0; // Total working hours (for hour-based calculation)

  @Prop({ type: String, default: 'pending' })
  status: string = 'pending'; // 'pending', 'calculated', 'approved', 'paid'

  @Prop({ type: Date })
  approvedAt?: Date; // When salary was approved

  @Prop({ type: Date })
  paidAt?: Date; // When salary was paid

  @Prop()
  remarks?: string; // Additional notes

  @Prop({ default: false })
  is_deleted: boolean = false;
}

export const SalaryCalculationSchema = SchemaFactory.createForClass(SalaryCalculation);

// Compound index for quick lookup
SalaryCalculationSchema.index({ user: 1, project: 1, periodStart: 1, periodEnd: 1 });
SalaryCalculationSchema.index({ user: 1, periodType: 1, periodStart: 1 });

