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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_dto_1 = require("./tasks.dto");
const tasks_service_1 = require("./tasks.service");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(createTaskDto) {
        return this.tasksService.create(createTaskDto);
    }
    async findAll(projectId, status, assignedTo) {
        return this.tasksService.findAll({ projectId, status, assignedTo });
    }
    async getTasksByProject(projectId) {
        return this.tasksService.getTasksByProject(projectId);
    }
    async findOne(id) {
        return this.tasksService.findOne(id);
    }
    async update(id, updateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }
    async updateStatus(id, updateStatusDto) {
        return this.tasksService.updateStatus(id, updateStatusDto);
    }
    async addIssue(id, addIssueDto) {
        return this.tasksService.addIssue(id, addIssueDto);
    }
    async updateIssue(id, issueIndex, updateIssueDto) {
        const updateDto = {
            issueIndex: parseInt(issueIndex, 10),
            issue: updateIssueDto.issue
        };
        return this.tasksService.updateIssue(id, updateDto);
    }
    async removeIssue(id, issueIndex) {
        return this.tasksService.removeIssue(id, parseInt(issueIndex, 10));
    }
    async remove(id) {
        return this.tasksService.delete(id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project or user not found.' }),
    (0, swagger_1.ApiBody)({ type: tasks_dto_1.CreateTaskDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tasks_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks (optionally filtered by project, status, or assigned user)' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, description: 'Filter by project ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by status (Assigned, In Progress, Completed)' }),
    (0, swagger_1.ApiQuery)({ name: 'assignedTo', required: false, description: 'Filter by assigned user ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of tasks.' }),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('assignedTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks assigned to a specific project' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of tasks for the project.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found.' }),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTasksByProject", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a task by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiBody)({ type: tasks_dto_1.UpdateTaskDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tasks_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task status (Assigned, In Progress, Completed)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiBody)({ type: tasks_dto_1.UpdateTaskStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tasks_dto_1.UpdateTaskStatusDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/issues'),
    (0, swagger_1.ApiOperation)({ summary: 'Add an issue to a task' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiBody)({ type: tasks_dto_1.AddIssueDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Issue successfully added to task.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tasks_dto_1.AddIssueDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "addIssue", null);
__decorate([
    (0, common_1.Patch)(':id/issues/:issueIndex'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an issue in a task' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiParam)({ name: 'issueIndex', description: 'Index of the issue in the issues array' }),
    (0, swagger_1.ApiBody)({ type: tasks_dto_1.UpdateIssueInTaskDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issue successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Issue index out of range.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('issueIndex')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, tasks_dto_1.UpdateIssueInTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateIssue", null);
__decorate([
    (0, common_1.Delete)(':id/issues/:issueIndex'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an issue from a task' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiParam)({ name: 'issueIndex', description: 'Index of the issue in the issues array' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Issue successfully removed from task.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Issue index out of range.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('issueIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "removeIssue", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a task' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
