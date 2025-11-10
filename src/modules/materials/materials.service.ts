import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Material, MaterialDocument } from '../../common/schemas/material.schema';
import { Project, ProjectDocument } from '../../common/schemas/projects.schema';
import { CreateMaterialDto, UpdateMaterialDto, UpdateMaterialUsageDto, UpdateDeliveryStatusDto, UpdateInsufficientStatusDto } from './materials.dto';

@Injectable()
export class MaterialsService {
  private readonly logger = new Logger(MaterialsService.name);

  constructor(
    @InjectModel(Material.name) private readonly materialModel: Model<MaterialDocument>,
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<{ message: string }> {
    try {
      // Validate project if provided
      if (createMaterialDto.project) {
        const project = await this.projectModel.findOne({ 
          _id: createMaterialDto.project, 
          is_deleted: false 
        }).exec();
        if (!project) {
          throw new NotFoundException('Project not found');
        }
      }

      // Calculate totalCost if costPerUnit and stockQuantity are provided
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create material', error.stack);
        throw error;
      } else {
        this.logger.error('Unknown error creating material', JSON.stringify(error));
        throw new Error('Failed to create material');
      }
    }
  }

  async findAll(filters?: { projectId?: string; category?: string; deliveryStatus?: string }): Promise<any[]> {
    try {
      const query: any = { is_deleted: false };

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

      // Manually populate project details
      const materialsWithProjects = await Promise.all(
        materials.map(async (material) => {
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
        })
      );

      return materialsWithProjects;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to fetch materials', error.stack);
        throw error;
      } else {
        this.logger.error('Unknown error fetching materials', JSON.stringify(error));
        throw new Error('Failed to fetch materials');
      }
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const material = await this.materialModel
        .findOne({ _id: id, is_deleted: false })
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!material) {
        throw new NotFoundException('Material not found');
      }

      // Manually populate project details
      let project = null;
      if (material.project && material.project.toString()) {
        project = await this.projectModel
          .findOne({ _id: material.project, is_deleted: false })
          .select('_id name status')
          .exec();
      }

