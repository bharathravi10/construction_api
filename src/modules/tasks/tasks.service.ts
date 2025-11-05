import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../../common/schemas/task.schema';
import { Project, ProjectDocument } from '../../common/schemas/projects.schema';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto, AddIssueDto, UpdateIssueInTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Wrapper for error handling - eliminates code duplication
   */
  private async handleError<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    context?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const contextStr = context ? ` ${context}` : '';
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error; // Re-throw known exceptions
      }
      if (error instanceof Error) {
        this.logger.error(`Failed to ${errorMessage}${contextStr}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error ${errorMessage}${contextStr}`, JSON.stringify(error));
        throw new Error(`Failed to ${errorMessage}`);
      }
    }
  }

  /**
   * Validate project exists
   */
  private async validateProject(projectId: string | Types.ObjectId): Promise<void> {
    const project = await this.projectModel.findOne({ 
      _id: projectId, 
      is_deleted: false 
    }).exec();
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  /**
   * Validate user exists
   */
  private async validateUser(userId: string | Types.ObjectId): Promise<void> {
    const user = await this.userModel.findOne({ 
      _id: userId, 
      is_deleted: false 
    }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  /**
   * Validate multiple users exist
   */
  private async validateUsers(userIds: (string | Types.ObjectId)[]): Promise<void> {
    if (!userIds || userIds.length === 0) return;

    const users = await this.userModel.find({ 
      _id: { $in: userIds }, 
      is_deleted: false 
    }).exec();
    
    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more assigned users not found');
    }
  }

  /**
   * Validate that assigned users belong to the project
   */
  private async validateUsersAssignedToProject(
    userIds: (string | Types.ObjectId)[],
    projectId: string | Types.ObjectId
  ): Promise<void> {
    if (!userIds || userIds.length === 0) return;

    const projectIdStr = projectId.toString();
    
    // Fetch project details for error message
    const project = await this.projectModel.findOne({ 
      _id: projectId, 
      is_deleted: false 
    }).select('_id name').exec();

    const projectName = project?.name || 'the project';

    // Fetch users with their names for better error messages
    const users = await this.userModel.find({ 
      _id: { $in: userIds }, 
      is_deleted: false 
    }).select('_id name email projects').exec();

    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more assigned users not found');
    }

    // Check if all users have the project in their projects array
    const usersNotAssignedToProject = users.filter(user => {
      const userProjects = user.projects || [];
      return !userProjects.some(p => p.toString() === projectIdStr);
    });

    if (usersNotAssignedToProject.length > 0) {
      // Create user-friendly error message with names only
      const userDetails = usersNotAssignedToProject.map(u => {
        return u.name || u.email || u._id.toString();
      }).join(', ');

      throw new BadRequestException(
        `The following users are not assigned to project "${projectName}": ${userDetails}`
      );
    }
  }

  /**
   * Validate date range
   */
  private validateDateRange(startDate: Date, endDate: Date): void {
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException('Start date cannot be after end date');
    }
  }

  /**
   * Find and validate task exists
   */
  private async findTaskById(id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOne({ _id: id, is_deleted: false })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  /**
   * Populate task with project and user details
   */
  private async populateTaskDetails(task: TaskDocument): Promise<any> {
    const taskObj = task.toObject();

    // Populate project
    if (task.project) {
      const project = await this.projectModel
        .findOne({ _id: task.project, is_deleted: false })
        .select('_id name status')
        .exec();
      if (project) {
        taskObj.project = project;
      }
    }

    // Populate assignedUsers - optimized batch query
    if (task.assignedUsers && task.assignedUsers.length > 0) {
      const userIds = task.assignedUsers.map(u => u.toString());
      const users = await this.userModel
        .find({ _id: { $in: userIds }, is_deleted: false })
        .select('_id name email mobile')
        .exec();
      taskObj.assignedUsers = users;
    }

    return taskObj;
  }

  /**
   * Populate multiple tasks with details - optimized with batch queries
   */
  private async populateTasksDetails(tasks: TaskDocument[]): Promise<any[]> {
    if (tasks.length === 0) return [];

    // Collect all unique IDs for batch queries
    const projectIds = new Set<string>();
    const userIds = new Set<string>();

    tasks.forEach(task => {
      if (task.project) {
        projectIds.add(task.project.toString());
      }
      if (task.assignedUsers && task.assignedUsers.length > 0) {
        task.assignedUsers.forEach(u => userIds.add(u.toString()));
      }
    });

    // Batch fetch projects and users
    const [projects, users] = await Promise.all([
      projectIds.size > 0
        ? this.projectModel
            .find({ _id: { $in: Array.from(projectIds) }, is_deleted: false })
            .select('_id name status')
            .exec()
        : Promise.resolve([]),
      userIds.size > 0
        ? this.userModel
            .find({ _id: { $in: Array.from(userIds) }, is_deleted: false })
            .select('_id name email mobile')
            .exec()
        : Promise.resolve([]),
    ]);

    // Create lookup maps for O(1) access
    const projectMap = new Map(projects.map(p => [p._id.toString(), p]));
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    // Populate tasks using maps
    return tasks.map(task => {
      const taskObj = task.toObject();
      
      if (task.project) {
        const project = projectMap.get(task.project.toString());
        if (project) {
          taskObj.project = project;
        }
      }

      if (task.assignedUsers && task.assignedUsers.length > 0) {
        taskObj.assignedUsers = task.assignedUsers
          .map(u => userMap.get(u.toString()))
          .filter(Boolean); // Remove undefined values
      }

      return taskObj;
    });
  }

  /**
   * Prepare task data with ObjectId conversions
   */
  private prepareTaskData(taskData: any): any {
    const prepared: any = { ...taskData };

    if (prepared.project) {
      prepared.project = new Types.ObjectId(prepared.project);
    }

    if (prepared.assignedUsers && Array.isArray(prepared.assignedUsers)) {
      prepared.assignedUsers = prepared.assignedUsers.map((id: string | Types.ObjectId) => 
        new Types.ObjectId(id)
      );
    }

    return prepared;
  }

  async create(createTaskDto: CreateTaskDto): Promise<{ message: string }> {
    return this.handleError(async () => {
      // Validate project
      await this.validateProject(createTaskDto.project);

      // Validate assigned users and check if they belong to the project
      if (createTaskDto.assignedUsers && createTaskDto.assignedUsers.length > 0) {
        await this.validateUsersAssignedToProject(createTaskDto.assignedUsers, createTaskDto.project);
      }

      // Validate dates
      this.validateDateRange(createTaskDto.startDate, createTaskDto.endDate);

      // Prepare and save task
      const taskData = this.prepareTaskData(createTaskDto);
      const createdTask = new this.taskModel(taskData);
      await createdTask.save();
      
      this.logger.log(`Task created: ${createdTask._id}`);
      return { message: 'Task created successfully' };
    }, 'create task');
  }

  async findAll(filters?: { projectId?: string; status?: string; assignedTo?: string }): Promise<any[]> {
    return this.handleError(async () => {
      const query: any = { is_deleted: false };

      if (filters?.projectId) {
        query.project = filters.projectId;
      }

      if (filters?.status) {
        query.status = filters.status;
      }

      if (filters?.assignedTo) {
        query.assignedUsers = filters.assignedTo;
      }

      const tasks = await this.taskModel
        .find(query)
        .select('-createdAt -updatedAt -__v -is_deleted')
        .sort({ createdAt: -1 })
        .exec();

      return this.populateTasksDetails(tasks);
    }, 'fetch tasks');
  }

  async findOne(id: string): Promise<any> {
    return this.handleError(async () => {
      const task = await this.taskModel
        .findOne({ _id: id, is_deleted: false })
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return this.populateTaskDetails(task);
    }, 'fetch task', id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Partial<Task>> {
    return this.handleError(async () => {
      // Get existing task first (needed for date validation and project check)
      const existingTask = await this.findTaskById(id);

      // Validate project if being updated
      const projectId = updateTaskDto.project ?? existingTask.project;
      if (updateTaskDto.project) {
        await this.validateProject(updateTaskDto.project);
      }

      // Validate assigned users if being updated - check if they belong to the project
      if (updateTaskDto.assignedUsers && updateTaskDto.assignedUsers.length > 0) {
        await this.validateUsersAssignedToProject(updateTaskDto.assignedUsers, projectId);
      }

      // Validate dates - need existing task for comparison
      const startDate = updateTaskDto.startDate ?? existingTask.startDate;
      const endDate = updateTaskDto.endDate ?? existingTask.endDate;
      this.validateDateRange(startDate, endDate);

      // Prepare update data
      const updateData = this.prepareTaskData(updateTaskDto);

      const task = await this.taskModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $set: updateData },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!task) {
        throw new NotFoundException('Task not found or deleted');
      }

      this.logger.log(`Task updated: ${id}`);
      return task.toObject();
    }, 'update task', id);
  }

  async softDelete(id: string): Promise<{ message: string }> {
    return this.handleError(async () => {
      const task = await this.taskModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: { is_deleted: true, isActive: false } },
        { new: true }
      ).exec();

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      this.logger.log(`Task soft-deleted: ${id}`);
      return { message: 'Task deleted successfully' };
    }, 'delete task', id);
  }

  /**
   * Delete task - soft delete only (sets is_deleted: true)
   * All tasks are soft deleted regardless of status
   */
  async delete(id: string): Promise<{ message: string }> {
    return this.softDelete(id);
  }

  async updateStatus(id: string, updateStatusDto: UpdateTaskStatusDto): Promise<Partial<Task>> {
    return this.handleError(async () => {
      const task = await this.findTaskById(id);

      const updateData: any = {
        status: updateStatusDto.status,
      };

      // Set actual start date if status is being changed to 'In Progress'
      if (updateStatusDto.status === 'In Progress' && !task.actualStartDate) {
        updateData.actualStartDate = updateStatusDto.actualStartDate || new Date();
      }

      // Set actual end date if status is being changed to 'Completed'
      if (updateStatusDto.status === 'Completed') {
        updateData.actualEndDate = updateStatusDto.actualEndDate || new Date();
        updateData.progressPercentage = 100;
      }

      const updatedTask = await this.taskModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $set: updateData },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!updatedTask) {
        throw new NotFoundException('Task not found or deleted');
      }

      this.logger.log(`Task status updated: ${id} to ${updateStatusDto.status}`);
      return updatedTask.toObject();
    }, 'update task status', id);
  }

  async addIssue(id: string, addIssueDto: AddIssueDto): Promise<Partial<Task>> {
    return this.handleError(async () => {
      await this.findTaskById(id);

      const newIssue = {
        ...addIssueDto.issue,
        reportedDate: addIssueDto.issue.reportedDate || new Date(),
      };

      const updatedTask = await this.taskModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $push: { issues: newIssue } },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!updatedTask) {
        throw new NotFoundException('Task not found or deleted');
      }

      this.logger.log(`Issue added to task: ${id}`);
      return updatedTask.toObject();
    }, 'add issue to task', id);
  }

  async updateIssue(id: string, updateIssueDto: UpdateIssueInTaskDto): Promise<Partial<Task>> {
    return this.handleError(async () => {
      const task = await this.findTaskById(id);

      if (!task.issues || task.issues.length <= updateIssueDto.issueIndex) {
        throw new BadRequestException('Issue index out of range');
      }

      const updatePath: any = {};
      Object.keys(updateIssueDto.issue).forEach(key => {
        if (updateIssueDto.issue[key] !== undefined) {
          updatePath[`issues.${updateIssueDto.issueIndex}.${key}`] = updateIssueDto.issue[key];
        }
      });

      // If status is being changed to 'Resolved' or 'Closed', set resolved date
      if (updateIssueDto.issue.status === 'Resolved' || updateIssueDto.issue.status === 'Closed') {
        if (!task.issues[updateIssueDto.issueIndex].resolvedDate) {
          updatePath[`issues.${updateIssueDto.issueIndex}.resolvedDate`] = new Date();
        }
      }

      const updatedTask = await this.taskModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $set: updatePath },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!updatedTask) {
        throw new NotFoundException('Task not found or deleted');
      }

      this.logger.log(`Issue updated in task: ${id} at index ${updateIssueDto.issueIndex}`);
      return updatedTask.toObject();
    }, 'update issue in task', id);
  }

  async removeIssue(id: string, issueIndex: number): Promise<Partial<Task>> {
    return this.handleError(async () => {
      const task = await this.findTaskById(id);

      if (!task.issues || task.issues.length <= issueIndex) {
        throw new BadRequestException('Issue index out of range');
      }

      // Remove issue at the specified index
      task.issues.splice(issueIndex, 1);

      const updatedTask = await this.taskModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $set: { issues: task.issues } },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!updatedTask) {
        throw new NotFoundException('Task not found or deleted');
      }

      this.logger.log(`Issue removed from task: ${id} at index ${issueIndex}`);
      return updatedTask.toObject();
    }, 'remove issue from task', id);
  }

  async getTasksByProject(projectId: string): Promise<Partial<Task>[]> {
    return this.handleError(async () => {
      await this.validateProject(projectId);

      const tasks = await this.taskModel
        .find({ project: projectId, is_deleted: false })
        .select('-createdAt -updatedAt -__v -is_deleted')
        .sort({ createdAt: -1 })
        .exec();

      return tasks.map(task => task.toObject());
    }, 'fetch tasks for project', projectId);
  }
}
