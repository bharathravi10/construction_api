import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @Prop({ required: true })
  name!: string; // Project name

  @Prop()
  description?: string; // Short summary about the project

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true })
  state!: string;

  // Planned start and end dates (estimated)
  @Prop({ type: Date, required: true })
  plannedStartDate!: Date;

  @Prop({ type: Date, required: true })
  plannedEndDate!: Date;

  // Actual start and end dates (real timeline)
  @Prop({ type: Date })
  actualStartDate?: Date;

  @Prop({ type: Date })
  actualEndDate?: Date;

  @Prop({ default: 'Planned', enum: ['Planned', 'Ongoing', 'Completed', 'On Hold', 'Cancelled'] })
  status: string = 'Planned';

  @Prop({ type: Number, default: 0 })
  estimatedBudget: number = 0; // Total expected cost


  @Prop({ type: Number, default: 0 })
  totalPriceValue: number = 0; // Final total project price (actual)

  @Prop({ type: Number, default: 0 })
  totalEarnedValue: number = 0; // Based on progress or revenue


  @Prop({ type: Number, default: 0 })
  progressPercentage: number = 0; // Computed progress (%)

  @Prop({ type: [String], default: [] })
  documents: string[] = []; // URLs or file paths for uploaded docs


  @Prop({ type: String })
  remarks?: string; // Additional notes

  @Prop({ default: true })
  isActive: boolean = true; // Soft delete or archive flag

  @Prop({ default: false })
  is_deleted: boolean = false;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
