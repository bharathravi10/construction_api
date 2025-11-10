import { CreateMaterialDto, UpdateMaterialDto, UpdateMaterialUsageDto, UpdateDeliveryStatusDto, UpdateInsufficientStatusDto } from './materials.dto';
import { MaterialsService } from './materials.service';
export declare class MaterialsController {
    private readonly materialsService;
    constructor(materialsService: MaterialsService);
    create(createMaterialDto: CreateMaterialDto): Promise<{
        message: string;
    }>;
    findAll(projectId?: string, category?: string, deliveryStatus?: string): Promise<any[]>;
    getInsufficientMaterials(projectId?: string): Promise<Partial<import("../../common/schemas/material.schema").Material>[]>;
    getMaterialsByProject(projectId: string): Promise<Partial<import("../../common/schemas/material.schema").Material>[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<Partial<import("../../common/schemas/material.schema").Material>>;
    updateUsage(id: string, updateUsageDto: UpdateMaterialUsageDto): Promise<Partial<import("../../common/schemas/material.schema").Material>>;
    updateDeliveryStatus(id: string, updateDeliveryDto: UpdateDeliveryStatusDto): Promise<Partial<import("../../common/schemas/material.schema").Material>>;
    updateInsufficientStatus(id: string, updateInsufficientDto: UpdateInsufficientStatusDto): Promise<Partial<import("../../common/schemas/material.schema").Material>>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=materials.controller.d.ts.map