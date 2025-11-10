import { Types } from 'mongoose';
export declare class CreateMaterialDto {
    readonly name: string;
    readonly description?: string;
    readonly category: string;
    readonly supplierName: string;
    readonly supplierContact?: string;
    readonly project?: Types.ObjectId;
    readonly stockQuantity?: number;
    readonly usedQuantity?: number;
    readonly requiredQuantity?: number;
    readonly costPerUnit?: number;
    readonly totalCost?: number;
    readonly unit?: string;
    readonly expectedDeliveryDate?: Date;
    readonly actualDeliveryDate?: Date;
    readonly invoiceUrl?: string;
    readonly grnUrl?: string;
    readonly deliveryStatus?: string;
    readonly progressPercentage?: number;
    readonly documents?: string[];
    readonly remarks?: string;
    readonly isActive?: boolean;
}
export declare class UpdateMaterialDto {
    readonly name?: string;
    readonly description?: string;
    readonly category?: string;
    readonly supplierName?: string;
    readonly supplierContact?: string;
    readonly project?: Types.ObjectId;
    readonly stockQuantity?: number;
    readonly usedQuantity?: number;
    readonly requiredQuantity?: number;
    readonly costPerUnit?: number;
    readonly totalCost?: number;
    readonly unit?: string;
    readonly expectedDeliveryDate?: Date;
    readonly actualDeliveryDate?: Date;
    readonly invoiceUrl?: string;
    readonly grnUrl?: string;
    readonly deliveryStatus?: string;
    readonly progressPercentage?: number;
    readonly documents?: string[];
    readonly remarks?: string;
    readonly isActive?: boolean;
}
export declare class UpdateMaterialUsageDto {
    readonly usedQuantity: number;
}
export declare class UpdateDeliveryStatusDto {
    readonly deliveryStatus: string;
    readonly actualDeliveryDate?: Date;
}
export declare class UpdateInsufficientStatusDto {
    readonly isInsufficient: boolean;
}
//# sourceMappingURL=materials.dto.d.ts.map