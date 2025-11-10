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
var ProjectService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const projects_schema_1 = require("../../common/schemas/projects.schema");
const user_schema_1 = require("../../common/schemas/user.schema");
let ProjectService = ProjectService_1 = class ProjectService {
    constructor(projectModel, userModel) {
        this.projectModel = projectModel;
        this.userModel = userModel;
        this.logger = new common_1.Logger(ProjectService_1.name);
    }
    async createProject(createDto) {
        try {
            const project = new this.projectModel(createDto);
            await project.save();
            this.logger.log(`Project created: ${project._id}`);
            return { message: 'Project created successfully' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to create project', error.stack);
                throw error;
            }
            else {
                this.logger.error('Unknown error creating project', JSON.stringify(error));
                throw new Error('Failed to create project');
            }
        }
    }
    async getAllProjects() {
        try {
            const projects = await this.projectModel
                .find({ is_deleted: false })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .sort({ createdAt: -1 })
                .exec();
            return projects;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to fetch projects', error.stack);
                throw error;
            }
            else {
                this.logger.error('Unknown error fetching projects', JSON.stringify(error));
                throw new Error('Failed to fetch projects');
            }
        }
    }
    async getProjectById(id) {
        try {
            const project = await this.projectModel
                .findOne({ _id: id, is_deleted: false })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!project) {
                throw new common_1.NotFoundException('Project not found');
            }
            return project;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch project ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error fetching project ${id}`, JSON.stringify(error));
                throw new Error('Failed to fetch project');
            }
        }
    }
    async updateProject(id, updateDto) {
        try {
            const project = await this.projectModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updateDto }, { new: true }).select('-createdAt -updatedAt -__v -is_deleted').exec();
            if (!project) {
                throw new common_1.NotFoundException('Project not found or deleted');
            }
            this.logger.log(`Project updated: ${id}`);
            return project;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to update project ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error updating project ${id}`, JSON.stringify(error));
                throw new Error('Failed to update project');
            }
        }
    }
    async softDeleteProject(id) {
        try {
            const project = await this.projectModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: { is_deleted: true, isActive: false } }, { new: true }).exec();
            if (!project) {
                throw new common_1.NotFoundException('Project not found');
            }
            this.logger.log(`Project soft-deleted: ${id}`);
            return { message: 'Project soft deleted successfully' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to delete project ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error deleting project ${id}`, JSON.stringify(error));
                throw new Error('Failed to delete project');
            }
        }
    }
    async getProjectUsers(projectId) {
        try {
            const users = await this.userModel
                .find({
                projects: projectId,
                is_deleted: false
            })
                .select('_id name email mobile role')
                .populate('role', 'name')
                .exec();
            return users;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch users for project ${projectId}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error fetching users for project ${projectId}`, JSON.stringify(error));
                throw new Error('Failed to fetch project users');
            }
        }
    }
    async getProjectsByUser(userId) {
        try {
            const user = await this.userModel
                .findOne({ _id: userId, is_deleted: false })
                .populate('projects')
                .exec();
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user.projects;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch projects for user ${userId}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error fetching projects for user ${userId}`, JSON.stringify(error));
                throw new Error('Failed to fetch projects for user');
            }
        }
    }
    async getProjectTeamMembers(projectId) {
        try {
            const project = await this.projectModel
                .findOne({ _id: projectId, is_deleted: false })
                .exec();
            if (!project) {
                throw new common_1.NotFoundException('Project not found');
            }
            const teamMembers = await this.userModel
                .find({
                projects: projectId,
                is_deleted: false
            })
                .select('_id name email mobile role')
                .populate('role', 'name')
                .exec();
            return teamMembers;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch team members for project ${projectId}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error fetching team members for project ${projectId}`, JSON.stringify(error));
                throw new Error('Failed to fetch project team members');
            }
        }
    }
    async getProjectClients(projectId) {
        try {
            const project = await this.projectModel
                .findOne({ _id: projectId, is_deleted: false })
                .exec();
            if (!project) {
                throw new common_1.NotFoundException('Project not found');
            }
            const clients = await this.userModel
                .find({
                projects: projectId,
                is_deleted: false
            })
                .populate({
                path: 'role',
                match: { name: 'Client' }
            })
                .exec();
            return clients.filter(user => {
                const role = user.role;
                return role && typeof role === 'object' && 'name' in role && role.name === 'Client';
            });
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch clients for project ${projectId}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error fetching clients for project ${projectId}`, JSON.stringify(error));
                throw new Error('Failed to fetch project clients');
            }
        }
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = ProjectService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(projects_schema_1.Project.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProjectService);
