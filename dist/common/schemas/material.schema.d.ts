import { Document, Types } from 'mongoose';
export type MaterialDocument = Material & Document;
export declare class Material {
    name: string;
    description?: string;
    category: string;
    supplierName: string;
    supplierContact?: string;
    project?: Types.ObjectId;
    stockQuantity: number;
    usedQuantity: number;
    requiredQuantity: number;
    costPerUnit: number;
    totalCost: number;
    unit?: string;
    expectedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    invoiceUrl?: string;
    grnUrl?: string;
    deliveryStatus: string;
    progressPercentage: number;
    documents: string[];
    remarks?: string;
    isInsufficient: boolean;
    isActive: boolean;
    is_deleted: boolean;
}
export declare const MaterialSchema: import("mongoose").Schema<Material, import("mongoose").Model<Material, any, any, any, Document<unknown, any, Material> & Material & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Material, Document<unknown, {}, import("mongoose").FlatRecord<Material>> & import("mongoose").FlatRecord<Material> & {
    _id: Types.ObjectId;
}>;
//# sourceMappingURL=material.schema.d.ts.map