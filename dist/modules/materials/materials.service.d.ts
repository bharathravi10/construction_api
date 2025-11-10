import { Model } from 'mongoose';
import { Material, MaterialDocument } from '../../common/schemas/material.schema';
import { ProjectDocument } from '../../common/schemas/projects.schema';
import { CreateMaterialDto, UpdateMaterialDto, UpdateMaterialUsageDto, UpdateDeliveryStatusDto, UpdateInsufficientStatusDto } from './materials.dto';
export declare class MaterialsService {
    private readonly materialModel;
    private readonly projectModel;
    private readonly logger;
    constructor(materialModel: Model<MaterialDocument>, projectModel: Model<ProjectDocument>);
    create(createMaterialDto: CreateMaterialDto): Promise<{
        message: string;
    }>;
    findAll(filters?: {
        projectId?: string;
        category?: string;
        deliveryStatus?: string;
    }): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<Partial<Material>>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
    updateUsage(id: string, updateUsageDto: UpdateMaterialUsageDto): Promise<Partial<Material>>;
    updateDeliveryStatus(id: string, updateDeliveryDto: UpdateDeliveryStatusDto): Promise<Partial<Material>>;
    getInsufficientMaterials(projectId?: string): Promise<Partial<Material>[]>;
    getMaterialsByProject(projectId: string): Promise<Partial<Material>[]>;
    updateInsufficientStatus(id: string, updateInsufficientDto: UpdateInsufficientStatusDto): Promise<Partial<Material>>;
}
//# sourceMappingURL=materials.service.d.ts.map