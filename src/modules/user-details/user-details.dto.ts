// users/user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDate, IsBoolean, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: '6123456789' })
  @IsNotEmpty()
  @IsString()
  mobile!: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty({ example: 'http://example.com/profile.jpg', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ example: '123 Main St, City, Country', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'role_id_here' })
  @IsNotEmpty()
  role!:  Types.ObjectId;

  @ApiProperty({ 
    example: ['project_id_1', 'project_id_2'], 
    required: false,
    description: 'Array of project IDs to assign to the user'
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  projects?: Types.ObjectId[];

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'NewStrongPassword123', required: false })
  @IsOptional()
  password?: string;

  @ApiProperty({ example: '6123456789', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty({ example: 'http://example.com/profile.jpg', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ example: '123 Main St, City, Country', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'role_id_here', required: false })
  @IsOptional()
  role?:  Types.ObjectId;

  @ApiProperty({ 
    example: ['project_id_1', 'project_id_2'], 
    required: false,
    description: 'Array of project IDs to assign to the user'
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  projects?: Types.ObjectId[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class AssignProjectsDto {
  @ApiProperty({ 
    example: ['project_id_1', 'project_id_2'], 
    description: 'Array of project IDs to assign to the user'
  })
  @IsArray()
  @IsMongoId({ each: true })
  projectIds!: Types.ObjectId[];
}

export class RemoveProjectDto {
  @ApiProperty({ 
    example: 'project_id_1', 
    description: 'Project ID to remove from the user'
  })
  @IsMongoId()
  projectId!: Types.ObjectId;
}