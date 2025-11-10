import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { FileInfoSchemaDefinition, FileInfo } from './file-info.schema';

export type TaskDocument = Task & Document;

// Issue sub-schema definition
const IssueSchemaDefinition = new MongooseSchema({
  title: { type: String, required: true },
  description: { type: String },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  reportedDate: { type: Date, default: Date.now },
  resolvedDate: { type: Date },
  reportedBy: { type: String },
  resolvedBy: { type: String },
  remarks: { type: String },
}, { _id: false });

export interface Issue {
  title: string;
  description?: string;
  severity?: string;
  status?: string;
  reportedDate?: Date;
  resolvedDate?: Date;
  reportedBy?: string;
  resolvedBy?: string;
  remarks?: string;
}

@Schema({ timestamps: true, collection: 'tasks' })
export class Task {
  @Prop({ required: true })
  name!: string; // Task name

  @Prop()
  description?: string; // Task description

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project!: Types.ObjectId; // Link to project (required)

  @Prop({ type: Date, required: true })
  startDate!: Date; // Task start date

  @Prop({ type: Date, required: true })
  endDate!: Date; // Task end date

  @Prop({ type: Date })
  actualStartDate?: Date; // Actual start date

  @Prop({ type: Date })
  actualEndDate?: Date; // Actual end date

  @Prop({ default: 'Assigned', enum: ['Assigned', 'In Progress', 'Completed'] })
  status: string = 'Assigned'; // Task status

  @Prop({ type: [IssueSchemaDefinition], default: [] })
  issues: Issue[] = []; // Array of issues

  @Prop({ type: Number, default: 0 })
  progressPercentage: number = 0; // Progress tracking (%)

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  assignedUsers: Types.ObjectId[] = []; // Users assigned to the task (can be single or multiple)

  @Prop()
  remarks?: string; // Additional notes

  @Prop({ type: [FileInfoSchemaDefinition], default: [] })
  documents: FileInfo[] = []; // File info array with url, key, and originalName

  @Prop({ default: true })
  isActive: boolean = true; // Soft delete or archive flag

  @Prop({ default: false })
  is_deleted: boolean = false;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

