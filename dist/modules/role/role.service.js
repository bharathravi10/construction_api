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
var RolesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_schema_1 = require("../../common/schemas/role.schema");
let RolesService = RolesService_1 = class RolesService {
    constructor(roleModel) {
        this.roleModel = roleModel;
        this.logger = new common_1.Logger(RolesService_1.name);
    }
    async create(createRoleDto) {
        try {
            const existingRole = await this.roleModel.findOne({
                name: createRoleDto.name,
                is_deleted: false
            }).exec();
            if (existingRole) {
                if (existingRole.is_active === true) {
                    throw new common_1.ConflictException(`Role with name '${createRoleDto.name}' already exists and is active`);
                }
                else {
                    throw new common_1.ConflictException(`Role with name '${createRoleDto.name}' already exists but is inactive`);
                }
            }
            const softDeletedRole = await this.roleModel.findOne({
                name: createRoleDto.name,
                is_deleted: true
            }).exec();
            if (softDeletedRole) {
                await this.roleModel.findByIdAndUpdate(softDeletedRole._id, {
                    ...createRoleDto,
                    is_deleted: false,
                    is_active: true
                }).exec();
                return { message: 'Role restored successfully' };
            }
            const createdRole = new this.roleModel(createRoleDto);
            await createdRole.save();
            return { message: 'Role successfully created' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to create role', error.stack);
                throw error;
            }
            else {
                this.logger.error('Failed to create role', JSON.stringify(error));
                throw new Error('Failed to create role');
            }
        }
    }
    async findAll() {
        try {
            const roles = await this.roleModel
                .find({ is_deleted: false })
                .select('_id name description is_active')
                .exec();
            return roles;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to fetch roles', error.stack);
            }
            else {
                this.logger.error('Failed to fetch roles', JSON.stringify(error));
            }
            throw error;
        }
    }
    async findOne(id) {
        try {
            const role = await this.roleModel
                .findOne({ _id: id, is_deleted: false })
                .select('_id name description is_active')
                .exec();
            if (!role) {
                throw new common_1.NotFoundException(`Role with id ${id} not found`);
            }
            return role;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch role ${id}`, error.stack);
            }
            else {
                this.logger.error(`Failed to fetch role ${id}`, JSON.stringify(error));
            }
            throw error;
        }
    }
    async update(id, updateRoleDto) {
        try {
            const existingRole = await this.roleModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!existingRole) {
                throw new common_1.NotFoundException(`Role not found`);
            }
            const conflictCheck = await this.roleModel.findOne({
                name: updateRoleDto.name,
                is_deleted: false,
                _id: { $ne: id },
            }).exec();
            if (conflictCheck) {
                throw new common_1.ConflictException(`Role name already exists`);
            }
            await this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
            return { message: 'Role updated successfully' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to update role ${id}`, error.stack);
            }
            else {
                this.logger.error(`Failed to update role ${id}`, JSON.stringify(error));
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            const deletedRole = await this.roleModel.findByIdAndUpdate(id, { is_deleted: true }, { new: true }).exec();
            if (!deletedRole)
                throw new common_1.NotFoundException(`Role with id ${id} not found`);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to delete role ${id}`, error.stack);
            }
            else {
                this.logger.error(`Failed to delete role ${id}`, JSON.stringify(error));
            }
            throw error;
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RolesService);
