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
exports.MaterialsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const materials_dto_1 = require("./materials.dto");
const materials_service_1 = require("./materials.service");
let MaterialsController = class MaterialsController {
    constructor(materialsService) {
        this.materialsService = materialsService;
    }
    async create(createMaterialDto) {
        return this.materialsService.create(createMaterialDto);
    }
    async findAll(projectId, category, deliveryStatus) {
        return this.materialsService.findAll({ projectId, category, deliveryStatus });
    }
    async getInsufficientMaterials(projectId) {
        return this.materialsService.getInsufficientMaterials(projectId);
    }
    async getMaterialsByProject(projectId) {
        return this.materialsService.getMaterialsByProject(projectId);
    }
    async findOne(id) {
        return this.materialsService.findOne(id);
    }
    async update(id, updateMaterialDto) {
        return this.materialsService.update(id, updateMaterialDto);
    }
    async updateUsage(id, updateUsageDto) {
        return this.materialsService.updateUsage(id, updateUsageDto);
    }
    async updateDeliveryStatus(id, updateDeliveryDto) {
        return this.materialsService.updateDeliveryStatus(id, updateDeliveryDto);
    }
    async updateInsufficientStatus(id, updateInsufficientDto) {
        return this.materialsService.updateInsufficientStatus(id, updateInsufficientDto);
    }
    async remove(id) {
        return this.materialsService.softDelete(id);
    }
};
exports.MaterialsController = MaterialsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new material' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Material successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found (if project ID is provided).' }),
    (0, swagger_1.ApiBody)({ type: materials_dto_1.CreateMaterialDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [materials_dto_1.CreateMaterialDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all materials (optionally filtered by project, category, or delivery status)' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, description: 'Filter by project ID' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by category' }),
    (0, swagger_1.ApiQuery)({ name: 'deliveryStatus', required: false, description: 'Filter by delivery status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of materials.' }),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('deliveryStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('insufficient'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all materials with insufficient stock' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, description: 'Filter by project ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of materials with insufficient stock.' }),
    __param(0, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "getInsufficientMaterials", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all materials assigned to a specific project' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of materials for the project.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found.' }),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "getMaterialsByProject", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a material by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Material ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Material details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update material details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Material ID' }),
    (0, swagger_1.ApiBody)({ type: materials_dto_1.UpdateMaterialDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Material successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, materials_dto_1.UpdateMaterialDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/usage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update material usage quantity' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Material ID' }),
    (0, swagger_1.ApiBody)({ type: materials_dto_1.UpdateMaterialUsageDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Material usage successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Used quantity exceeds stock quantity.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, materials_dto_1.UpdateMaterialUsageDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "updateUsage", null);
__decorate([
    (0, common_1.Patch)(':id/delivery'),
    (0, swagger_1.ApiOperation)({ summary: 'Update material delivery status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Material ID' }),
    (0, swagger_1.ApiBody)({ type: materials_dto_1.UpdateDeliveryStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery status successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, materials_dto_1.UpdateDeliveryStatusDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "updateDeliveryStatus", null);
__decorate([
    (0, common_1.Patch)(':id/insufficient'),
    (0, swagger_1.ApiOperation)({ summary: 'Update material insufficient stock status manually' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Material ID' }),
    (0, swagger_1.ApiBody)({ type: materials_dto_1.UpdateInsufficientStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insufficient status successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, materials_dto_1.UpdateInsufficientStatusDto]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "updateInsufficientStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a material' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Material ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Material successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "remove", null);
exports.MaterialsController = MaterialsController = __decorate([
    (0, swagger_1.ApiTags)('Materials'),
    (0, common_1.Controller)('materials'),
    __metadata("design:paramtypes", [materials_service_1.MaterialsService])
], MaterialsController);
