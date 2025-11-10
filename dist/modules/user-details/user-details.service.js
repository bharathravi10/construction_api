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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../common/schemas/user.schema");
const projects_schema_1 = require("../../common/schemas/projects.schema");
let UsersService = UsersService_1 = class UsersService {
    constructor(userModel, projectModel) {
        this.userModel = userModel;
        this.projectModel = projectModel;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async create(createUserDto) {
        try {
            const softDeletedUser = await this.userModel.findOne({
                $or: [{ email: createUserDto.email }, { mobile: createUserDto.mobile }],
                is_deleted: true,
            }).exec();
            if (softDeletedUser) {
                const userData = {
                    ...createUserDto,
                    role: new mongoose_2.Types.ObjectId(createUserDto.role),
                    projects: createUserDto.projects ? createUserDto.projects.map(id => new mongoose_2.Types.ObjectId(id)) : [],
                    is_deleted: false,
                    is_active: true
                };
                Object.assign(softDeletedUser, userData);
                await softDeletedUser.save();
                return { message: 'User restored successfully' };
            }
            const existingUser = await this.userModel.findOne({
                $or: [{ email: createUserDto.email }, { mobile: createUserDto.mobile }],
                is_deleted: false,
            }).exec();
            if (existingUser) {
                throw new common_1.ConflictException('Email or mobile already exists');
            }
            const userData = {
                ...createUserDto,
                role: new mongoose_2.Types.ObjectId(createUserDto.role),
                projects: createUserDto.projects ? createUserDto.projects.map(id => new mongoose_2.Types.ObjectId(id)) : []
            };
            const createdUser = new this.userModel(userData);
            await createdUser.save();
            return { message: 'User successfully created' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to create user', error.stack);
                throw error;
            }
            else {
                this.logger.error('Unknown error while creating user', JSON.stringify(error));
                throw new Error('Failed to create user');
            }
        }
    }
    async findAll() {
        try {
            const users = await this.userModel
                .find({ is_deleted: false })
                .select('_id name email mobile role projects is_active dob profileImage address')
                .populate({
                path: 'role',
                select: '_id name description'
            })
                .exec();
            const usersWithProjects = await Promise.all(users.map(async (user) => {
                if (user.projects && user.projects.length > 0) {
                    const projectIds = user.projects.map(p => p.toString());
                    const projects = await this.projectModel
                        .find({ _id: { $in: projectIds }, is_deleted: false })
                        .select('_id name description address state status estimatedBudget')
                        .exec();
                    return { ...user.toObject(), projects };
                }
                return user.toObject();
            }));
            return usersWithProjects;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to fetch users', error.stack);
            }
            else {
                this.logger.error('Unknown error fetching users', JSON.stringify(error));
            }
            throw error;
        }
    }
    async findOne(id) {
        try {
            const user = await this.userModel
                .findOne({ _id: id, is_deleted: false })
                .select('_id name email mobile role projects is_active dob profileImage address')
                .populate({
                path: 'role',
                select: '_id name description'
            })
                .exec();
            if (!user)
                throw new common_1.NotFoundException(`User not found`);
            let projects = [];
            if (user.projects && user.projects.length > 0) {
                const projectIds = user.projects.map(p => p.toString());
                projects = await this.projectModel
                    .find({ _id: { $in: projectIds }, is_deleted: false })
                    .select('_id name description address state status estimatedBudget')
                    .exec();
            }
            return { ...user.toObject(), projects };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch user ${id}`, error.stack);
            }
            else {
                this.logger.error(`Unknown error fetching user ${id}`, JSON.stringify(error));
            }
            throw error;
        }
    }
    async update(id, updateUserDto) {
        try {
            const existingUser = await this.userModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!existingUser)
                throw new common_1.NotFoundException(`User not found`);
            if (updateUserDto.email || updateUserDto.mobile) {
                const conflictCheck = await this.userModel.findOne({
                    $or: [
                        { email: updateUserDto.email },
                        { mobile: updateUserDto.mobile }
                    ],
                    _id: { $ne: id },
                    is_deleted: false
                }).exec();
                if (conflictCheck)
                    throw new common_1.ConflictException('Email or mobile already exists');
            }
            const updateData = {
                ...updateUserDto,
                role: updateUserDto.role ? new mongoose_2.Types.ObjectId(updateUserDto.role) : undefined,
                projects: updateUserDto.projects ? updateUserDto.projects.map(id => new mongoose_2.Types.ObjectId(id)) : undefined
            };
            await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
            this.logger.log(`User updated: ${id}`);
            return { message: 'User successfully updated' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to update user ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error updating user ${id}`, JSON.stringify(error));
                throw new Error('Failed to update user');
            }
        }
    }
    async remove(id) {
        try {
            const user = await this.userModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!user)
                throw new common_1.NotFoundException(`User with id ${id} not found`);
            user.is_deleted = true;
            await user.save();
            this.logger.log(`User soft-deleted: ${id}`);
            return { message: 'User successfully deleted' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to delete user ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error deleting user ${id}`, JSON.stringify(error));
                throw new Error('Failed to delete user');
            }
        }
    }
    async assignProjects(userId, assignProjectsDto) {
        try {
            const user = await this.userModel.findOne({ _id: userId, is_deleted: false }).exec();
            if (!user)
                throw new common_1.NotFoundException(`User not found`);
            const projectIds = assignProjectsDto.projectIds.map(id => new mongoose_2.Types.ObjectId(id));
            const existingProjects = user.projects || [];
            const newProjects = [...new Set([...existingProjects.map(p => p.toString()), ...projectIds.map(p => p.toString())])];
            user.projects = newProjects.map(id => new mongoose_2.Types.ObjectId(id));
            await user.save();
            this.logger.log(`Projects assigned to user: ${userId}`);
            return { message: 'Projects successfully assigned to user' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to assign projects to user ${userId}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error assigning projects to user ${userId}`, JSON.stringify(error));
                throw new Error('Failed to assign projects to user');
            }
        }
    }
    async removeProject(userId, removeProjectDto) {
        try {
            const user = await this.userModel.findOne({ _id: userId, is_deleted: false }).exec();
            if (!user)
                throw new common_1.NotFoundException(`User not found`);
            const projectId = new mongoose_2.Types.ObjectId(removeProjectDto.projectId);
            const existingProjects = user.projects || [];
            const updatedProjects = existingProjects.filter(p => p.toString() !== projectId.toString());
            await this.userModel.findByIdAndUpdate(userId, { projects: updatedProjects }, { new: true }).exec();
            this.logger.log(`Project removed from user: ${userId}`);
            return { message: 'Project successfully removed from user' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to remove project from user ${userId}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error removing project from user ${userId}`, JSON.stringify(error));
                throw new Error('Failed to remove project from user');
            }
        }
    }
    async getUserProjects(userId) {
        try {
            const user = await this.userModel
                .findOne({ _id: userId, is_deleted: false })
                .select('_id name email projects')
                .populate({
                path: 'projects',
                select: '-createdAt -updatedAt -__v -is_deleted'
            })
                .exec();
            if (!user)
                throw new common_1.NotFoundException(`User not found`);
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch user projects ${userId}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error fetching user projects ${userId}`, JSON.stringify(error));
                throw new Error('Failed to fetch user projects');
            }
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(projects_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
