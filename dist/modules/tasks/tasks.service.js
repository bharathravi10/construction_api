"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("../../common/schemas/task.schema");
const projects_schema_1 = require("../../common/schemas/projects.schema");
const user_schema_1 = require("../../common/schemas/user.schema");
let TasksService = TasksService_1 = class TasksService {
    constructor(taskModel, projectModel, userModel) {
        this.taskModel = taskModel;
        this.projectModel = projectModel;
        this.userModel = userModel;
        this.logger = new common_1.Logger(TasksService_1.name);
    }
    async handleError(operation, errorMessage, context) {
        try {
            return await operation();
        }
        catch (error) {
            const contextStr = context ? ` ${context}` : '';
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error instanceof Error) {
                this.logger.error(`Failed to ${errorMessage}${contextStr}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error ${errorMessage}${contextStr}`, JSON.stringify(error));
                throw new Error(`Failed to ${errorMessage}`);
            }
        }
    }
    async validateProject(projectId) {
        const project = await this.projectModel.findOne({
            _id: projectId,
            is_deleted: false
        }).exec();
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
    }
    async validateUser(userId) {
        const user = await this.userModel.findOne({
            _id: userId,
            is_deleted: false
        }).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async validateUsers(userIds) {
        if (!userIds || userIds.length === 0)
            return;
        const users = await this.userModel.find({
            _id: { $in: userIds },
            is_deleted: false
        }).exec();
        if (users.length !== userIds.length) {
            throw new common_1.NotFoundException('One or more assigned users not found');
        }
    }
    async validateUsersAssignedToProject(userIds, projectId) {
        if (!userIds || userIds.length === 0)
            return;
        const projectIdStr = projectId.toString();
        const project = await this.projectModel.findOne({
            _id: projectId,
            is_deleted: false
        }).select('_id name').exec();
        const projectName = project?.name || 'the project';
        const users = await this.userModel.find({
            _id: { $in: userIds },
            is_deleted: false
        }).select('_id name email projects').exec();
        if (users.length !== userIds.length) {
            throw new common_1.NotFoundException('One or more assigned users not found');
        }
        const usersNotAssignedToProject = users.filter(user => {
            const userProjects = user.projects || [];
            return !userProjects.some(p => p.toString() === projectIdStr);
        });
        if (usersNotAssignedToProject.length > 0) {
            const userDetails = usersNotAssignedToProject.map(u => {
                return u.name || u.email || u._id.toString();
            }).join(', ');
            throw new common_1.BadRequestException(`The following users are not assigned to project "${projectName}": ${userDetails}`);
        }
    }
    validateDateRange(startDate, endDate) {
        if (new Date(startDate) > new Date(endDate)) {
            throw new common_1.BadRequestException('Start date cannot be after end date');
        }
    }
    async findTaskById(id) {
        const task = await this.taskModel
            .findOne({ _id: id, is_deleted: false })
            .exec();
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async populateTaskDetails(task) {
        const taskObj = task.toObject();
        if (task.project) {
            const project = await this.projectModel
                .findOne({ _id: task.project, is_deleted: false })
                .select('_id name status')
                .exec();
            if (project) {
                taskObj.project = project;
            }
        }
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
    async populateTasksDetails(tasks) {
        if (tasks.length === 0)
            return [];
        const projectIds = new Set();
        const userIds = new Set();
        tasks.forEach(task => {
            if (task.project) {
                projectIds.add(task.project.toString());
            }
            if (task.assignedUsers && task.assignedUsers.length > 0) {
                task.assignedUsers.forEach(u => userIds.add(u.toString()));
            }
        });
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
        const projectMap = new Map(projects.map(p => [p._id.toString(), p]));
        const userMap = new Map(users.map(u => [u._id.toString(), u]));
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
                    .filter(Boolean);
            }
            return taskObj;
        });
    }
    prepareTaskData(taskData) {
        const prepared = { ...taskData };
        if (prepared.project) {
            prepared.project = new mongoose_2.Types.ObjectId(prepared.project);
        }
        if (prepared.assignedUsers && Array.isArray(prepared.assignedUsers)) {
            prepared.assignedUsers = prepared.assignedUsers.map((id) => new mongoose_2.Types.ObjectId(id));
        }
        return prepared;
    }
    async create(createTaskDto) {
        return this.handleError(async () => {
            await this.validateProject(createTaskDto.project);
            if (createTaskDto.assignedUsers && createTaskDto.assignedUsers.length > 0) {
                await this.validateUsersAssignedToProject(createTaskDto.assignedUsers, createTaskDto.project);
            }
            this.validateDateRange(createTaskDto.startDate, createTaskDto.endDate);
            const taskData = this.prepareTaskData(createTaskDto);
            const createdTask = new this.taskModel(taskData);
            await createdTask.save();
            this.logger.log(`Task created: ${createdTask._id}`);
            return { message: 'Task created successfully' };
        }, 'create task');
    }
    async findAll(filters) {
        return this.handleError(async () => {
            const query = { is_deleted: false };
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
    async findOne(id) {
        return this.handleError(async () => {
            const task = await this.taskModel
                .findOne({ _id: id, is_deleted: false })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!task) {
                throw new common_1.NotFoundException('Task not found');
            }
            return this.populateTaskDetails(task);
        }, 'fetch task', id);
    }
    async update(id, updateTaskDto) {
        return this.handleError(async () => {
            const existingTask = await this.findTaskById(id);
            const projectId = updateTaskDto.project ?? existingTask.project;
            if (updateTaskDto.project) {
                await this.validateProject(updateTaskDto.project);
            }
            if (updateTaskDto.assignedUsers && updateTaskDto.assignedUsers.length > 0) {
                await this.validateUsersAssignedToProject(updateTaskDto.assignedUsers, projectId);
            }
            const startDate = updateTaskDto.startDate ?? existingTask.startDate;
            const endDate = updateTaskDto.endDate ?? existingTask.endDate;
            this.validateDateRange(startDate, endDate);
            const updateData = this.prepareTaskData(updateTaskDto);
            const task = await this.taskModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updateData }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!task) {
                throw new common_1.NotFoundException('Task not found or deleted');
            }
            this.logger.log(`Task updated: ${id}`);
            return task.toObject();
        }, 'update task', id);
    }
    async softDelete(id) {
        return this.handleError(async () => {
            const task = await this.taskModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: { is_deleted: true, isActive: false } }, { new: true }).exec();
            if (!task) {
                throw new common_1.NotFoundException('Task not found');
            }
            this.logger.log(`Task soft-deleted: ${id}`);
            return { message: 'Task deleted successfully' };
        }, 'delete task', id);
    }
    async delete(id) {
        return this.softDelete(id);
    }
    async updateStatus(id, updateStatusDto) {
        return this.handleError(async () => {
            const task = await this.findTaskById(id);
            const updateData = {
                status: updateStatusDto.status,
            };
            if (updateStatusDto.status === 'In Progress' && !task.actualStartDate) {
                updateData.actualStartDate = updateStatusDto.actualStartDate || new Date();
            }
            if (updateStatusDto.status === 'Completed') {
                updateData.actualEndDate = updateStatusDto.actualEndDate || new Date();
                updateData.progressPercentage = 100;
            }
            const updatedTask = await this.taskModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updateData }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!updatedTask) {
                throw new common_1.NotFoundException('Task not found or deleted');
            }
            this.logger.log(`Task status updated: ${id} to ${updateStatusDto.status}`);
            return updatedTask.toObject();
        }, 'update task status', id);
    }
    async addIssue(id, addIssueDto) {
        return this.handleError(async () => {
            await this.findTaskById(id);
            const newIssue = {
                ...addIssueDto.issue,
                reportedDate: addIssueDto.issue.reportedDate || new Date(),
            };
            const updatedTask = await this.taskModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $push: { issues: newIssue } }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!updatedTask) {
                throw new common_1.NotFoundException('Task not found or deleted');
            }
            this.logger.log(`Issue added to task: ${id}`);
            return updatedTask.toObject();
        }, 'add issue to task', id);
    }
    async updateIssue(id, updateIssueDto) {
        return this.handleError(async () => {
            const task = await this.findTaskById(id);
            if (!task.issues || task.issues.length <= updateIssueDto.issueIndex) {
                throw new common_1.BadRequestException('Issue index out of range');
            }
            const updatePath = {};
            Object.keys(updateIssueDto.issue).forEach(key => {
                const typedKey = key;
                if (updateIssueDto.issue[typedKey] !== undefined) {
                    updatePath[`issues.${updateIssueDto.issueIndex}.${typedKey}`] = updateIssueDto.issue[typedKey];
                }
            });
            if (updateIssueDto.issue.status === 'Resolved' || updateIssueDto.issue.status === 'Closed') {
                if (!task.issues[updateIssueDto.issueIndex].resolvedDate) {
                    updatePath[`issues.${updateIssueDto.issueIndex}.resolvedDate`] = new Date();
                }
            }
            const updatedTask = await this.taskModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updatePath }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!updatedTask) {
                throw new common_1.NotFoundException('Task not found or deleted');
            }
            this.logger.log(`Issue updated in task: ${id} at index ${updateIssueDto.issueIndex}`);
            return updatedTask.toObject();
        }, 'update issue in task', id);
    }
    async removeIssue(id, issueIndex) {
        return this.handleError(async () => {
            const task = await this.findTaskById(id);
            if (!task.issues || task.issues.length <= issueIndex) {
                throw new common_1.BadRequestException('Issue index out of range');
            }
            task.issues.splice(issueIndex, 1);
            const updatedTask = await this.taskModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $set: { issues: task.issues } }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!updatedTask) {
                throw new common_1.NotFoundException('Task not found or deleted');
            }
            this.logger.log(`Issue removed from task: ${id} at index ${issueIndex}`);
            return updatedTask.toObject();
        }, 'remove issue from task', id);
    }
    async getTasksByProject(projectId) {
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
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __param(1, (0, mongoose_1.InjectModel)(projects_schema_1.Project.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TasksService);
