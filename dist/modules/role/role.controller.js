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
var RolesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const role_service_1 = require("./role.service");
const role_schema_1 = require("../../common/schemas/role.schema");
const role_dto_1 = require("./role.dto");
let RolesController = RolesController_1 = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
        this.logger = new common_1.Logger(RolesController_1.name);
    }
    async create(createRoleDto) {
        try {
            const result = await this.rolesService.create(createRoleDto);
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error creating role', error.stack);
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                this.logger.error('Unknown error creating role', JSON.stringify(error));
                throw new common_1.HttpException('An unknown error occurred while creating role', common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async findAll() {
        try {
            const roles = await this.rolesService.findAll();
            return roles;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error fetching roles', error.stack);
                throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else {
                this.logger.error('Unknown error fetching roles', JSON.stringify(error));
                throw new common_1.HttpException('An unknown error occurred while fetching roles', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async findOne(id) {
        try {
            return await this.rolesService.findOne(id);
        }
        catch (error) {
            this.logger.error(`Error fetching role ${id}`, error?.stack);
            throw new common_1.HttpException(error?.message || 'Role not found', error?.status || common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, updateRoleDto) {
        try {
            return await this.rolesService.update(id, updateRoleDto);
        }
        catch (error) {
            this.logger.error(`Error updating role ${id}`, error?.stack);
            throw new common_1.HttpException(error?.message || 'Role not found', error?.status || common_1.HttpStatus.NOT_FOUND);
        }
    }
    async remove(id) {
        try {
            this.logger.log(`Deleting role ID: ${id}`);
            await this.rolesService.remove(id);
            return { message: `Role ${id} deleted successfully` };
        }
        catch (error) {
            const err = error;
            this.logger.error(`Error deleting role ${id}`, err?.stack);
            throw new common_1.HttpException(err?.message || 'Role not found', err?.status || common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role successfully created.' }),
    (0, swagger_1.ApiBody)({ type: role_dto_1.CreateRoleDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of roles.', type: [role_schema_1.Role] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a role by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role found.', type: role_schema_1.Role }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a role by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_1.ApiBody)({ type: role_dto_1.UpdateRoleDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated.', type: role_schema_1.Role }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a role by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "remove", null);
exports.RolesController = RolesController = RolesController_1 = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [role_service_1.RolesService])
], RolesController);
