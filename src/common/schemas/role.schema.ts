// roles/schemas/role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true, collection: 'roles' })
export class Role {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ default: false }) // false means not deleted
  is_deleted?: boolean;

  @Prop({ default: true }) // true means active
  is_active?: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
