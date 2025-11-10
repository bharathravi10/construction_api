import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  HttpCode, 
  HttpStatus,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto, AddIssueDto, UpdateIssueInTaskDto } from './tasks.dto';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Project or user not found.' })
  @ApiBody({ type: CreateTaskDto })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks (optionally filtered by project, status, or assigned user)' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (Assigned, In Progress, Completed)' })
  @ApiQuery({ name: 'assignedTo', required: false, description: 'Filter by assigned user ID' })
  @ApiResponse({ status: 200, description: 'List of tasks.' })
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
    @Query('assignedTo') assignedTo?: string
  ) {
    return this.tasksService.findAll({ projectId, status, assignedTo });
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all tasks assigned to a specific project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'List of tasks for the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async getTasksByProject(@Param('projectId') projectId: string) {
    return this.tasksService.getTasksByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task details.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task details' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status (Assigned, In Progress, Completed)' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskStatusDto })
  @ApiResponse({ status: 200, description: 'Task status successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateTaskStatusDto) {
    return this.tasksService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/issues')
  @ApiOperation({ summary: 'Add an issue to a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: AddIssueDto })
  @ApiResponse({ status: 201, description: 'Issue successfully added to task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async addIssue(@Param('id') id: string, @Body() addIssueDto: AddIssueDto) {
    return this.tasksService.addIssue(id, addIssueDto);
  }

  @Patch(':id/issues/:issueIndex')
  @ApiOperation({ summary: 'Update an issue in a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiParam({ name: 'issueIndex', description: 'Index of the issue in the issues array' })
  @ApiBody({ type: UpdateIssueInTaskDto })
  @ApiResponse({ status: 200, description: 'Issue successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request - Issue index out of range.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async updateIssue(
    @Param('id') id: string,
    @Param('issueIndex') issueIndex: string,
    @Body() updateIssueDto: UpdateIssueInTaskDto
  ) {
    // Create new object with issueIndex from URL
    const updateDto: UpdateIssueInTaskDto = {
      issueIndex: parseInt(issueIndex, 10),
      issue: updateIssueDto.issue
    };
    return this.tasksService.updateIssue(id, updateDto);
  }

  @Delete(':id/issues/:issueIndex')
  @ApiOperation({ summary: 'Remove an issue from a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiParam({ name: 'issueIndex', description: 'Index of the issue in the issues array' })
  @ApiResponse({ status: 200, description: 'Issue successfully removed from task.' })
  @ApiResponse({ status: 400, description: 'Bad request - Issue index out of range.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async removeIssue(@Param('id') id: string, @Param('issueIndex') issueIndex: string) {
    return this.tasksService.removeIssue(id, parseInt(issueIndex, 10));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async remove(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}

