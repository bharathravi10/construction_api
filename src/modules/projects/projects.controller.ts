import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto'
import { ProjectService } from './projects.service';
@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  create(@Body() createDto: CreateProjectDto) {
    return this.projectService.createProject(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active (non-deleted) projects' })
  findAll() {
    return this.projectService.getAllProjects();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  findOne(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project details' })
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectDto) {
    return this.projectService.updateProject(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a project' })
  softDelete(@Param('id') id: string) {
    return this.projectService.softDeleteProject(id);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get all users assigned to a project' })
  getProjectUsers(@Param('id') projectId: string) {
    return this.projectService.getProjectUsers(projectId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all projects assigned to a specific user' })
  getProjectsByUser(@Param('userId') userId: string) {
    return this.projectService.getProjectsByUser(userId);
  }

  @Get(':id/team')
  @ApiOperation({ summary: 'Get project team members including project manager' })
  getProjectTeamMembers(@Param('id') projectId: string) {
    return this.projectService.getProjectTeamMembers(projectId);
  }

  @Get(':id/clients')
  @ApiOperation({ summary: 'Get project clients (users with Client role)' })
  getProjectClients(@Param('id') projectId: string) {
    return this.projectService.getProjectClients(projectId);
  }
}