      return { ...material.toObject(), project };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch material ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error fetching material ${id}`, JSON.stringify(error));
        throw new Error('Failed to fetch material');
      }
    }
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<Partial<Material>> {
    try {
      const existingMaterial = await this.materialModel.findOne({ _id: id, is_deleted: false }).exec();
      if (!existingMaterial) {
        throw new NotFoundException('Material not found');
      }

      // If project is being updated, validate it exists
      if (updateMaterialDto.project) {
        const project = await this.projectModel.findOne({ 
          _id: updateMaterialDto.project, 
          is_deleted: false 
        }).exec();
        if (!project) {
          throw new NotFoundException('Project not found');
        }
      }

      // Recalculate totalCost if costPerUnit or stockQuantity is being updated
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
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $set: updateData },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!material) {
        throw new NotFoundException('Material not found or deleted');
      }

      this.logger.log(`Material updated: ${id}`);
      return material.toObject();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update material ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error updating material ${id}`, JSON.stringify(error));
        throw new Error('Failed to update material');
      }
    }
  }

  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const material = await this.materialModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: { is_deleted: true, isActive: false } },
        { new: true }
      ).exec();

      if (!material) {
        throw new NotFoundException('Material not found');
      }

      this.logger.log(`Material soft-deleted: ${id}`);
      return { message: 'Material deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to delete material ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error deleting material ${id}`, JSON.stringify(error));
        throw new Error('Failed to delete material');
      }
    }
  }

  async updateUsage(id: string, updateUsageDto: UpdateMaterialUsageDto): Promise<Partial<Material>> {
    try {
      const material = await this.materialModel.findOne({ _id: id, is_deleted: false }).exec();
      if (!material) {
        throw new NotFoundException('Material not found');
      }

      // Add the new usage amount to the existing usedQuantity
      const newUsageAmount = updateUsageDto.usedQuantity;
      const updatedUsedQuantity = material.usedQuantity + newUsageAmount;
      const stockQuantity = material.stockQuantity;

      // Check if the total used quantity would exceed stock
      if (updatedUsedQuantity > stockQuantity) {
        throw new BadRequestException(`Cannot use ${updatedUsedQuantity} units. Only ${stockQuantity - material.usedQuantity} units remaining in stock.`);
      }

      // Calculate progress percentage
      const progressPercentage = material.requiredQuantity > 0
        ? (updatedUsedQuantity / material.requiredQuantity) * 100
        : 0;

      const updatedMaterial = await this.materialModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { 
            $set: { 
              usedQuantity: updatedUsedQuantity,
              progressPercentage
            }
          },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!updatedMaterial) {
        throw new NotFoundException('Material not found or deleted');
      }

      this.logger.log(`Material usage updated: ${id} - Added ${newUsageAmount}, Total: ${updatedUsedQuantity}`);
      return updatedMaterial.toObject();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update material usage ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error updating material usage ${id}`, JSON.stringify(error));
        throw new Error('Failed to update material usage');
      }
    }
  }

  async updateDeliveryStatus(id: string, updateDeliveryDto: UpdateDeliveryStatusDto): Promise<Partial<Material>> {
    try {
      const material = await this.materialModel.findOne({ _id: id, is_deleted: false }).exec();
      if (!material) {
        throw new NotFoundException('Material not found');
      }

      const updateData: any = {
        deliveryStatus: updateDeliveryDto.deliveryStatus,
      };

      if (updateDeliveryDto.actualDeliveryDate) {
        updateData.actualDeliveryDate = updateDeliveryDto.actualDeliveryDate;
      } else if (updateDeliveryDto.deliveryStatus === 'Delivered') {
        updateData.actualDeliveryDate = new Date();
      }

      const updatedMaterial = await this.materialModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $set: updateData },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!updatedMaterial) {
        throw new NotFoundException('Material not found or deleted');
      }

      this.logger.log(`Material delivery status updated: ${id}`);
      return updatedMaterial.toObject();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update delivery status ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error updating delivery status ${id}`, JSON.stringify(error));
        throw new Error('Failed to update delivery status');
      }
    }
  }

  async getInsufficientMaterials(projectId?: string): Promise<Partial<Material>[]> {
    try {
      const query: any = { 
        is_deleted: false,
        isInsufficient: true 
      };

      if (projectId) {
        // Try both ObjectId and string matching
        query.$or = [
          { project: new Types.ObjectId(projectId) },
          { project: projectId }
        ];
      }

      const materials = await this.materialModel
        .find(query)
        .select('_id name category requiredQuantity stockQuantity usedQuantity isInsufficient project')
        .sort({ createdAt: -1 })
        .exec();

      return materials.map(material => material.toObject());
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to fetch insufficient materials', error.stack);
        throw error;
      } else {
        this.logger.error('Unknown error fetching insufficient materials', JSON.stringify(error));
        throw new Error('Failed to fetch insufficient materials');
      }
    }
  }

  async getMaterialsByProject(projectId: string): Promise<Partial<Material>[]> {
    try {
      const project = await this.projectModel.findOne({ _id: projectId, is_deleted: false }).exec();
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const materials = await this.materialModel
        .find({ project: projectId, is_deleted: false })
        .select('-createdAt -updatedAt -__v -is_deleted')
        .sort({ createdAt: -1 })
        .exec();

      return materials.map(material => material.toObject());
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch materials for project ${projectId}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error fetching materials for project ${projectId}`, JSON.stringify(error));
        throw new Error('Failed to fetch materials for project');
      }
    }
  }

  async updateInsufficientStatus(id: string, updateInsufficientDto: UpdateInsufficientStatusDto): Promise<Partial<Material>> {
    try {
      const material = await this.materialModel.findOne({ _id: id, is_deleted: false }).exec();
      if (!material) {
        throw new NotFoundException('Material not found');
      }

      const updatedMaterial = await this.materialModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $set: { isInsufficient: updateInsufficientDto.isInsufficient } },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!updatedMaterial) {
        throw new NotFoundException('Material not found or deleted');
      }

      this.logger.log(`Material insufficient status updated: ${id} to ${updateInsufficientDto.isInsufficient}`);
      return updatedMaterial.toObject();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update insufficient status ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error updating insufficient status ${id}`, JSON.stringify(error));
        throw new Error('Failed to update insufficient status');
      }
    }
  }
}

