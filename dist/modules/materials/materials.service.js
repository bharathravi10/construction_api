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
var MaterialsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const material_schema_1 = require("../../common/schemas/material.schema");
const projects_schema_1 = require("../../common/schemas/projects.schema");
let MaterialsService = MaterialsService_1 = class MaterialsService {
    constructor(materialModel, projectModel) {
        this.materialModel = materialModel;
        this.projectModel = projectModel;
        this.logger = new common_1.Logger(MaterialsService_1.name);
    }
    async create(createMaterialDto) {
        try {
            if (createMaterialDto.project) {
                const project = await this.projectModel.findOne({
                    _id: createMaterialDto.project,
                    is_deleted: false
                }).exec();
                if (!project) {
                    throw new common_1.NotFoundException('Project not found');
                }
            }
            let totalCost = createMaterialDto.totalCost || 0;
            if (createMaterialDto.costPerUnit && createMaterialDto.stockQuantity) {
                totalCost = createMaterialDto.costPerUnit * createMaterialDto.stockQuantity;
            }
            const materialData = {
                ...createMaterialDto,
                totalCost,
            };
            const createdMaterial = new this.materialModel(materialData);
            await createdMaterial.save();
            this.logger.log(`Material created: ${createdMaterial._id}`);
            return { message: 'Material created successfully' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to create material', error.stack);
                throw error;
            }
            else {
                this.logger.error('Unknown error creating material', JSON.stringify(error));
                throw new Error('Failed to create material');
            }
        }
    }
    async findAll(filters) {
        try {
            const query = { is_deleted: false };
            if (filters?.projectId) {
                query.project = filters.projectId;
            }
            if (filters?.category) {
                query.category = filters.category;
            }
            if (filters?.deliveryStatus) {
                query.deliveryStatus = filters.deliveryStatus;
            }
            const materials = await this.materialModel
                .find(query)
                .select('-createdAt -updatedAt -__v -is_deleted')
                .sort({ createdAt: -1 })
                .exec();
            const materialsWithProjects = await Promise.all(materials.map(async (material) => {
                if (material.project && material.project.toString()) {
                    const project = await this.projectModel
                        .findOne({ _id: material.project, is_deleted: false })
                        .select('_id name status')
                        .exec();
                    if (project) {
                        return { ...material.toObject(), project };
                    }
                }
                return material.toObject();
            }));
            return materialsWithProjects;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to fetch materials', error.stack);
                throw error;
            }
            else {
                this.logger.error('Unknown error fetching materials', JSON.stringify(error));
                throw new Error('Failed to fetch materials');
            }
        }
    }
    async findOne(id) {
        try {
            const material = await this.materialModel
                .findOne({ _id: id, is_deleted: false })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!material) {
                throw new common_1.NotFoundException('Material not found');
            }
            let project = null;
            if (material.project && material.project.toString()) {
                project = await this.projectModel
                    .findOne({ _id: material.project, is_deleted: false })
                    .select('_id name status')
                    .exec();
            }
            return { ...material.toObject(), project };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch material ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error fetching material ${id}`, JSON.stringify(error));
                throw new Error('Failed to fetch material');
            }
        }
    }
    async update(id, updateMaterialDto) {
        try {
            const existingMaterial = await this.materialModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!existingMaterial) {
                throw new common_1.NotFoundException('Material not found');
            }
            if (updateMaterialDto.project) {
                const project = await this.projectModel.findOne({
                    _id: updateMaterialDto.project,
                    is_deleted: false
                }).exec();
                if (!project) {
                    throw new common_1.NotFoundException('Project not found');
                }
            }
            let totalCost = updateMaterialDto.totalCost;
            const costPerUnit = updateMaterialDto.costPerUnit ?? existingMaterial.costPerUnit;
            const stockQuantity = updateMaterialDto.stockQuantity ?? existingMaterial.stockQuantity;
            if (costPerUnit && stockQuantity) {
                totalCost = costPerUnit * stockQuantity;
            }
            const updateData = {
                ...updateMaterialDto,
                totalCost: totalCost ?? existingMaterial.totalCost,
            };
            const material = await this.materialModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updateData }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!material) {
                throw new common_1.NotFoundException('Material not found or deleted');
            }
            this.logger.log(`Material updated: ${id}`);
            return material.toObject();
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to update material ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error updating material ${id}`, JSON.stringify(error));
                throw new Error('Failed to update material');
            }
        }
    }
    async softDelete(id) {
        try {
            const material = await this.materialModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: { is_deleted: true, isActive: false } }, { new: true }).exec();
            if (!material) {
                throw new common_1.NotFoundException('Material not found');
            }
            this.logger.log(`Material soft-deleted: ${id}`);
            return { message: 'Material deleted successfully' };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to delete material ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error deleting material ${id}`, JSON.stringify(error));
                throw new Error('Failed to delete material');
            }
        }
    }
    async updateUsage(id, updateUsageDto) {
        try {
            const material = await this.materialModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!material) {
                throw new common_1.NotFoundException('Material not found');
            }
            const newUsageAmount = updateUsageDto.usedQuantity;
            const updatedUsedQuantity = material.usedQuantity + newUsageAmount;
            const stockQuantity = material.stockQuantity;
            if (updatedUsedQuantity > stockQuantity) {
                throw new common_1.BadRequestException(`Cannot use ${updatedUsedQuantity} units. Only ${stockQuantity - material.usedQuantity} units remaining in stock.`);
            }
            const progressPercentage = material.requiredQuantity > 0
                ? (updatedUsedQuantity / material.requiredQuantity) * 100
                : 0;
            const updatedMaterial = await this.materialModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, {
                $set: {
                    usedQuantity: updatedUsedQuantity,
                    progressPercentage
                }
            }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!updatedMaterial) {
                throw new common_1.NotFoundException('Material not found or deleted');
            }
            this.logger.log(`Material usage updated: ${id} - Added ${newUsageAmount}, Total: ${updatedUsedQuantity}`);
            return updatedMaterial.toObject();
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to update material usage ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error updating material usage ${id}`, JSON.stringify(error));
                throw new Error('Failed to update material usage');
            }
        }
    }
    async updateDeliveryStatus(id, updateDeliveryDto) {
        try {
            const material = await this.materialModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!material) {
                throw new common_1.NotFoundException('Material not found');
            }
            const updateData = {
                deliveryStatus: updateDeliveryDto.deliveryStatus,
            };
            if (updateDeliveryDto.actualDeliveryDate) {
                updateData.actualDeliveryDate = updateDeliveryDto.actualDeliveryDate;
            }
            else if (updateDeliveryDto.deliveryStatus === 'Delivered') {
                updateData.actualDeliveryDate = new Date();
            }
            const updatedMaterial = await this.materialModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updateData }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!updatedMaterial) {
                throw new common_1.NotFoundException('Material not found or deleted');
            }
            this.logger.log(`Material delivery status updated: ${id}`);
            return updatedMaterial.toObject();
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to update delivery status ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error updating delivery status ${id}`, JSON.stringify(error));
                throw new Error('Failed to update delivery status');
            }
        }
    }
    async getInsufficientMaterials(projectId) {
        try {
            const query = {
                is_deleted: false,
                isInsufficient: true
            };
            if (projectId) {
                query.$or = [
                    { project: new mongoose_2.Types.ObjectId(projectId) },
                    { project: projectId }
                ];
            }
            const materials = await this.materialModel
                .find(query)
                .select('_id name category requiredQuantity stockQuantity usedQuantity isInsufficient project')
                .sort({ createdAt: -1 })
                .exec();
            return materials.map(material => material.toObject());
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to fetch insufficient materials', error.stack);
                throw error;
            }
            else {
                this.logger.error('Unknown error fetching insufficient materials', JSON.stringify(error));
                throw new Error('Failed to fetch insufficient materials');
            }
        }
    }
    async getMaterialsByProject(projectId) {
        try {
            const project = await this.projectModel.findOne({ _id: projectId, is_deleted: false }).exec();
            if (!project) {
                throw new common_1.NotFoundException('Project not found');
            }
            const materials = await this.materialModel
                .find({ project: projectId, is_deleted: false })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .sort({ createdAt: -1 })
                .exec();
            return materials.map(material => material.toObject());
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch materials for project ${projectId}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error fetching materials for project ${projectId}`, JSON.stringify(error));
                throw new Error('Failed to fetch materials for project');
            }
        }
    }
    async updateInsufficientStatus(id, updateInsufficientDto) {
        try {
            const material = await this.materialModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!material) {
                throw new common_1.NotFoundException('Material not found');
            }
            const updatedMaterial = await this.materialModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $set: { isInsufficient: updateInsufficientDto.isInsufficient } }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!updatedMaterial) {
                throw new common_1.NotFoundException('Material not found or deleted');
            }
            this.logger.log(`Material insufficient status updated: ${id} to ${updateInsufficientDto.isInsufficient}`);
            return updatedMaterial.toObject();
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to update insufficient status ${id}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error updating insufficient status ${id}`, JSON.stringify(error));
                throw new Error('Failed to update insufficient status');
            }
        }
    }
};
exports.MaterialsService = MaterialsService;
exports.MaterialsService = MaterialsService = MaterialsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(material_schema_1.Material.name)),
    __param(1, (0, mongoose_1.InjectModel)(projects_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MaterialsService);
