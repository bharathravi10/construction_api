// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role, RoleDocument } from './role.schema';
import { Project, ProjectDocument } from './projects.schema';
import { FileInfoSchemaDefinition, FileInfo } from './file-info.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role!: Types.ObjectId | RoleDocument;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }], default: [] })
  projects!: Types.ObjectId[] | ProjectDocument[];

  @Prop({ required: true, unique: true })
  mobile!: string;

  @Prop()
  dob?: string; // Date of birth

  @Prop({ type: FileInfoSchemaDefinition })
  profileImage?: FileInfo; // File info with url, key, and originalName

  @Prop()
  address?: string;

  @Prop()
  name?: string;

  @Prop({ default: true })
  is_active!: boolean;

  @Prop({ default: false })
  is_deleted!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Password hashing hook
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (plainPassword: string) {
  return bcrypt.compare(plainPassword, this.password);
};