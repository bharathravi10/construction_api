import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true, collection: 'attendances' })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId; // Reference to User

  @Prop({ type: Date, required: true })
  date!: Date; // Attendance date

  @Prop({ 
    enum: ['present', 'absent', 'halfday'], 
    required: true,
    default: 'present'
  })
  status!: string; // Attendance status: present, absent, halfday

  @Prop({ type: Date })
  checkIn?: Date; // Check-in time (for present/halfday)

  @Prop({ type: Date })
  checkOut?: Date; // Check-out time (for present/halfday)

  @Prop({ type: Number, default: 0 })
  overtime: number = 0; // Overtime in minutes

  @Prop()
  remarks?: string; // Additional notes or remarks

  @Prop({ default: false })
  is_deleted: boolean = false;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Compound index to ensure one attendance record per user per date
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

