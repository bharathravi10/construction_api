// roles/dto/create-role.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'The name of the role', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  name!: string;
    
  @ApiProperty({ description: 'The description of the role', example: 'Administrator role' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The active status of the role', example: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}