import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  HttpException, 
  HttpStatus,
  Logger,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { RolesService } from './role.service';
import { Role } from '../../common/schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  private readonly logger = new Logger(RolesController.name);

  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role successfully created.' })
  @ApiBody({ type: CreateRoleDto })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<{ message: string }> {
    try {
      const result = await this.rolesService.create(createRoleDto);
      return result; // Nest will send 201 automatically if you use @HttpCode(201)
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error creating role', error.stack);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        this.logger.error('Unknown error creating role', JSON.stringify(error));
        throw new HttpException(
          'An unknown error occurred while creating role',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  

  @Get()
  @ApiOperation({ summary: 'Retrieve all roles' })
  @ApiResponse({ status: 200, description: 'List of roles.', type: [Role] })
  async findAll(): Promise<Partial<Role>[]> {
    try {
      const roles = await this.rolesService.findAll();
      return roles;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error fetching roles', error.stack);
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        this.logger.error('Unknown error fetching roles', JSON.stringify(error));
        throw new HttpException('An unknown error occurred while fetching roles', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role found.', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(@Param('id') id: string): Promise<Partial<Role>> {
      try {
        return await this.rolesService.findOne(id);
      } catch (error: any) {
        this.logger.error(`Error fetching role ${id}`, error?.stack);
        throw new HttpException(error?.message || 'Role not found', error?.status || HttpStatus.NOT_FOUND);
      }
    }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated.', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<{ message: string }> {
      try {
        return await this.rolesService.update(id, updateRoleDto);
      } catch (error: any) {
        this.logger.error(`Error updating role ${id}`, error?.stack);
        throw new HttpException(error?.message || 'Role not found', error?.status || HttpStatus.NOT_FOUND);
      }
    }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      this.logger.log(`Deleting role ID: ${id}`);
      await this.rolesService.remove(id);
      return { message: `Role ${id} deleted successfully` };
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error deleting role ${id}`, err?.stack);
      throw new HttpException(err?.message || 'Role not found', err?.status || HttpStatus.NOT_FOUND);
    }
  }
}
