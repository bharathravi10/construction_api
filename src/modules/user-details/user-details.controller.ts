// users/users.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, HttpException, HttpStatus, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, AssignProjectsDto, RemoveProjectDto } from './user-details.dto';
import { UsersService } from './user-details.service';
import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Conflict - Email or mobile already exists.' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/projects/assign')
  @ApiOperation({ summary: 'Assign multiple projects to a user (adds to existing projects)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: AssignProjectsDto })
  @ApiResponse({ status: 200, description: 'Projects successfully assigned to user.' })
  async assignProjects(@Param('id') userId: string, @Body() assignProjectsDto: AssignProjectsDto) {
    return this.usersService.assignProjects(userId, assignProjectsDto);
  }

  @Delete(':id/projects/remove')
  @ApiOperation({ summary: 'Remove a project from a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: RemoveProjectDto })
  @ApiResponse({ status: 200, description: 'Project successfully removed from user.' })
  async removeProject(@Param('id') userId: string, @Body() removeProjectDto: RemoveProjectDto) {
    return this.usersService.removeProject(userId, removeProjectDto);
  }
}